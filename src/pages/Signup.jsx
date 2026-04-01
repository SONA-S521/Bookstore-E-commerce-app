import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    console.log("Starting signup process...");
    const result = await api.signup(name, email, password);
    console.log("Signup result:", result);
    if (result && result.success) {
      alert("Signup successful! Please login.");
      navigate("/");
    } else {
      alert(result?.message || "Signup failed. Please try again.");
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
        <h2 className="auth-heading">Signup Page</h2>
        <input 
          type="text" 
          placeholder="Enter Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
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
        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating account..." : "Signup"}
        </button>
      </div>
    </div>
  );
}
export default Signup;