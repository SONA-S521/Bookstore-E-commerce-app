import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    setLoading(true);
    console.log("🔑 Login attempt:", email);
    try {
      const result = await api.login(email, password);
      console.log("📦 Login result:", result);
      if (result && result.success) {
        console.log("✅ Login successful!", result.user);
        alert(`✅ Login Successfully!\n\nWelcome back, ${result.user.name}!`);
        onLogin(result.user);
        if (result.role === 'admin') {
          console.log("👉 Redirecting to admin dashboard");
          navigate('/admin/dashboard');
        } else {
          console.log("👉 Redirecting to user home");
          navigate('/home');
        }
      } else {
        alert(result?.message || "Invalid email or password!");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Login failed. Please try again.");
    }
    setLoading(false);
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-container">
          <span className="logo-icon">📚</span>
          <h1 className="auth-title">Bookstore E-Commerce</h1>
        </div>
        <h2 className="auth-heading">User Login</h2>
        <input 
          type="email" 
          placeholder="Enter Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input 
          type="password" 
          placeholder="Enter Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="auth-link">
          Doesn't have an account? <Link to="/signup">Signup</Link>
        </p>
        <p className="auth-link">
          <Link to="/admin">Admin Login</Link>
        </p>
      </div>
    </div>
  );
}
export default Login;