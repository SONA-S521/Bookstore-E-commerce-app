import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
function Adminlogin({ onAdminLogin }) {
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
    console.log("👑 Admin login attempt:", email);
    try {
      const success = await onAdminLogin(email, password);
      console.log("👑 Admin login result:", success);
      if (success) {
        console.log("✅ Admin login successful, navigating to dashboard");
        navigate("/admin/dashboard");
      } else {
        alert("Invalid admin credentials! Use admin@gmail.com / admin123");
      }
    } catch (error) {
      console.error("❌ Admin login error:", error);
      alert("Login failed. Please try again.");
    }
    setLoading(false);
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-container">
          <span className="logo-icon"></span>
          <h1 className="auth-title">Admin Portal</h1>
        </div>
        <h2 className="auth-heading">Login</h2>
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
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
        <p className="auth-link">
          <Link to="/">User Login</Link>
        </p>
        <p style={{ 
          marginTop: '20px', 
          fontSize: '14px', 
          color: '#666',
          textAlign: 'center'
        }}>
        </p>
      </div>
    </div>
  );
}
export default Adminlogin;
