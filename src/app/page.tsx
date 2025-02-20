"use client";
import { useRouter } from "next/navigation";
import Posts from "@/components/Posts";
import { useUser } from "@/context/UserContext";
import CreatePost from "@/components/CreatePost";

const HomePage = () => {
  const router = useRouter();
  const { isLoggedIn } = useUser();
  if (!isLoggedIn) {
    router.push("/auth/login");
  }
  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        <CreatePost />
        <Posts feedType="allposts" />
      </div>
    </>
  );
};
export default HomePage;
