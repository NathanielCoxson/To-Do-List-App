import './Panel.css'
import { Task } from '../Task/Task.js'
import { useEffect, useState } from 'react';



export function Panel(props) {
    const [addingTask, setAddingTask] = useState(false);
    const [tasks, setTasks] = useState([
        // {
        //     title: 'Math HW',
        //     description: 'Calc problems'
        // },
        // {
        //     title: 'Engl HW',
        //     description: 'Write essay'
        // },
        // {
        //     title: 'Chem HW',
        //     description: 'Lab Report'
        // }
    ]);

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
                description: event.target.description.value
            }
        ]);
        setAddingTask(false);
    }

    return (
        <div className='Panel'>
            {
                tasks.map((task, i) => {
                    return <Task 
                        title={task.title} 
                        description={task.description} 
                        key={i}
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
        </div>
    );
}