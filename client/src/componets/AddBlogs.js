import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import config from "../config";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./utils";

const labelStyles = { mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" };

const AddBlogs = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    imageURL: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;

    if (e.target.name === "imageURL" && value) {
      if (
        value.includes(":\\") ||
        value.includes("C:\\") ||
        value.includes("D:\\") ||
        value.startsWith("\\")
      ) {
        return;
      }
    }

    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      setSelectedFiles([]);
      setPreviews([]);
      return;
    }

    setSelectedFiles(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const sendRequest = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("You must be logged in to add a blog.");
      return null;
    }

    try {
      const formData = new FormData();
      formData.append("title", inputs.title.trim());
      formData.append("desc", inputs.description.trim());
      formData.append("user", userId);

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (inputs.imageURL.trim()) {
        formData.append("img", inputs.imageURL.trim());
      }

      const res = await axios.post(`${config.BASE_URL}/api/blogs/add`, formData);
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to add blog.";
      console.error("Add blog error:", err);
      setError(message);
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    sendRequest()
      .then((data) => {
        if (data?.success) {
          navigate("/blogs");
        }
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          borderRadius={10}
          boxShadow="10px 10px 20px #ccc"
          padding={3}
          margin={"auto"}
          marginTop={3}
          display="flex"
          flexDirection={"column"}
          width={"80%"}
        >
          <Typography
            className={classes.font}
            padding={1}
            color="text.secondary"
            variant="h6"
            textAlign={"center"}
          >
            Create a new blog post
          </Typography>
          <InputLabel className={classes.font} sx={labelStyles}>
            Title
          </InputLabel>
          <TextField
            className={classes.font}
            name="title"
            onChange={handleChange}
            value={inputs.title}
            fullWidth
            variant="outlined"
            required
          />
          <InputLabel className={classes.font} sx={labelStyles}>
            Description
          </InputLabel>
          <TextareaAutosize
            className={classes.font}
            name="description"
            onChange={handleChange}
            minRows={10}
            style={{ width: "100%" }}
            value={inputs.description}
            required
          />
          <InputLabel className={classes.font} sx={labelStyles}>
            Upload Images (optional)
          </InputLabel>
          <Button variant="outlined" component="label" sx={{ alignSelf: "flex-start" }}>
            Choose Images
            <input
              type="file"
              hidden
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </Button>
          {previews.length > 0 && (
            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 1,
              }}
            >
              {previews.map((preview, index) => (
                <Box
                  key={preview}
                  component="img"
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  sx={{ maxHeight: 160, borderRadius: 2, objectFit: "cover" }}
                />
              ))}
            </Box>
          )}
          <InputLabel className={classes.font} sx={labelStyles}>
            Or paste Image URLs (optional)
          </InputLabel>
          <TextField
            className={classes.font}
            name="imageURL"
            onChange={handleChange}
            value={inputs.imageURL}
            fullWidth
            variant="outlined"
            placeholder="https://example.com/one.jpg, https://example.com/two.jpg"
            disabled={selectedFiles.length > 0}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Images are optional. Supports JPG, PNG, GIF, WEBP, BMP, SVG, TIFF, HEIC, AVIF and other image formats.
          </Typography>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            sx={{ mt: 2, borderRadius: 4 }}
            variant="contained"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default AddBlogs;
