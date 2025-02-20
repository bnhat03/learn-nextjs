// components/SidebarWrapper.tsx
"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/context/UserContext";

const SidebarWrapper: React.FC = () => {
  const { isLoggedIn } = useUser();
  if (!isLoggedIn) {
    return null;
  }

  return <Sidebar />;
};

export default SidebarWrapper;
