/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Box } from "@mui/material";
import Blog from "./Blog";
import config from "../config";

const UserBlogs = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = localStorage.getItem("userId");

  const fetchUserBlogs = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}/api/blogs/user/${id}`);
      return res.data?.data?.user || null;
    } catch (err) {
      console.error("User blogs error:", err);
      return null;
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUserBlogs().then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = () => {
    fetchUserBlogs().then((data) => setUser(data));
  };

  if (loading) {
    return (
      <Typography textAlign="center" mt={5}>
        Loading your blogs...
      </Typography>
    );
  }

  if (!user?.blogs?.length) {
    return (
      <Typography textAlign="center" mt={5} variant="h6">
        You have not added any blogs yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {user.blogs.map((blog) => (
        <Blog
          key={blog._id}
          id={blog._id}
          isUser={true}
          title={blog.title}
          desc={blog.desc || blog.description}
          img={blog.img || blog.image}
          images={blog.images}
          user={user.name}
          onDelete={handleDelete}
          returnPath="/myBlogs"
        />
      ))}
    </Box>
  );
};

export default UserBlogs;
