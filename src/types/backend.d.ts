interface IUser {
  id: number;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
}

interface IComment {
  id: number;
  user: IUser;
  content: string;
}

interface ILike {
  id: number;
  userId: string;
}

interface IPost {
  id: number;
  user: IUser;
  content: string;
  image?: string; // Trường img có thể không có
  comments: IComment[];
  likes: ILike[];
}

interface PostsProps {
  userId?: number;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface IProps {
  post: IPost;
  feedType?: string;
}

interface PostsProps {
  feedType?: string;
  userId?: number;
}
