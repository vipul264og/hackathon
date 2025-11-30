// src/components/Login.jsx - PERFECT PREMIUM MATCH
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [role, setRole] = useState(""); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = username.includes("@");

    if (!role || !username.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    if (isEmail && !emailPattern.test(username.trim())) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.length < 5) {
      alert("Password must be at least 5 characters long");
      return;
    }

    if (role === "admin") {
      navigate("/admin");
    } else {
      localStorage.setItem("currentStudent", username.trim());
      navigate("/student");
    }
  };

  return (
    <div className="login-page"> {/* ← CHANGED: login-page */}
      <div className="login-container"> {/* ← CHANGED: login-container */}
        <h1 className="login-title-main">Project Portal</h1>
        <p className="login-title-sub">Advanced Learning Platform</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* ROLE TOGGLE - PREMIUM STYLE */}
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn student ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              Student
            </button>
            <button
              type="button"
              className={`role-btn teacher ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              Teacher
            </button>
          </div>

          {/* INPUT WITH FLOATING LABELS */}
          <div className="login-input">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              required
            />
            <label>Enter Email or Username</label>
          </div>

          <div className="login-input">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label>Enter Password</label>
          </div>

          <button type="submit" className="login-btn">
            Sign In →
          </button>
        </form>

        <div className="login-footer">
          <p>Secure Project Management System</p>
        </div>
      </div>
    </div>
  );
}
