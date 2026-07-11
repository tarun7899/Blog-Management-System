import { Box } from "@mui/material";
import React from "react";
import { getBlogImageList } from "../utils/image";

const BlogImages = ({ img, images, title, height = 220 }) => {
  const imageList = getBlogImageList({ img, images });

  if (!imageList.length) {
    return null;
  }

  if (imageList.length === 1) {
    return (
      <Box
        component="img"
        src={imageList[0]}
        alt={title}
        sx={{
          width: "100%",
          height,
          objectFit: "cover",
          display: "block",
          borderRadius: 1,
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 1,
      }}
    >
      {imageList.map((src, index) => (
        <Box
          key={`${src}-${index}`}
          component="img"
          src={src}
          alt={`${title} ${index + 1}`}
          sx={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            display: "block",
            borderRadius: 1,
          }}
        />
      ))}
    </Box>
  );
};

export default BlogImages;
