"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { login } from "@/services/api";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { setUserId, setIsLoggedIn, setUsername } = useUser();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await login(formData.email, formData.password);
      toast.success(data.message || "Login successful!");
      localStorage.setItem("token", data.token);
      // Cập nhật context API
      setUserId(data.userId);
      setIsLoggedIn(true);
      setUsername(data.username);
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong!");
      console.log(error);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Your Password"
          value={formData.password}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary rounded-full text-white"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
