import config from "../config";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1499750310107-5fef28fd717f?w=600&h=400&fit=crop";

export const getBlogImageSrc = (img) => {
  if (!img || typeof img !== "string") {
    return DEFAULT_IMAGE;
  }

  const trimmed = img.trim().replace(/^"+|"+$/g, "");

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/uploads/")) {
    return `${config.BASE_URL}${trimmed}`;
  }

  return DEFAULT_IMAGE;
};

export const getBlogImageList = ({ img, images } = {}) => {
  const list =
    Array.isArray(images) && images.length > 0
      ? images
      : img
        ? [img]
        : [];

  return list
    .filter((item) => item && typeof item === "string" && item.trim())
    .map((item) => {
      const trimmed = item.trim().replace(/^"+|"+$/g, "");

      if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("data:")
      ) {
        return trimmed;
      }

      if (trimmed.startsWith("/uploads/")) {
        return `${config.BASE_URL}${trimmed}`;
      }

      return null;
    })
    .filter(Boolean);
};

export default getBlogImageSrc;
