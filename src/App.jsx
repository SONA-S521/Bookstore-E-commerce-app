import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import Cart from "./pages/Cart"
import Wishlist from "./pages/Wishlist"
import Payment from "./pages/Payment"
import ReturnBook from "./pages/ReturnBook"
import AdminReturns from "./pages/AdminReturns"
import Adminlogin from "./pages/Adminlogin"
import Dashboard from "./pages/Dashboard"
import Books from "./pages/Books"
import Users from "./pages/Users"
import Orders from "./pages/Orders"
function App() {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [admin, setAdmin] = useState(null)
  const ADMIN_EMAIL = "admin@gmail.com"
  const ADMIN_PASSWORD = "admin123"
  const addToCart = (book) => {
    setCart([...cart, book])
  }
  const removeFromCart = (index) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }
  const addToWishlist = (book) => {
    setWishlist([...wishlist, book])
  }
  const removeFromWishlist = (index) => {
    const newWishlist = [...wishlist]
    newWishlist.splice(index, 1)
    setWishlist(newWishlist)
  }
  const handleLogin = (userData) => {
    console.log("App.jsx - handleLogin called with:", userData);
    if (userData.role === 'admin') {
      setAdmin(userData);
      setUser(null);
    } else {
      setUser(userData);
      setAdmin(null);
    }
  }
  const handleAdminLogin = (email, password) => {
    console.log("App.jsx - handleAdminLogin called with:", email, password);
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        email: email,
        name: "Admin",
        role: "admin"
      };
      setAdmin(adminUser);
      setUser(null);
      console.log("✅ Admin set successfully:", adminUser);
      return true;
    }
    console.log("❌ Admin login failed");
    return false;
  }
  const handleSignup = (name, email, password) => {
    const userExists = users.some(u => u.email === email)
    if (userExists) {
      alert("User already exists! Please login.")
      return false
    } else {
      const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password,
        role: "user",
        joined: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, newUser])
      alert("Signup successful! Please login.")
      return true
    }
  }
  const handleLogout = () => {
    console.log("Logging out");
    setUser(null);
    setAdmin(null);
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route
          path="/home"
          element={
            user ? (
              <Home
                addToCart={addToCart}
                addToWishlist={addToWishlist}
                cart={cart}
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/cart"
          element={
            user ? (
              <Cart
                cart={cart}
                removeFromCart={removeFromCart}
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/wishlist"
          element={
            user ? (
              <Wishlist
                wishlist={wishlist}
                removeFromWishlist={removeFromWishlist}
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route 
          path="/payment" 
          element={
            user ? (
              <Payment user={user} onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        {}
        <Route
          path="/return-book"
          element={
            user ? (
              <ReturnBook
                user={user}
                onLogout={handleLogout}
                cart={cart}
              />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        {}
        <Route 
          path="/admin" 
          element={<Adminlogin onAdminLogin={handleAdminLogin} />} 
        />
        <Route
          path="/admin/dashboard"
          element={
            admin ? (
              <Dashboard admin={admin} onLogout={handleLogout} />
            ) : (
              <Adminlogin onAdminLogin={handleAdminLogin} />
            )
          }
        />
        <Route
          path="/admin/books"
          element={
            admin ? (
              <Books admin={admin} onLogout={handleLogout} />
            ) : (
              <Adminlogin onAdminLogin={handleAdminLogin} />
            )
          }
        />
        <Route
          path="/admin/users"
          element={
            admin ? (
              <Users users={users} admin={admin} onLogout={handleLogout} />
            ) : (
              <Adminlogin onAdminLogin={handleAdminLogin} />
            )
          }
        />
        <Route
          path="/admin/orders"
          element={
            admin ? (
              <Orders admin={admin} onLogout={handleLogout} />
            ) : (
              <Adminlogin onAdminLogin={handleAdminLogin} />
            )
          }
        />
        {}
        <Route
          path="/admin/returns"
          element={
            admin ? (
              <AdminReturns admin={admin} onLogout={handleLogout} />
            ) : (
              <Adminlogin onAdminLogin={handleAdminLogin} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
export default App