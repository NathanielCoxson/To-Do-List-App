import './Panel.css';
import { Task } from '../Task/Task.js';
import { useState } from 'react';

export function Panel(props) {
    const {panelId, panelTitle, removePanel} = props;
    const [addingTask, setAddingTask] = useState(false);

    //Handler for when the new task button is clicked
    const handleAddTask = (event) => {
        addingTask ? setAddingTask(false) : setAddingTask(true);
    }

    //Handler for when a new task's data is typed in.
    const handleTaskSubmission = (event) => {
        event.preventDefault();
        props.addTask(
            panelId,
            JSON.parse(localStorage.getItem('userData')).newTaskId, 
            event.target.title.value,
            event.target.description.value
        )
        setAddingTask(false);
    }

    const removeTask = (taskId) => {
        props.removeTask(panelId, taskId);
    }

    const removeSelf = (event) => {
        event.preventDefault();
        removePanel(panelId);
    }

    const handleChangeTitle = (event) => {
        event.preventDefault();
        //Get new title and call change function here
        props.changePanelTitle(panelId, event.target.value);
    }

    const drop_handler = (event) => {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        if(data.srcPanelId !== panelId) {
            const taskMove = {
                ...data,
                dstPanelId: panelId
            }
            props.moveTask(taskMove);
        }  
    }
    
    const dragover_handler = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    return (
        <div 
            id='PanelDiv'
            onDragOver={dragover_handler}
            onDrop={drop_handler}
        >
            <div id="PanelTitleDiv" className='PanelTitle'>
                <form>
                    <input 
                        type='text'
                        name='title'
                        onChange={handleChangeTitle}
                        value={panelTitle}
                    ></input>
                </form>
                <div className='PanelCloseButton' onClick={removeSelf}><span>X</span></div>
            </div>
            {
                props.taskIds.map((taskId, i) => {
                    return <Task 
                        title={props.tasks.find(task => task.id === taskId).title} 
                        description={props.tasks.find(task => task.id === taskId).description} 
                        id={taskId}
                        key={i}
                        removeTask={removeTask}
                        parentId={panelId}
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
            <div className='AddTaskButton'><span onClick={handleAddTask}>+</span></div>
        </div>
    );
}