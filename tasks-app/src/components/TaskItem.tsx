import { Link } from "react-router-dom";
import type { Task } from "../types/Task";

interface Props {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<Props> = ({ task, onToggle, onDelete }) => {
  return (
    <div className="task-item">
      <div 
        className={`checkbox-wrapper ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task.id, !task.completed)}
      >
        {task.completed && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
      </div>
      
      <Link 
        to={`/task/${task.id}`}
        style={{ 
          textDecoration: task.completed ? 'line-through' : 'none',
          color: task.completed ? '#94a3b8' : 'white',
          fontSize: '1rem',
          fontWeight: 500,
          flex: 1
        }}
      >
        {task.title}
      </Link>
      
      <button 
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        title="Delete Task"
      >
        ✕
      </button>
    </div>
  );
};
