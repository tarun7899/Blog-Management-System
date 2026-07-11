import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import Header from './componets/Header';
import React, { useEffect } from 'react';
import Login from './componets/Login';
import Blogs from './componets/Blogs';
import UserBlogs from './componets/UserBlogs'
import AddBlogs from './componets/AddBlogs'
import BlogDetail from './componets/BlogDetail'
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './store';

const HomeRedirect = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userId = localStorage.getItem("userId");

  if (isLoggedIn || userId) {
    return <Navigate to="/blogs" replace />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(authActions.login());
    }
  }, [dispatch]);
  
  return (
    <React.Fragment>
      <Header />
      <main style={{ backgroundColor: "#f8f9fa", minHeight: "calc(100vh - 140px)" }}>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/myBlogs" element={<UserBlogs />} />
          <Route path="/myBlogs/:id" element={<BlogDetail />} />
          <Route path="/blogs/add" element={<AddBlogs />} />
        </Routes>
      </main>
    </React.Fragment>
  );
}

export default App;
