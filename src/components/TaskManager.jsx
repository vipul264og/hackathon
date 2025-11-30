// src/components/TaskManager.jsx - ✅ FIXED
import { useState, useEffect } from "react";
import "./TaskManager.css";

export default function TaskManager({ 
  project, 
  currentUserId, 
  onTaskSubmit,
  isAdmin  // ✅ FIXED: ADD MISSING PROP
}) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", assignedTo: "" });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTask, setEditTask] = useState({});

  useEffect(() => {
    const projectTasks = project.tasks || [];
    setTasks(projectTasks);
  }, [project]);

  const saveTasks = (updatedTasks) => {
    const updatedProject = { ...project, tasks: updatedTasks };
    onTaskSubmit(updatedProject);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.assignedTo) {
      alert("Please enter task title and select assignee");
      return;
    }

    const task = {
      id: Date.now() + Math.random(),
      title: newTask.title.trim(),
      assignedBy: currentUserId,
      assignedTo: newTask.assignedTo,
      status: "pending",
      submittedBy: null,
      fileData: null,
      fileName: null,
      timestamp: new Date().toLocaleString()
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTask({ title: "", assignedTo: "" });
  };

  const handleSubmitTask = (taskId, file) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    if (currentUserId !== task.assignedTo && !isAdmin) {  // ✅ FIXED: Admin can test
      alert("❌ You can only submit YOUR assigned tasks!");
      return;
    }

    if (!file) {
      alert("Please select a file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedTasks = tasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: "submitted",
              submittedBy: currentUserId,
              fileData: e.target.result,
              fileName: file.name,
              submitTimestamp: new Date().toLocaleString()
            }
          : t
      );
      
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    };
    reader.readAsDataURL(file);
  };

  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditTask({ title: task.title, assignedTo: task.assignedTo });
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (!editTask.title.trim() || !editTask.assignedTo) {
      alert("Please fill all fields");
      return;
    }

    const updatedTasks = tasks.map(task =>
      task.id === editingTaskId
        ? { 
            ...task, 
            title: editTask.title.trim(),
            assignedTo: editTask.assignedTo 
          }
        : task
    );
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setEditingTaskId(null);
    setEditTask({});
  };

  const handleDeleteTask = (taskId) => {
    if (!confirm("Delete this task?")) return;
    
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const groupStudents = project.groupStudents || [];

  return (
    <div className="task-manager">
      <h3 className="task-manager-title">
        👥 Team Tasks ({tasks.length})
      </h3>

      {/* ✅ FIXED: CREATE FORM - ADMIN ONLY */}
      {isAdmin && (
        <form className="task-create-form" onSubmit={handleCreateTask}>
          <input
            className="task-input"
            placeholder="e.g. Database Design, API Backend"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            maxLength={100}
          />
          <select
            className="task-input"
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
          >
            <option value="">👤 Select teammate...</option>
            {groupStudents.map(student => (
              <option key={student} value={student}>
                {student}
              </option>
            ))}
          </select>
          <button type="submit" className="task-btn-primary" disabled={!newTask.title.trim()}>
            ➕ Assign
          </button>
        </form>
      )}

      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <p className="no-tasks">
            {isAdmin ? '👥 No tasks yet. Assign tasks above!' : '📭 No tasks assigned'}
          </p>
        ) : (
          tasks.map(task => {
            const isMyTask = currentUserId === task.assignedTo;
            const iAssignedIt = currentUserId === task.assignedBy;
            
            return (
              <div key={task.id} className={`task-card task-${task.status}`}>
                <div className="task-header">
                  <h4 className="task-title">{task.title}</h4>
                  <div className="task-assignees">
                    <span className="task-assigned-to">
                      👤 To: <strong>{task.assignedTo}</strong>
                    </span>
                    {task.assignedBy && (
                      <span className="task-assigned-by">
                        📤 By: {task.assignedBy}
                      </span>
                    )}
                  </div>
                </div>

                {editingTaskId === task.id ? (
                  <form onSubmit={handleUpdateTask} className="task-edit-form">
                    <input
                      value={editTask.title}
                      onChange={(e) => setEditTask({...editTask, title: e.target.value})}
                      className="task-input"
                      placeholder="Task title"
                    />
                    <select
                      value={editTask.assignedTo}
                      onChange={(e) => setEditTask({...editTask, assignedTo: e.target.value})}
                      className="task-input"
                    >
                      {groupStudents.map(student => (
                        <option key={student} value={student}>{student}</option>
                      ))}
                    </select>
                    <div className="task-edit-buttons">
                      <button type="submit" className="task-btn-primary">✅ Save</button>
                      <button 
                        type="button" 
                        className="task-btn-secondary" 
                        onClick={() => setEditingTaskId(null)}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="task-status">
                      <span className={`status-badge status-${task.status} ${isMyTask ? 'your-task' : ''}`}>
                        {task.status === 'pending' && (
                          isMyTask ? '⏳ YOUR TASK' : `⏳ ${task.assignedTo}'s Task`
                        )}
                        {task.status === 'submitted' && '✅ Submitted'}
                      </span>
                    </div>

                    {task.status === 'submitted' && task.fileName && (
                      <div className="task-submission">
                        📎 <strong>{task.fileName}</strong>
                        <br />
                        <a href={task.fileData} target="_blank" rel="noreferrer" className="view-file">
                          👁️ View File
                        </a>
                        <br />
                        <small>By: {task.submittedBy} • {task.submitTimestamp}</small>
                      </div>
                    )}

                    {/* ✅ FIXED: SUBMIT SECTION */}
                    {(isMyTask || isAdmin) && task.status === 'pending' && (
                      <div className="task-submit-section">
                        <p className="submit-prompt">📤 Submit your work:</p>
                        <input
                          type="file"
                          className="task-file-input"
                          onChange={(e) => handleSubmitTask(task.id, e.target.files[0])}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,image/*"
                        />
                      </div>
                    )}

                    {/* ✅ FIXED: ACTIONS - ADMIN ONLY */}
                    {isAdmin && (
                      <div className="task-team-actions">
                        <button 
                          className="task-btn-secondary" 
                          onClick={() => startEditTask(task)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="task-btn-danger" 
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          🗑️ Delete
                        </button>
                        {iAssignedIt && (
                          <span className="assigned-badge">⭐ You created</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
