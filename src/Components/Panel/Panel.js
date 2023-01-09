import './Panel.css'
import { Task } from '../Task/Task.js'
import { useState } from 'react';



export function Panel(props) {
    const {panelId, remove} = props;

    const [addingTask, setAddingTask] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [id, setId] = useState(0);

    //Handler for when the new task button is clicked
    const handleAddTask = (event) => {
        addingTask ? setAddingTask(false) : setAddingTask(true);
    }

    //Handler for when a new task's data is typed in.
    const handleTaskSubmission = (event) => {
        event.preventDefault();
        setTasks([
            ...tasks,
            {
                title: event.target.title.value,
                description: event.target.description.value,
                id: id
            }
        ]);
        setId(id + 1);
        setAddingTask(false);
    }

    const removeTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    }

    const removeSelf = (event) => {
        event.preventDefault();
        remove(panelId);
    }

    return (
        <div className='Panel'>
            <h1>{panelId}</h1>
            {
                tasks.map((task, i) => {
                    return <Task 
                        title={task.title} 
                        description={task.description} 
                        id={task.id}
                        key={i}
                        remove={removeTask}
                    />
                })
            }            
            {addingTask &&
                <form onSubmit={handleTaskSubmission}>
                    <input 
                        type='text'
                        placeholder='Title'
                        name='title'>
                    </input>
                    <input 
                        type='text'
                        placeholder='Description'
                        name='description'>
                    </input>
                    <input type='submit'></input>
                </form>
            }
            <button onClick={handleAddTask}>+</button>
            <button onClick={removeSelf}>-</button>
        </div>
    );
}