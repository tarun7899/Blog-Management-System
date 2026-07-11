import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import BlogView from "./BlogView";
import config from "../config";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.BASE_URL}/api/blogs`);
      const blogsArray = res.data?.data?.blogs;
      setBlogs(Array.isArray(blogsArray) ? blogsArray : []);
    } catch (err) {
      console.error("API Error:", err);
      setBlogs([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs, location.key]);

  if (loading) {
    return (
      <Typography textAlign="center" mt={5}>
        Loading blogs...
      </Typography>
    );
  }

  if (blogs.length === 0) {
    return (
      <Typography textAlign="center" mt={5} variant="h6">
        No blogs found. Be the first to add a blog!
      </Typography>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {blogs.map((blog) =>
        blog?._id ? (
          <BlogView
            key={blog._id}
            title={blog.title}
            desc={blog.desc}
            img={blog.img}
            images={blog.images}
            user={blog.user?.name || "Unknown"}
            date={
              blog.date
                ? new Date(blog.date).toLocaleDateString()
                : ""
            }
          />
        ) : null
      )}
    </Box>
  );
};

export default Blogs;
