const express = require("express")
const blogRouter = express.Router();
const upload = require("../middleware/upload");
const { getAllBlogs , addBlog ,
     updateBlog ,getById , 
    deleteBlog , getByUserId} = require("../controller/blog-controller");

blogRouter.get("/",getAllBlogs);
blogRouter.post('/add', (req, res, next) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, addBlog);
blogRouter.put("/update/:id", (req, res, next) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, updateBlog);
blogRouter.get("/user/:id",getByUserId);
blogRouter.get("/:id", getById);
blogRouter.delete("/:id",deleteBlog);
module.exports = blogRouter;