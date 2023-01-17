import './Panel.css';
import { Task } from '../Task/Task.js';
import { useState } from 'react';

export function Panel(props) {
    const {panelId, panelTitle, removePanel} = props;

    const [addingTask, setAddingTask] = useState(false);
    const [id, setId] = useState(props.newTaskId);

    //Handler for when the new task button is clicked
    const handleAddTask = (event) => {
        addingTask ? setAddingTask(false) : setAddingTask(true);
    }

    //Handler for when a new task's data is typed in.
    const handleTaskSubmission = (event) => {
        event.preventDefault();
        props.addTask(
            panelId,
            id, 
            event.target.title.value,
            event.target.description.value
        )
        setId(id + 1);
        setAddingTask(false);
    }

    const removeTask = (taskId) => {
        props.removeTask(panelId, taskId);
    }

    const removeSelf = (event) => {
        event.preventDefault();
        removePanel(panelId);
    }

    return (
        <div className='Panel'>
            <h1>{panelTitle}</h1>
            {
                props.tasks.map((task, i) => {
                    return <Task 
                        title={task.title} 
                        description={task.description} 
                        id={task.id}
                        key={i}
                        removeTask={removeTask}
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