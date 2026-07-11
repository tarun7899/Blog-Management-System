import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authActions } from "../store";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const navItems = [
  { label: "All Blogs", path: "/blogs" },
  { label: "My Blogs", path: "/myBlogs" },
  { label: "Add Blog", path: "/blogs/add" },
];

const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/blogs") {
      return location.pathname === "/blogs";
    }
    return location.pathname.startsWith(path);
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { isSignupButtonPressed: false } });
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/login");
  };

  return (
    <Box
      component="header"
      sx={{
        bgcolor: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
        py: 3,
        px: 2,
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight={600}
        color="text.primary"
        letterSpacing={0.5}
      >
        Blog Management System
      </Typography>

      {isLoggedIn ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          gap={1.5}
          mt={2.5}
        >
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              variant={isActive(item.path) ? "contained" : "outlined"}
              sx={{
                textTransform: "none",
                minWidth: 110,
                borderRadius: 1,
              }}
            >
              {item.label}
            </Button>
          ))}
          <Button
            onClick={handleLogout}
            color="inherit"
            sx={{ textTransform: "none", ml: 1 }}
          >
            Logout
          </Button>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" mt={2.5}>
          <Button variant="contained" onClick={handleLoginClick} sx={{ textTransform: "none" }}>
            Login
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Header;
