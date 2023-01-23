import './Board.css';
import { Panel } from '../Panel/Panel';
import { useState, useEffect } from 'react';

export function Board(props) {
    if(!localStorage.getItem('userData')) {
        localStorage.setItem('userData', JSON.stringify({
            panels: [
                {
                    id: 1,
                    title: 1,
                    taskIds: [],
                    newTaskId: 1
                },
                {
                    id: 2,
                    title: 2,
                    taskIds: [],
                    newTaskId: 1
                }
            ],
            tasks: [],
            panelId: 3,
            panelCount: 2,
            newTaskId: 1
        }));
    }
    const  [panels, setPanels] = useState(JSON.parse(localStorage.getItem('userData')).panels);
    const [id, setId] = useState(JSON.parse(localStorage.getItem('userData')).panelId);
    const [panelCount, setPanelCount] = useState(localStorage.getItem('userData'.panelCount));
    const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('userData')).tasks);
    const [newTaskId, setNewTaskId] = useState(JSON.parse(localStorage.getItem('userData')).newTaskId);

    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify({
            panels: panels,
            panelId: id,
            panelCount: panels.length,
            tasks: tasks,
            newTaskId: newTaskId
        }));
        setPanelCount(panels.length);
        //console.log(localStorage.getItem('userData'));
        //console.log(JSON.parse(localStorage.getItem('userData')).tasks);
    }, [panels, id, tasks, newTaskId]);

    useEffect(() => {
        let elements = document.getElementsByClassName('taskDescriptionTextarea');
        for(let i = 0; i < elements.length; i++) {
            elements[i].style.height = 0;
            elements[i].style.height = elements[i].scrollHeight + 'px';
        }
    });

    const handleAddPanel = (event) => {
        event.preventDefault();
        setId(id + 1);
        setPanels([
            ...panels,
            {
                id: id,
                title: panelCount + 1,
                taskIds: [],
                newTaskId: 1
            }
        ]);
    }

    const removePanel = (panelId) => {
        //Get the list of task ids kept by the panel right before deletion
        //so that they can be remove from tasks first.
        const taskIds = panels.find(panel => panel.id === panelId).taskIds;
        //Remove tasks that have an id matching an id in the taskIds list
        //of the panel being deleted.
        setTasks(tasks.filter(task => {
            for(let i = 0; i < taskIds.length; i++) {
                if(taskIds[i] === task.id) {
                    return false;
                }
            }
            return true;
        }));
        //Delete the panel from the list of panels.
        setPanels(panels.filter(panel => panel.id !== panelId));

    }

    const addTask = (panelId, id, title, description) => {
        setPanels(panels.map(panel => {
            if(panel.id === panelId) {
                return {
                    ...panel,
                    taskIds: [
                        ...panel.taskIds,
                        id
                    ],
                    newTaskId: panel.newTaskId + 1
                };
            }
            return panel;
        }));
        setTasks([...tasks, {id, title, description, checkedOff: false}]);
        setNewTaskId(newTaskId + 1);
    } 

    const removeTask = (panelId, taskId) => {
        setPanels(panels.map(panel => {
            if(panelId === panel.id) {
                return {
                    ...panel,
                    taskIds: panel.taskIds.filter(id => id !== taskId)
                };
            }
            return panel;
        }));
        setTasks(tasks.filter(task => task.id !== taskId));
    }

    const changePanelTitle = (panelId, newTitle) => {
        setPanels(panels.map(panel => {
            if(panelId === panel.id) {
                return {
                    ...panel,
                    title: newTitle
                };
            }
            return panel;
        }));
    }

    /*
        taskMove is an object like the following:
        {
            taskId: Number
            targetTask: Number
            srcPanelId: Number
            dstPanelId: Number
            position: String
        }
        taskId - id of the task that is being moved
        targetTask - id of the task that the moving task was dropped on
        srcPanelId - id of panel which the task originated from
        dstPanelId - id of panel where the task was dropped
        position - under if task was dropped underneath target task or over vice versa
    */
    const moveTask = (taskMove) => {
        setPanels(panels.map(panel => {
            let newTaskIds = [...panel.taskIds];
            //Remove task from src
            if(panel.id === taskMove.srcPanelId) {
                const removeIndex = panel.taskIds.indexOf(taskMove.taskId);
                newTaskIds.splice(removeIndex, 1);
            }
            //Add task to dst
            if(panel.id === taskMove.dstPanelId) {
                //If dropped on a panel
                if(taskMove.targetTask === -1) {
                    newTaskIds.push(taskMove.taskId);
                }
                //If dropped on a task
                else {
                    const insertIndex = newTaskIds.indexOf(taskMove.targetTask);
                    if(taskMove.position === 'over') {
                        newTaskIds.splice(insertIndex, 0, taskMove.taskId);
                    }
                    else {
                        newTaskIds.splice(insertIndex + 1, 0, taskMove.taskId);
                    }
                }
            }
            return {
                ...panel,
                taskIds: newTaskIds
            };
        }));  
    }

    const checkOffTask = taskId => {
        setTasks(tasks.map(task => {
            if(task.id === taskId) {
                return {
                    ...task,
                    checkedOff: task.checkedOff ? false : true
                }
            }
            return task;
        }));
    }

    const updateTaskTitle = (title, id) => {
        setTasks(tasks.map(task => {
            if(task.id === id) {
                return {
                    ...task,
                    title: title
                };
            }
            return task;
        }))
    }

    const updateTaskDescription = (description, id) => {
        setTasks(tasks.map(task => {
            if(task.id === id) {
                return {
                    ...task,
                    description: description
                };
            }
            return task;
        }))
    }

    return (
        <div id='Board'>
            <div id='SizeController'>
                <div id='NewPanelButton' onClick={handleAddPanel}>+</div>
            </div>
            <div className='Panels'>
                {
                    panels.map((panel, i) => {
                        return <Panel
                            panelId={panel.id}
                            panelTitle={panel.title}
                            taskIds={panel.taskIds}
                            tasks={tasks}
                            key={i}
                            removePanel={removePanel}
                            addTask={addTask}
                            removeTask={removeTask}
                            newTaskId={newTaskId}
                            changePanelTitle={changePanelTitle}
                            moveTask={moveTask}
                            checkOffTask={checkOffTask}
                            updateTaskTitle={updateTaskTitle}
                            updateTaskDescription={updateTaskDescription}
                        />
                    })
                }
            </div>
        </div>
    )
}