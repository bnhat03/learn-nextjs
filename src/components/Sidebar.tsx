import { MdHomeFilled } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { BiLogOut } from "react-icons/bi";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
const Sidebar = () => {
  const router = useRouter();
  const { username, setIsLoggedIn, setUsername, setUserId } = useUser();
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername(null);
    setUserId(null);
    router.push("/auth/login");
  };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              href="/"
              className="flex gap-3 items-center hover:bg-stone-900 hover:text-zinc-50 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Trang chủ</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              href={`/profiles/${username}`}
              className="flex gap-3 items-center hover:bg-stone-900 hover:text-zinc-50 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Trang cá nhân</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <div
              className="flex gap-3 items-center hover:bg-stone-900 hover:text-zinc-50 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              <BiLogOut className="w-6 h-6" />
              <span className="text-lg hidden md:block">Đăng xuất</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
