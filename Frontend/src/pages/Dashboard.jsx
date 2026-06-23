// page/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Leftdashboard from "../components/Leftdashboard ";


export const Dashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    console.log("Dashboard - Token:", token ? "Present" : "Missing");
    console.log("Dashboard - User Role:", userRole);
    
    // Check if user is logged in and is admin
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }
    
    if (userRole !== "admin") {
      console.log("User is not admin, redirecting to home");
      navigate("/");
      return;
    }
    
    setIsAdmin(true);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Leftdashboard />
      <div className="flex-1 ml-[20%] p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to your admin panel!</p>
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Total Posts</h3>
              <p className="text-3xl font-bold text-blue-600">-</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-3xl font-bold text-green-600">-</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Total Views</h3>
              <p className="text-3xl font-bold text-purple-600">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};