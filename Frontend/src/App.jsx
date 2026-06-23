import { Routes, Route } from "react-router-dom";  // ← No BrowserRouter import
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import SinglePost from "./pages/SinglePost";
import Home from "./pages/Home";
import CreateBlog from "./pages/Createblog";
import UpdateBlog from "./pages/UpdateBlog";  // ← Fixed case
import DeleteBlog from "./pages/DeleteBlog";  // ← Fixed case
import CategoryPosts from "./pages/CategoryPosts";  // ← Fixed path
import BlogFooter from "./components/BlogFooter";
import Contact from "./pages/Contact";
import AdminNewsletter from "./pages/AdminNewsletter";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:category" element={<CategoryPosts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/dashboard" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
        <Route path="/createblog" element={
          <AdminRoute>
            <CreateBlog />
          </AdminRoute>
        } />
        <Route path="/updateblog" element={
          <AdminRoute>
            <UpdateBlog />
          </AdminRoute>
        } />
        <Route path="/deleteblog" element={
          <AdminRoute>
            <DeleteBlog />
          </AdminRoute>
        } />
        
        <Route path="/contact" element={<Contact />} />
<Route path="/admin/newsletter" element={<AdminNewsletter />} />
      </Routes>
       <BlogFooter/>
    </AuthProvider>
   
  );
}

export default App;