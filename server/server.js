const express = require("express");
const path = require("path");
const userRouter = require("./routes/user-routes");
const blogRouter = require("./routes/blog-routes");
const helmet = require("helmet");
require("./config/db");
const cors = require("cors");

const app = express();

app.use(cors());

//setting helmet middleware
app.use(helmet(
  {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  }
));

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

app.use("/api", (req, res, next) => {
  res.send("hello");
});

//define port

app.listen(5001, () => console.log("app started at 5001..."));
