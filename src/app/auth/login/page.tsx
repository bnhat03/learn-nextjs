"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { setUserId, setIsLoggedIn, setUsername } = useUser();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log("formData: ", formData);
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không đúng email hoặc mật khẩu");
      }
      const data = await res.json();
      toast.success(data.message || "Login succeed!");
      localStorage.setItem("token", data.token);

      // context api
      if (data.userId) {
        setUserId(data.userId);
        setIsLoggedIn(true);
        setUsername(data.username);
      }
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
      setError(err.message);
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
