"use client";

import React, { useState } from "react";
import { FaRegComment, FaTrash, FaRegHeart } from "react-icons/fa";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { deletePost, postComment, likeUnlikePost } from "@/services/api";

const Post: React.FC<IProps> = ({ post, feedType }) => {
  const { userId } = useUser();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [comment, setComment] = useState<string>("");
  const postOwner = post.user;
  const isLiked = post.likes?.some((like) => like?.userId === userId) ?? false;
  const isMyPost = String(postOwner.id) === String(userId);

  const handleDeletePost = async () => {
    try {
      if (confirm(`Bạn muốn xóa post này (id = ${post.id})`)) {
        await deletePost(post.id);
        toast.success("Xóa bài viết thành công!");
        await mutate(`${backendUrl}/api/posts`, undefined, {
          revalidate: true,
        });
        await mutate(
          `${backendUrl}/api/posts/user/${postOwner.id}`,
          undefined,
          {
            revalidate: true,
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await postComment(post.id, comment);
      toast.success("Bình luận thành công!");
      setComment("");
      await mutate(`${backendUrl}/api/posts`, undefined, {
        revalidate: true,
      });
      await mutate(`${backendUrl}/api/posts/user/${postOwner.id}`, undefined, {
        revalidate: true,
      });
    } catch {}
  };

  const handleLikeUnlikePost = async () => {
    try {
      await likeUnlikePost(post.id, isLiked);
      toast.success("Cập nhật like thành công!");
      await mutate(`${backendUrl}/api/posts`, undefined, {
        revalidate: true,
      });
      await mutate(`${backendUrl}/api/posts/user/${postOwner.id}`, undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      <div className="avatar w-8 h-8">
        <Link
          href={`/profiles/${postOwner.username}`}
          className="rounded-full overflow-hidden"
        >
          <img
            src={
              `${backendUrl}${postOwner.avatar}` || "/avatar-placeholder.png"
            }
            alt={`${postOwner.username} avatar`}
          />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link href={`/profiles/${postOwner.username}`} className="font-bold">
            {postOwner.fullName}
          </Link>
          <span className="text-gray-700 flex gap-1 text-sm">
            <Link href={`/profiles/${postOwner.username}`}>
              @{postOwner.username}
            </Link>
          </span>
          {isMyPost && (
            <span className="flex justify-end flex-1">
              <FaTrash
                className="cursor-pointer hover:text-red-500"
                onClick={handleDeletePost}
              />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden">
          <span>{post.content}</span>
          {post.image && (
            <img
              src={`${backendUrl}${post.image}`}
              className="h-80 object-contain rounded-lg border border-gray-700"
              alt="Post image"
            />
          )}
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() => {
                const modal = document.getElementById(
                  "comments_modal" + post.id
                ) as HTMLDialogElement;
                modal?.showModal();
              }}
            >
              <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
              <span className="text-sm text-slate-500 group-hover:text-sky-400">
                {post.comments.length}
              </span>
            </div>
            {/* Modal DaisyUI */}
            <dialog
              id={`comments_modal${post.id}`}
              className="modal border-none outline-none"
            >
              <div className="modal-box rounded border border-gray-600">
                <h3 className="font-bold text-lg mb-4">BÌNH LUẬN</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                  {post.comments.length === 0 && (
                    <p className="text-sm text-slate-500">Chưa có bình luận</p>
                  )}
                  {post.comments.map((commentItem) => (
                    <div
                      key={commentItem.id}
                      className="flex gap-2 items-start"
                    >
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              `${backendUrl}${commentItem.user.avatar}` ||
                              "/avatar-placeholder.png"
                            }
                            alt={`${commentItem.user.username} avatar`}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold">
                            {commentItem.user.fullName}
                          </span>
                          <span className="text-gray-700 text-sm">
                            @{commentItem.user.username}
                          </span>
                        </div>
                        <div className="text-sm">{commentItem.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                  onSubmit={handlePostComment}
                >
                  <textarea
                    className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
                    placeholder="Viết bình luận..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                    Post
                  </button>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">close</button>
              </form>
            </dialog>
            <div
              className="flex gap-1 items-center group cursor-pointer"
              onClick={() => handleLikeUnlikePost()}
            >
              {!isLiked ? (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
              ) : (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />
              )}
              <span
                className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                  isLiked ? "text-pink-500" : ""
                }`}
              >
                {post.likes.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
