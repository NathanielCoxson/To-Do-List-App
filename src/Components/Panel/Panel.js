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
        //Clean up tasks before deletion to prevent memory leaks.
        removePanel(panelId);
    }

    const handleChangeTitle = (event) => {
        event.preventDefault();
        //Get new title and call change function here
        props.changePanelTitle(panelId, event.target.value);
    }

    //Only process event if the panel is currently empty, otherwise
    //only process the event that fires on the target task.
    const drop_handler = (event) => {
        event.preventDefault();
        if(props.taskIds.length === 0) {
            const data = JSON.parse(event.dataTransfer.getData('text/plain'));
            const taskMove = {
                ...data,
                dstPanelId: props.panelId,
                targetTask: -1,
                position: 'over'
            }
            props.moveTask(taskMove);
        }
    }
    
    const dragover_handler = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    const handleDescriptionInput = event => {
        event.target.style.height = 0;
        event.target.style.height = (event.target.scrollHeight) + 'px';
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
                        moveTask={props.moveTask}
                        checkOffTask={props.checkOffTask}
                        checkedOff={props.tasks.find(task => task.id === taskId).checkedOff}
                        updateTaskTitle={props.updateTaskTitle}
                        updateTaskDescription={props.updateTaskDescription}
                    />
                })
            }            
            {addingTask &&
                <div id='NewTaskInputDiv'>
                    <form onSubmit={handleTaskSubmission}>
                        <label htmlFor='title'>Title:</label>
                        <input 
                            type='text'
                            name='title'
                            id='titleInput'>
                        </input>
                        <label htmlFor='description'>Description:</label>
                        <textarea 
                            type='text'
                            name='description'
                            onInput={handleDescriptionInput}>
                        </textarea>
                        <input type='submit' id='submitButton'></input>
                    </form>
                </div>
            }
            <div className='AddTaskButton'><span onClick={handleAddTask}>+</span></div>
        </div>
    );
}