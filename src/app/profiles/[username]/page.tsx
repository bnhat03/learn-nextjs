"use client";
import { useRef, useState, ChangeEvent } from "react";
import Link from "next/link";
import Posts from "@/components/Posts";
import { FaArrowLeft } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import useSWR from "swr";
import { useUser } from "@/context/UserContext";

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const { username } = useUser();
  const [coverImg, setCoverImg] = useState<string | null>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [feedType, setFeedType] = useState("profile");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const coverImgRef = useRef<HTMLInputElement>(null);
  const profileImgRef = useRef<HTMLInputElement>(null);

  const isMyProfile = username === params.username;

  const handleImgChange = (
    e: ChangeEvent<HTMLInputElement>,
    state: "coverImg" | "profileImg"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (state === "coverImg") {
          setCoverImg(result);
        } else if (state === "profileImg") {
          setProfileImg(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `${backendUrl}/api/users/${params.username}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (error) return <div>Error loading posts</div>;
  if (isLoading || !data) return <div>Loading...</div>;

  const user: IUser = data ? data : null;

  return (
    <>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
        {!isLoading && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link href="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user.fullName}</p>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={
                    `${backendUrl}${user?.avatar}` || "/avatar-placeholder.png"
                  }
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current?.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />
                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={
                        `${backendUrl}${user?.avatar}` ||
                        "/avatar-placeholder.png"
                      }
                    />
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current?.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {(coverImg || profileImg) && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={() => alert("Profile updated successfully")}
                  >
                    Update
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-stone-900 hover:text-zinc-50 transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("profile")}
                >
                  Bài viết
                  {feedType === "profile" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-black" />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-stone-900 hover:text-zinc-50 transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("likes")}
                >
                  Đã thích
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-black" />
                  )}
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType} userId={+user?.id} />
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
