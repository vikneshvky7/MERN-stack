import {useState} from "react";
import"../styles/task.css";
import {PropTypes} from "prop-types";

export const Task = ({task, updateTask, deleteTask})=>{
    const [taskTitle, setTaskTitle] = useState(task);

    const handleChange =(e) =>{
        e.preventDefault();
        setTaskTitle(e.target.value);
    };

    const handleUpdate = async()=>{
        if(taskTitle.trim() !== task){
            
            const taskUpdated = await updateTask(taskTitle);
            if(!taskUpdated){
                setTaskTitle(task);
            }
            else{
                alert("Task updated");
            }
        }
        else{
            alert("change the task to update");
        }
    };
    return(
      <li className="task">
        <input type="text" name="task-title" value={taskTitle} onChange={handleChange} />
        <button type="button" onClick={handleUpdate}>Update</button>
        <button id="delete" type="button" onClick={deleteTask}>
            Delete
        </button>
      </li>

    );
};


Task.propTypes = {
    task: PropTypes.string,
    deleteTask : PropTypes.func.isRequired,
};