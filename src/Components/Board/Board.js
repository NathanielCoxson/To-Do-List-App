import './Board.css';
import { Panel } from '../Panel/Panel';
import { useState, useEffect } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';

export function Board(props) {
    // Get userData or set to default if not found.
    let userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        localStorage.setItem('userData', JSON.stringify({
            boards: [
                {
                    panels: [
                        {
                            id: 1,
                            title: 1,
                            taskIds: [],
                        },
                        {
                            id: 2,
                            title: 2,
                            taskIds: [],
                        }
                    ],
                    tasks: [],
                    newPanelId: 3,
                    panelCount: 2,
                    newTaskId: 1,
                    id: 1,
                }
            ],
            currentBoardId: 1,
            newBoardId: 2,
        }));
        userData = JSON.parse(localStorage.getItem('userData'));
    }

    // App State
    const [sidebarIsHidden, setSidebarIsHidden] = useState(true);
    const [boards, setBoards] = useState(userData.boards);
    const [currentBoardId, setCurrentBoardId] = useState(userData.currentBoardId);
    const [newBoardId, setNewBoardId] = useState(userData.newBoardId);

    // Individual Board State
    const [panels, setPanels] = useState(userData.boards.find(board => board.id === currentBoardId).panels);
    const [newPanelId, setNewPanelId] = useState(userData.boards.find(board => board.id === currentBoardId).newPanelId);
    const [panelCount, setPanelCount] = useState(userData.boards.find(board => board.id === currentBoardId).panelCount);
    const [tasks, setTasks] = useState(userData.boards.find(board => board.id === currentBoardId).tasks);
    const [newTaskId, setNewTaskId] = useState(userData.boards.find(board => board.id === currentBoardId).newTaskId);

    /*
        Maybe store userData as state and only have one hook that depends on userData,
        then change any update to state variables to instead update userData.
    */

    // Update localStorage any time state changes
    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify({
            ...JSON.parse(localStorage.getItem('userData')),
            boards: boards.map(board => {
                if(board.id === currentBoardId) {
                    return {
                        ...board,
                        panels: panels,
                        tasks: tasks,
                        newPanelId: newPanelId,
                        panelCount: panelCount,
                        newTaskId: newTaskId,
                    }
                }
                return board;
            }),
        }));
    }, [panels, newPanelId, tasks, newTaskId, panelCount, boards, currentBoardId]);

    // Switch between boards
    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify({
            ...JSON.parse(localStorage.getItem('userData')),
            boards: boards,
            newBoardId: newBoardId,
        }));
    }, [boards, newBoardId]);

    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify({
            ...JSON.parse(localStorage.getItem('userData')),
            currentBoardId: currentBoardId,
        }));
        let b = boards.find(board => board.id === currentBoardId);
        setPanels(b.panels);
        setNewPanelId(b.newPanelId);
        setPanelCount(b.panelCount);
        setTasks(b.tasks);
        setNewTaskId(b.newTaskId);
    }, [currentBoardId, boards])

    useEffect(() => {
        let elements = document.getElementsByClassName('taskDescriptionTextarea');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.height = 0;
            elements[i].style.height = elements[i].scrollHeight + 'px';
        }
    });

    const addPanel = () => {
        setPanels([
            ...panels,
            {
                id: newPanelId,
                title: panelCount + 1,
                taskIds: [],
            }
        ]);
        setNewPanelId(newPanelId + 1);
        setPanelCount(panelCount + 1);
    }

    const removePanel = (panelId) => {
        //Get the list of task ids kept by the panel right before deletion
        //so that they can be remove from tasks first.
        const taskIds = panels.find(panel => panel.id === panelId).taskIds;
        //Remove tasks that have an id matching an id in the taskIds list
        //of the panel being deleted.
        setTasks(tasks.filter(task => {
            for (let i = 0; i < taskIds.length; i++) {
                if (taskIds[i] === task.id) {
                    return false;
                }
            }
            return true;
        }));
        //Delete the panel from the list of panels.
        setPanels(panels.filter(panel => panel.id !== panelId));
        setPanelCount(panelCount - 1);
    }

    const addTask = (panelId, title, description) => {
        setPanels(panels.map(panel => {
            if (panel.id === panelId) {
                return {
                    ...panel,
                    taskIds: [
                        ...panel.taskIds,
                        newTaskId
                    ],
                };
            }
            return panel;
        }));
        setTasks([...tasks, { id: newTaskId, title: title, description: description, checkedOff: false }]);
        setNewTaskId(newTaskId + 1);
    }

    const removeTask = (panelId, taskId) => {
        setPanels(panels.map(panel => {
            if (panelId === panel.id) {
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
            if (panelId === panel.id) {
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
            if (panel.id === taskMove.srcPanelId) {
                const removeIndex = panel.taskIds.indexOf(taskMove.taskId);
                newTaskIds.splice(removeIndex, 1);
            }
            //Add task to dst
            if (panel.id === taskMove.dstPanelId) {
                //If dropped on a panel
                if (taskMove.targetTask === -1) {
                    newTaskIds.push(taskMove.taskId);
                }
                //If dropped on a task
                else {
                    const insertIndex = newTaskIds.indexOf(taskMove.targetTask);
                    if (taskMove.position === 'over') {
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
            if (task.id === taskId) {
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
            if (task.id === id) {
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
            if (task.id === id) {
                return {
                    ...task,
                    description: description
                };
            }
            return task;
        }))
    }

    const sidebarToggle = () => {
        setSidebarIsHidden(sidebarIsHidden ? false : true);
    }

    function addBoard() {
        setBoards([...boards,
            {
                panels: [
                    {
                        id: 1,
                        title: 1,
                        taskIds: [],
                    },
                    {
                        id: 2,
                        title: 2,
                        taskIds: [],
                    }
                ],
                tasks: [],
                newPanelId: 3,
                panelCount: 2,
                newTaskId: 1,
                id: newBoardId,
            }
        ]);
        setNewBoardId(newBoardId + 1);
    }

    function changeCurrentBoard(id) {
        setCurrentBoardId(id);
    }

    return (
        <div id='Board'>
            <Header 
                addPanel={addPanel}
                sidebarToggle={sidebarToggle}
            />
            <div id='ContentDiv'>
                <Sidebar 
                    boards={boards}
                    isHidden={sidebarIsHidden}
                    addBoard={addBoard}
                    changeCurrentBoard={changeCurrentBoard}
                />
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
        </div>
    )
}