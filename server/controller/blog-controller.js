const mongoose = require("mongoose");
const Blog = require("../model/Blog");
const User = require("../model/User");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1499750310107-5fef28fd717f?w=600&h=400&fit=crop";

const isValidImagePath = (value) => {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim().replace(/^"+|"+$/g, "");
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/uploads/") ||
    trimmed.startsWith("data:")
  );
};

const parseImageUrls = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(isValidImagePath);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(isValidImagePath);
  }

  return [];
};

const getImagesFromRequest = (req) => {
  const images = [];

  if (req.files?.length) {
    req.files.forEach((file) => {
      images.push(`/uploads/${file.filename}`);
    });
  }

  parseImageUrls(req.body.img).forEach((url) => images.push(url));

  return images;
};

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate('user');
    console.log("Retrieved blogs:", blogs);
    return res.status(200).json(new ApiResponse(200, { blogs: blogs || [] }, "Blogs found"));
  } catch (e) {
    console.log("Error in getAllBlogs:", e);
    return res.status(500).json(new ApiError(500, e.message));
  }
};

const addBlog = async (req, res, next) => {
  const { title, desc, user } = req.body;
  const images = getImagesFromRequest(req);
  const currentDate = new Date();

  console.log("AddBlog Request:", { title, desc, images, user });

  try {
    const existingUser = await User.findById(user);
    console.log("Found User:", existingUser);
    if (!existingUser) {
      console.log("User not found");
      return res.status(400).json(new ApiError(400, "Unauthorized"));
    }

    const blog = new Blog({
      title,
      desc,
      images,
      img: images[0] || "",
      user,
      date: currentDate,
    });
    console.log("Created Blog object:", blog);

    await blog.save();
    console.log("Blog saved");
    
    existingUser.blogs.push(blog);
    await existingUser.save();
    console.log("User updated");

    return res.status(201).json(new ApiResponse(201, { blog }, "Blog created successfully"));
  } catch (e) {
    console.log("Error in addBlog:", e);
    return res.status(500).json(new ApiError(500, e.message));
  }
};

const updateBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const { title, desc } = req.body;

  try {
    const updateFields = { title, desc };

    if (req.files?.length) {
      const uploadedImages = req.files.map((file) => `/uploads/${file.filename}`);
      updateFields.images = uploadedImages;
      updateFields.img = uploadedImages[0];
    } else if (req.body.img?.trim()) {
      const urlImages = parseImageUrls(req.body.img);
      if (urlImages.length) {
        updateFields.images = urlImages;
        updateFields.img = urlImages[0];
      }
    }

    const blog = await Blog.findByIdAndUpdate(blogId, updateFields, { new: true });
    if (!blog) {
      return res.status(404).json(new ApiError(404, "Blog not found"));
    }
    return res.status(200).json(new ApiResponse(200, { blog }, "Blog updated successfully"));
  } catch (e) {
    return res.status(500).json(new ApiError(500, e.message));
  }
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json(new ApiError(404, "Blog not found"));
    }
    return res.status(200).json(new ApiResponse(200, { blog }, "Blog retrieved successfully"));
  } catch (e) {
    return res.status(500).json(new ApiError(500, e.message));
  }
};

const deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findByIdAndDelete(id).populate('user');
    if (!blog) {
      return res.status(404).json(new ApiError(404, "Blog not found"));
    }

    const user = blog.user;
    user.blogs.pull(blog);
    await user.save();

    return res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully"));
  } catch (e) {
    return res.status(500).json(new ApiError(500, e.message));
  }
};

const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const userBlogs = await User.findById(userId).populate("blogs");
    if (!userBlogs) {
      return res.status(404).json(new ApiError(404, "No blog found for this user"));
    }
    return res.status(200).json(new ApiResponse(200, { user: userBlogs }, "Blogs retrieved successfully"));
  } catch (e) {
    return res.status(500).json(new ApiError(500, e.message));
  }
};

module.exports = { getAllBlogs, addBlog, updateBlog, getById, deleteBlog, getByUserId };