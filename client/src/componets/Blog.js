import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useStyles } from "./utils";
import config from "../config";
import BlogImages from "./BlogImages";

const Blog = ({ title, desc, img, images, user, isUser, id, onDelete, returnPath = "/blogs" }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/myBlogs/${id}`, { state: { returnPath } });
  };

  const deleteRequest = async () => {
    try {
      await axios.delete(`${config.BASE_URL}/api/blogs/${id}`);
      return true;
    } catch (err) {
      console.error("Delete error:", err);
      return false;
    }
  };

  const handleDelete = () => {
    deleteRequest().then((success) => {
      if (!success) return;
      if (onDelete) {
        onDelete();
      } else {
        navigate("/blogs");
      }
    });
  };

  if (!title) {
    return null;
  }

  return (
    <Card
      sx={{
        width: { xs: "95%", sm: "80%", md: "60%", lg: "45%" },
        maxWidth: 720,
        minWidth: 280,
        margin: "16px auto",
        padding: 2,
        boxShadow: "5px 5px 10px #ccc",
        ":hover": {
          boxShadow: "10px 10px 20px #ccc",
        },
      }}
    >
      {isUser && (
        <Box display="flex">
          <IconButton onClick={handleEdit} sx={{ marginLeft: "auto" }}>
            <ModeEditOutlineIcon color="warning" />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <DeleteForeverIcon color="error" />
          </IconButton>
        </Box>
      )}
      <CardHeader
        avatar={
          <Avatar
            className={classes.font}
            sx={{ bgcolor: "red" }}
            aria-label="recipe"
          >
            {user && typeof user === "string" ? user.charAt(0) : "?"}
          </Avatar>
        }
        title={title}
      />
      <BlogImages img={img} images={images} title={title} />

      <CardContent>
        <Typography
          className={classes.font}
          variant="body2"
          color="text.secondary"
        >
          <b>{user || "Unknown"}</b>
          {": "}
          {desc || "No description"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Blog;
