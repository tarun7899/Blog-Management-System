import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import BlogImages from "./BlogImages";

const BlogView = ({ title, desc, img, images, user, date }) => {
  if (!title) return null;

  const authorName = user || "Unknown";
  const formattedDate = date || "";

  return (
    <Card
      sx={{
        width: { xs: "95%", sm: "85%", md: "70%", lg: "55%" },
        maxWidth: 800,
        margin: "20px auto",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          mb={2}
          sx={{
            bgcolor: "#f0f4f8",
            borderRadius: 1,
            p: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48, fontSize: 22 }}>
            {authorName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Posted by
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {authorName}
            </Typography>
            {formattedDate && (
              <Typography variant="body2" color="text.secondary">
                {formattedDate}
              </Typography>
            )}
          </Box>
        </Box>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {title}
        </Typography>

        <Box mb={2}>
          <BlogImages img={img} images={images} title={title} height={240} />
        </Box>

        <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
          {desc || "No description"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BlogView;
