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
        setTasks([...tasks, {id, title, description}]);
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

    const moveTask = (taskMove) => {
        setPanels(panels.map(panel => {
            if(panel.id === taskMove.srcPanelId) {
                return {
                    ...panel,
                    taskIds: panel.taskIds.filter(taskId => taskId !== taskMove.taskId)
                };
            }
            if(panel.id === taskMove.dstPanelId) {
                return {
                    ...panel,
                    taskIds: [...panel.taskIds, taskMove.taskId]
                }
            }
            return panel;
        }));
    }

    return (
        <div>
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
                        />
                    })
                }
            </div>
            <div className='SizeController'>
                <button onClick={handleAddPanel}>+</button>
            </div>
        </div>
    )
}