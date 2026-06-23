// components/Leftdashboard.jsx
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FilePlus,
  FilePenLine,
  Trash2,
  Users,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Leftdashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    // Check if user is admin, if not redirect
    if (!token || userRole !== "admin") {
      console.log("Access denied - Not admin");
      navigate("/");
    } else {
      setIsAdmin(true);
    }
  }, [navigate]);

  const handleCreateBlog = () => navigate("/createblog");
  const handleUpdateBlog = () => navigate("/updateblog");
  const handleDeleteBlog = () => navigate("/deleteblog");
  const handleUsers = () => navigate("/user");
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  // Don't render if not admin
  if (!isAdmin) return null;

  return (
    <div className="fixed top-0 left-0 w-[20%] h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white rounded-tr-2xl shadow-2xl flex flex-col justify-between p-6 border-r border-gray-700">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mt-12 mb-6">
          <LayoutDashboard className="text-blue-400" size={28} />
          <h2 className="text-2xl font-bold tracking-wide text-blue-400">
            Admin Panel
          </h2>
        </div>

        {/* Blog Management Section */}
        <div className="mt-8">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
            Blog Management
          </h3>
          <ul className="space-y-2">
            <li
              onClick={handleCreateBlog}
              className="flex items-center gap-3 hover:bg-gray-800 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:translate-x-1"
            >
              <FilePlus size={20} /> <span>Create Blog</span>
            </li>
            <li
              onClick={handleUpdateBlog}
              className="flex items-center gap-3 hover:bg-gray-800 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:translate-x-1"
            >
              <FilePenLine size={20} /> <span>Update Blog</span>
            </li>
            <li
              onClick={handleDeleteBlog}
              className="flex items-center gap-3 hover:bg-gray-800 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:translate-x-1"
            >
              <Trash2 size={20} /> <span>Delete Blog</span>
            </li>
            <li
              onClick={handleUsers}
              className="flex items-center gap-3 hover:bg-gray-800 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:translate-x-1"
            >
              <Users size={20} /> <span>Users</span>
            </li>
          </ul>
        </div>

        {/* Stats Overview */}
        <div className="mt-8">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
            Quick Stats
          </h3>
          <div className="space-y-2">
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Total Posts</p>
              <p className="text-xl font-bold text-white">-</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Total Users</p>
              <p className="text-xl font-bold text-white">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Leftdashboard;