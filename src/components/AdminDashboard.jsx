// src/components/AdminDashboard.jsx - ✅ 100% FIXED
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { GROUPS } from "./groupsData";
import "./AdminDashboard.css";
import "./TeacherProjectCard.css";

const SUBJECTS = [
  "Data Structures",
  "Operating Systems", 
  "Database Management Systems",
  "Computer Networks",
  "Software Engineering",
];

export default function AdminDashboard() {
  // ✅ ALL STATE
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [groupId, setGroupId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editGroupId, setEditGroupId] = useState("");
  const [viewingSubmissions, setViewingSubmissions] = useState(null); // ✅ SUBMISSIONS MODAL

  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(stored);
  }, []);

  const saveProjects = (updatedProjects) => {
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  // ✅ FULL TEAM NAMES IN DROPDOWN
  const renderGroupOption = (group) => {
    return `${group.name}: ${group.students.join(", ")}`;
  };

  // ✅ CREATE PROJECT
  const handleAssign = (e) => {
    e.preventDefault();
    const group = GROUPS.find(g => g.id === groupId);
    
    if (!title.trim() || !subject || !deadline || !group) {
      alert("Please fill all fields");
      return;
    }

    const newProject = {
      id: Date.now(),
      title: title.trim(),
      subject,
      deadline,
      groupId: group.id,
      groupName: group.name,
      groupStudents: group.students,
      submissions: [],
      tasks: [],
      timeLeft: "14 days left",
      isUrgent: false
    };

    saveProjects([...projects, newProject]);
    setTitle("");
    setSubject("");
    setDeadline("");
    setGroupId("");
  };

  // ✅ DELETE
  const handleDeleteProject = (id) => {
    if (confirm("Delete this project?")) {
      saveProjects(projects.filter(p => p.id !== id));
    }
  };

  // ✅ EDIT START
  const handleEditProject = (project) => {
    setEditingId(project.id);
    setEditTitle(project.title);
    setEditSubject(project.subject);
    setEditDeadline(project.deadline);
    setEditGroupId(project.groupId);
  };

  // ✅ EDIT SAVE
  const handleUpdate = (e) => {
    e.preventDefault();
    const group = GROUPS.find(g => g.id === editGroupId);
    
    if (!editTitle.trim() || !editSubject || !editDeadline) {
      alert("Please fill all fields");
      return;
    }

    const updatedProjects = projects.map(p =>
      p.id === editingId
        ? {
            ...p,
            title: editTitle.trim(),
            subject: editSubject,
            deadline: editDeadline,
            groupId: group.id,
            groupName: group.name,
            groupStudents: group.students
          }
        : p
    );

    saveProjects(updatedProjects);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // ✅ VIEW SUBMISSIONS
  const openSubmissions = (projectId) => {
    setViewingSubmissions(projectId);
  };

  const closeSubmissions = () => {
    setViewingSubmissions(null);
  };

  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <h1 className="admin-title">👨‍🏫 Teacher Dashboard</h1>
        <button 
          className="admin-logout-btn" 
          onClick={() => {
            localStorage.removeItem("currentStudent");
            navigate("/");
          }}
        >
          🚪 Logout
        </button>
      </header>

      <main className="admin-container">
        {/* CREATE FORM */}
        <section>
          <h2 className="admin-section-title">➕ Assign New Project</h2>
          <form className="admin-form-inline" onSubmit={handleAssign}>
            <input
              className="admin-input"
              placeholder="e.g. Hospital Management System"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <select 
              className="admin-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            >
              <option value="">📚 Subject</option>
              {SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              className="admin-input"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
            <select
              className="admin-input"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              required
            >
              <option value="">👥 Select Group (Full Team)</option>
              {GROUPS.map(group => (
                <option key={group.id} value={group.id}>
                  {renderGroupOption(group)}
                </option>
              ))}
            </select>
            <button type="submit" className="admin-btn-primary">
              📋 Assign Project
            </button>
          </form>
        </section>

        {/* EDIT FORM */}
        {editingId && (
          <section>
            <h2 className="admin-section-title">✏️ Edit Project</h2>
            <form className="admin-form-inline" onSubmit={handleUpdate}>
              <input
                className="admin-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
              <select 
                className="admin-input"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                required
              >
                <option value="">📚 Subject</option>
                {SUBJECTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                className="admin-input"
                type="date"
                value={editDeadline}
                onChange={(e) => setEditDeadline(e.target.value)}
                required
              />
              <select
                className="admin-input"
                value={editGroupId}
                onChange={(e) => setEditGroupId(e.target.value)}
              >
                {GROUPS.map(group => (
                  <option key={group.id} value={group.id}>
                    {renderGroupOption(group)}
                  </option>
                ))}
              </select>
              <button type="submit" className="admin-btn-primary">✅ Save Changes</button>
              <button 
                type="button" 
                className="admin-btn-secondary" 
                onClick={cancelEdit}
              >
                ❌ Cancel
              </button>
            </form>
          </section>
        )}

        {/* PROJECTS GRID */}
        <section>
          <h2 className="admin-section-title">
            📊 Assigned Projects ({projects.length})
          </h2>
          {projects.length === 0 ? (
            <div className="no-projects">
              <p>👆 No projects yet. Assign one above!</p>
            </div>
          ) : (
            <div className="admin-grid-container">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isAdmin={true}
                  studentId={null}                    // ✅ FIXED: ADD THIS
                  projects={projects}
                  saveProjects={saveProjects}
                  onDeleteProject={handleDeleteProject}
                  onEditProject={handleEditProject}
                  onViewSubmissions={openSubmissions}  // ✅ ADD VIEW SUBMISSIONS
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ✅ SUBMISSIONS MODAL */}
      {viewingSubmissions && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>📋 Project Submissions</h3>
              <button className="modal-close" onClick={closeSubmissions}>
                ×
              </button>
            </div>
            <div className="modal-content">
              {(() => {
                const project = projects.find(p => p.id === viewingSubmissions);
                const submissions = project?.submissions || [];
                
                return submissions.length > 0 ? (
                  submissions.map((submission, index) => (
                    <div key={index} className="submission-item">
                      <div className="submission-student">
                        👤 <strong>{submission.studentId}</strong>
                      </div>
                      <div className="submission-file">
                        📎 {submission.fileName} 
                        <span className="file-type">({submission.fileType})</span>
                      </div>
                      <a 
                        href={submission.fileData} 
                        target="_blank" 
                        rel="noreferrer"
                        className="view-file-btn"
                      >
                        👁️ View File
                      </a>
                      <div className="submission-time">
                        {submission.timestamp}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-submissions">No submissions yet</p>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
