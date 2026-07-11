import { Button, InputLabel, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import config from "../config";
import { getBlogImageSrc } from "../utils/image";

const labelStyles = { mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" };

const BlogDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const returnPath = location.state?.returnPath || "/myBlogs";

  const [inputs, setInputs] = useState({ title: "", description: "", imageURL: "" });
  const [blog, setBlog] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreview("");
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const fetchDetails = useCallback(async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}/api/blogs/${id}`);
      const blogData = res.data?.data?.blog;
      setBlog(blogData);
      setInputs({
        title: blogData?.title || "",
        description: blogData?.desc || blogData?.description || "",
        imageURL: "",
      });
      setPreview(getBlogImageSrc(blogData?.img));
    } catch (err) {
      console.error("Failed to fetch blog details:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const sendRequest = async () => {
    try {
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("desc", inputs.description);

      if (selectedFile) {
        formData.append("images", selectedFile);
      } else if (inputs.imageURL.trim()) {
        formData.append("img", inputs.imageURL.trim());
      }

      const res = await axios.put(`${config.BASE_URL}/api/blogs/update/${id}`, formData);
      return res.data;
    } catch (err) {
      console.error("Failed to update blog:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then((data) => {
      if (data) {
        navigate(returnPath);
      }
    });
  };

  return (
    <div>
      {blog ? (
        <form onSubmit={handleSubmit}>
          <Box
            border={3}
            borderColor="linear-gradient(90deg, rgba(58,75,180,1) 2%, rgba(116,49,110,1) 36%, rgba(2,0,161,1) 73%, rgba(69,92,252,1) 100%)"
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
              fontWeight={"bold"}
              padding={3}
              color="grey"
              variant="h2"
              textAlign={"center"}
            >
              Update Blog
            </Typography>
            <InputLabel sx={labelStyles}>Title</InputLabel>
            <TextField
              name="title"
              onChange={handleChange}
              value={inputs.title}
              fullWidth
              variant="outlined"
              required
            />
            <InputLabel sx={labelStyles}>Description</InputLabel>
            <TextField
              name="description"
              onChange={handleChange}
              value={inputs.description}
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              required
            />
            <InputLabel sx={labelStyles}>Current Image</InputLabel>
            {preview && (
              <Box
                component="img"
                src={preview}
                alt="Blog preview"
                sx={{ maxHeight: 200, borderRadius: 2, objectFit: "cover", mb: 2 }}
              />
            )}
            <Button variant="outlined" component="label" sx={{ alignSelf: "flex-start" }}>
              Change Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            <InputLabel sx={labelStyles}>Or paste new Image URL (optional)</InputLabel>
            <TextField
              name="imageURL"
              onChange={handleChange}
              value={inputs.imageURL}
              fullWidth
              variant="outlined"
              placeholder="https://example.com/image.jpg"
              disabled={!!selectedFile}
            />
            <Button
              sx={{ mt: 2, borderRadius: 4 }}
              variant="contained"
              color="warning"
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </form>
      ) : (
        <Typography textAlign="center" mt={5} variant="h5">
          Loading blog details...
        </Typography>
      )}
    </div>
  );
};

export default BlogDetail;
