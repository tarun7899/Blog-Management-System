const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/uploads",
    createProxyMiddleware({
      target: "http://localhost:5001",
      changeOrigin: true,
    })
  );
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5001",
      changeOrigin: true,
    })
  );
};
