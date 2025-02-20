import React from "react";
import Post from "./Post";
import useSWR from "swr";

const Posts: React.FC<PostsProps> = ({ feedType, userId }) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const baseUrl =
    feedType !== "likes"
      ? `${backendUrl}/api/posts`
      : `${backendUrl}/api/likes`;
  const url = userId ? `${baseUrl}/user/${userId}` : baseUrl;

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (error) return <div>Error loading posts</div>;
  if (isLoading || !data) return <div>Loading...</div>;

  const posts: IPost[] =
    data?.data && Array.isArray(data.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];

  if (posts.length === 0) {
    return <p className="text-center my-4">Không có bài viết nào</p>;
  }

  return (
    <>
      {posts?.map((post: IPost) => (
        <Post key={post.id} post={post} feedType={feedType} />
      ))}
    </>
  );
};

export default Posts;
