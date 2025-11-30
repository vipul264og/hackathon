// src/components/ProjectCard.jsx - ✅ FULL DEBUG MODE
import { useState, useEffect } from "react";
import TaskManager from "./TaskManager";
import "./ProjectCard.css";
import "./TeacherProjectCard.css";
import "./StudentProjectCard.css";

export default function ProjectCard({ 
  project, 
  isAdmin, 
  studentId, 
  onDeleteProject,
  onEditProject,
  projects,
  saveProjects,
  onStudentSubmit,
  onViewSubmissions
}) {
  const [studentSubmission, setStudentSubmission] = useState(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ FULL DEBUG LOGS
  useEffect(() => {
    console.log("🔍 DEBUG ProjectCard:", {
      projectId: project.id,
      title: project.title,
      totalSubmissions: project.submissions?.length || 0,
      studentId,
      isAdmin,
      groupStudents: project.groupStudents,
      hasStudentSubmission: !!studentSubmission
    });
    
    if (!isAdmin && studentId && project.submissions) {
      const submission = project.submissions.find(s => s.studentId === studentId);
      console.log("📋 Student submission found:", submission);
      setStudentSubmission(submission);
    }
  }, [project, studentId, isAdmin, studentSubmission]);

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    
    console.log("🚀 SUBMIT CLICKED:", { projectId: project.id, file: submissionFile?.name });
    
    if (!submissionFile) {
      alert("Please select a file first");
      return;
    }

    if (!onStudentSubmit) {
      console.error("❌ onStudentSubmit MISSING!");
      alert("❌ Submission handler missing");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("📤 Calling parent onStudentSubmit...");
      await onStudentSubmit(project.id, submissionFile);
      console.log("✅ Parent handler completed!");
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("❌ Submission failed. Try again.");
    } finally {
      setIsSubmitting(false);
      setShowFileInput(false);
      setSubmissionFile(null);
    }
  };

  const groupStudents = project.groupStudents || [];

  return (
    <div className={`project-card ${isAdmin ? 'teacher-card' : 'student-card'}`}>
      {/* DEBUG INFO - REMOVE AFTER FIX */}
      {!isAdmin && (
        <div style={{ 
          background: '#ffeb3b', 
          padding: '8px', 
          fontSize: '12px', 
          marginBottom: '12px',
          borderRadius: '4px'
        }}>
          DEBUG: {studentId} | Subs: {project.submissions?.length || 0} | 
          Found: {studentSubmission ? 'YES' : 'NO'}
        </div>
      )}
      
      <h3 className="project-card-title">{project.title}</h3>
      
      <div className="project-card-subject">
        📚 Subject: {project.subject}
      </div>

      <div className="project-card-deadline">
        📅 Deadline: {project.deadline}
      </div>
      <div className={`project-card-timer ${project.isUrgent ? 'urgent' : ''}`}>
        ⏰ {project.timeLeft || 'No deadline'}
      </div>

      {groupStudents.length > 0 && (
        <div className="project-card-group">
          👥 Group: {groupStudents.join(', ')}
        </div>
      )}

      {/* TEACHER VIEW */}
      {isAdmin ? (
        <>
          <div className="project-card-submission-count">
            📊 Submissions: {project.submissions?.length || 0}/{groupStudents.length}
          </div>

          {project.submissions?.length > 0 && onViewSubmissions && (
            <div className="project-card-view-submissions">
              <button 
                className="project-card-btn-primary"
                onClick={() => onViewSubmissions(project.id)}
                style={{ 
                  width: '100%', 
                  marginBottom: '16px',
                  padding: '12px 20px',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                📋 View {project.submissions.length} Submission(s)
              </button>
            </div>
          )}

          <TaskManager
            project={project}
            currentUserId="admin"
            isAdmin={true}
            onTaskSubmit={(updatedProject) => {
              const updatedProjects = projects.map(p => 
                p.id === updatedProject.id ? updatedProject : p
              );
              saveProjects(updatedProjects);
            }}
          />

          <div className="project-card-admin-actions">
            <button 
              className="project-card-btn-primary"
              onClick={() => onEditProject(project)}
            >
              ✏️ Edit Project
            </button>
            <button 
              className="project-card-btn-secondary"
              onClick={() => onDeleteProject(project.id)}
            >
              🗑️ Delete
            </button>
          </div>
        </>
      ) : studentSubmission ? (
        /* STUDENT - SUBMITTED */
        <>
          <div className="project-card-status-submitted">
            ✅ Project Submitted Successfully
          </div>
          <div className="project-card-submissions-list">
            📎 <strong>{studentSubmission.fileName}</strong>
            <br />
            <a 
              href={studentSubmission.fileData} 
              target="_blank" 
              rel="noreferrer"
            >
              👁️ View Your Submission
            </a>
            <br />
            <small>Submitted: {studentSubmission.timestamp}</small>
          </div>
        </>
      ) : (
        /* STUDENT - PENDING */
        <>
          {!showFileInput ? (
            <div className="project-card-submit-prompt">
              <h4 className="submit-title">📁 Submit Your Project</h4>
              <p className="submit-description">
                Upload your complete project work
              </p>
              <button 
                className="project-card-btn-primary"
                onClick={() => setShowFileInput(true)}
                disabled={isSubmitting}
              >
                🚀 Choose File
              </button>
            </div>
          ) : (
            <form onSubmit={handleStudentSubmit} className="project-card-file-input-section">
              <input
                type="file"
                className="project-card-file-input"
                onChange={(e) => setSubmissionFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,image/*"
                required
                disabled={isSubmitting}
              />
              {submissionFile && (
                <div className="project-card-file-name">
                  ✅ Selected: <strong>{submissionFile.name}</strong>
                </div>
              )}
              <div className="project-card-submit-buttons">
                <button 
                  type="submit" 
                  className="project-card-btn-primary"
                  disabled={!submissionFile || isSubmitting}
                >
                  {isSubmitting ? '⏳ Submitting...' : '📤 Submit Project'}
                </button>
                <button 
                  type="button" 
                  className="project-card-btn-secondary"
                  onClick={() => {
                    setShowFileInput(false);
                    setSubmissionFile(null);
                  }}
                  disabled={isSubmitting}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
