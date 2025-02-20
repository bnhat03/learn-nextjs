"use client";
import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import toast from "react-hot-toast";
import { CiImageOn } from "react-icons/ci";
import { mutate } from "swr";
import { useUser } from "@/context/UserContext";

const CreatePost: React.FC = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [content, setContent] = useState<string>("");
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userId } = useUser();
  // Thay đổi file ảnh post
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

  // Đăng ảnh
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authorized");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }
      const response = await fetch(`${backendUrl}/api/posts/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create post");
      }

      const data = await response.json();
      toast.success("Post created successfully!");

      // Reset form
      setContent("");
      setImgPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      //useSWR =>  đồng bộ dữ liệu
      await mutate(`${backendUrl}/api/posts`, undefined, {
        revalidate: true,
      });
      await mutate(`${backendUrl}/api/posts/user/${userId}`, undefined, {
        revalidate: true,
      });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!");
      console.error(error);
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
        <div className="flex gap-1 items-center">
          <CiImageOn
            className="fill-primary w-6 h-6 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          />
        </div>
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
