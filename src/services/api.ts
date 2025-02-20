import axios from "axios";
import toast from "react-hot-toast";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Axios instance
const api = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  },
});

// Interceptor => thêm token vào request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.url !== "/api/auth/login") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor => xử lý lỗi từ API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Có lỗi xảy ra!";
    toast.error(message);
    return Promise.reject(error);
  }
);

// API calls: post
export const deletePost = async (postId: number) => {
  return api.delete(`/api/posts/${postId}`);
};
export const postComment = async (postId: number, content: string) => {
  return api.post(`/api/posts/${postId}/comments`, { content });
};
export const likeUnlikePost = async (postId: number, isLiked: boolean) => {
  return isLiked
    ? api.delete(`/api/likes/${postId}`)
    : api.post(`/api/posts/${postId}/likes`);
};
export const createPost = async (content: string, image?: File) => {
  const formData = new FormData();
  formData.append("content", content);
  if (image) {
    formData.append("image", image);
  }
  return api.post("/api/posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
// auth
export const login = async (email: string, password: string) => {
  return api.post("/api/auth/login", { email, password });
};

export default api;
