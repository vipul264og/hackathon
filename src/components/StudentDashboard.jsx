// src/components/StudentDashboard.jsx - ✅ FILE SHOWS NOW
import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import "./StudentProjectCard.css";

export default function StudentDashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const currentStudent = localStorage.getItem("currentStudent") || "Vipul Sharma";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(stored);
  }, []);

  const saveProjects = (updatedProjects) => {
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const handleStudentSubmit = (projectId, file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileData = e.target.result;  // ✅ SAVES FILE DATA

      const updatedProjects = projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              submissions: [
                ...(p.submissions || []),
                {
                  studentId: currentStudent,
                  fileName: file.name,
                  fileType: file.type || "application/octet-stream",
                  fileData,  // ✅ FILE DATA SAVED HERE
                  timestamp: new Date().toLocaleString(),
                },
              ],
            }
          : p
      );

      saveProjects(updatedProjects);
      alert("✅ Project submitted successfully!");  // ✅ USER FEEDBACK
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="student-page">
      <header className="dashboard-header">
        <h1>STUDENT DASHBOARD</h1>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("currentStudent");
            navigate("/");
          }}
        >
          Logout
        </button>
      </header>

      <main className="student-container">
        <div className="welcome-section">
          <div className="welcome-content">
            <h2 className="student-welcome-title">
              Welcome back, <span className="student-name">{currentStudent}</span>!
            </h2>
            <p className="student-welcome-text">
              Here are your assigned projects. Submit your work before the deadline.
            </p>
          </div>
          <div className="stats-card">
            <div className="stat-item">
              <span className="stat-number">{projects.length}</span>
              <span className="stat-label">Total Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {projects.filter(p => 
                  p.submissions?.some(s => s.studentId === currentStudent)
                ).length}
              </span>
              <span className="stat-label">Submitted</span>
            </div>
          </div>
        </div>

        <section className="projects-section">
          <div className="section-header">
            <h2 className="section-title">Assigned Projects</h2>
            {projects.length === 0 && (
              <p className="empty-state">No projects assigned yet</p>
            )}
          </div>

          <div className="projects-grid">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                isAdmin={false}
                studentId={currentStudent}
                projects={projects}
                saveProjects={saveProjects}
                onStudentSubmit={handleStudentSubmit}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
