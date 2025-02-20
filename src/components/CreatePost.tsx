"use client";
import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import { toast } from "react-toastify";
import { CiImageOn } from "react-icons/ci";
import { useSWRConfig } from "swr";
import { useUser } from "@/context/UserContext";
import { createPost } from "@/services/api";

const CreatePost: React.FC = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [content, setContent] = useState<string>("");
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userId } = useUser();
  const { mutate } = useSWRConfig(); // Hook từ SWR để revalidate data

  // Xử lý chọn file ảnh
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImgPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý gửi form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const imageFile = fileInputRef.current?.files?.[0];

      await createPost(content, imageFile);
      toast.success("Post created successfully!");

      // Reset form
      setContent("");
      setImgPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Revalidate dữ liệu để cập nhật bài post mới
      await mutate(`${backendUrl}/api/posts`, undefined, {
        revalidate: true,
      });
      await mutate(`${backendUrl}/api/posts/user/${userId}`, undefined, {
        revalidate: true,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.error("Error creating post:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border border-b-black"
    >
      <textarea
        placeholder="Viết bình luận ..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="textarea w-full p-2 border rounded"
      />
      {imgPreview && (
        <div className="relative w-72 mx-auto">
          <img
            src={imgPreview}
            alt="Preview"
            className="w-full h-72 object-contain rounded"
          />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex items-center justify-between">
        <CiImageOn
          className="fill-primary w-6 h-6 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        />
        <button
          type="submit"
          className="btn btn-primary rounded-full text-white px-4"
        >
          Post
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
