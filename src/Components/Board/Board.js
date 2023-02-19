import './Board.css';
import { Panel } from '../Panel/Panel';
import { useState, useEffect } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';

export function Board(props) {
    // Get userData or set to default if not found.
    let checkUserData = JSON.parse(localStorage.getItem('userData'));
    if (!checkUserData) {
        localStorage.setItem('userData', JSON.stringify({
            boards: [
                {
                    title: 1,
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
            boardCount: 1,
        }));
        checkUserData = JSON.parse(localStorage.getItem('userData'));
    }

    /* 
        Boards need a title key
        Title key needs to be set on creation and/or editable after creation
        Needs to update in localStorage any time the title is updated
    */

    // // App State
    const [sidebarIsHidden, setSidebarIsHidden] = useState(true);
    const [userData, setData] = useState(JSON.parse(localStorage.getItem('userData')));

    useEffect(() => {
        let elements = document.getElementsByClassName('taskDescriptionTextarea');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.height = 0;
            elements[i].style.height = elements[i].scrollHeight + 'px';
        }
    });

    // NEW EFFECT HOOK
    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify(userData));
    }, [userData]);

    const addPanel = () => {
        setData({
            ...userData,
            boards: userData.boards.map(board => {
                if (board.id === userData.currentBoardId) {
                    return {
                        ...board,
                        panels: [
                            ...board.panels,
                            {
                                id: board.newPanelId,
                                title: board.panelCount + 1,
                                taskIds: [],
                            }
                        ],
                        newPanelId: board.newPanelId + 1,
                        panelCount: board.panelCount + 1,
                    }    
                }
                return board;
            })
        });
    }

    const removePanel = (panelId) => {
        const board = userData.boards.find(board => board.id === userData.currentBoardId);
        //Get the list of task ids kept by the panel right before deletion
        //so that they can be remove from tasks first.
        const taskIds = board.panels.find(panel => panel.id === panelId).taskIds;

        setData({
            ...userData,
            boards: userData.boards.map(board => {
                if (board.id === userData.currentBoardId) {
                    return {
                        ...board,
                        //Delete the panel from the list of panels.
                        panels: board.panels.filter(panel => panel.id !== panelId),
                        //Remove tasks that have an id matching an id in the taskIds list
                        //of the panel being deleted.
                        tasks: board.tasks.filter(task => {
                            for (let i = 0; i < taskIds.length; i++) {
                                if (taskIds[i] === task.id) {
                                    return false;
                                }
                            }
                            return true;
                        }),
                        //Decrement panel count
                        panelCount: board.panelCount - 1,
                    }
                }
                return board;
            })
        });
    }

    const addTask = (panelId, title, description) => {
        setData({
            ...userData,
            boards: userData.boards.map(board => {
                if (board.id === userData.currentBoardId) {
                    return {
                        ...board,
                        panels: board.panels.map(panel => {
                            if (panel.id === panelId) {
                                return {
                                    ...panel,
                                    taskIds: [
                                        ...panel.taskIds,
                                        board.newTaskId
                                    ]
                                }
                            }
                            return panel;
                        }),
                        tasks: [
                            ...board.tasks, 
                            { 
                                id: board.newTaskId, 
                                title: title, 
                                description: description, 
                                checkedOff: false 
                            }
                        ],
                        newTaskId: board.newTaskId + 1,
                    }
                }
                return board;
            })
        });
    }

    const removeTask = (panelId, taskId) => {
        setData({
            ...userData,
            boards: userData.boards.map(board => {
                if (board.id === userData.currentBoardId) {
                    return {
                        ...board,
                        panels: board.panels.map(panel => {
                            if (panelId === panel.id) {
                                return {
                                    ...panel,
                                    taskIds: panel.taskIds.filter(id => id !== taskId)
                                }
                            }
                            return panel;
                        }),
                        tasks: board.tasks.filter(task => task.id !== taskId),
                    }
                }
                return board;
            })
        });
    }

    const changePanelTitle = (panelId, newTitle) => {
        setData({
            ...userData,
            boards: userData.boards.map(board => {
                if (board.id === userData.currentBoardId) {
                    return {
                        ...board,
                        panels: board.panels.map(panel => {
                            if (panel.id === panelId) {
                                return {
                                    ...panel,
                                    title: newTitle
                                }
                            }
                            return panel;
                        })
                    }
                }
                return board;
            })
        });
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
        setData({
            ...userData,
            boards: userData.boards.map(board => {
                if (board.id === userData.currentBoardId) {
                    return {
                        ...board,
                        panels: board.panels.map(panel => {
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
                        })
                    }
                }
                return board;
            })
        });
    }

    const checkOffTask = taskId => {
        setData({
            ...userData,
            boards: userData.boards.map(board => {
                if (board.id === userData.currentBoardId) {
                    return {
                        ...board,
                        tasks: board.tasks.map(task => {
                            if (task.id === taskId) {
                                return {
                                    ...task,
                                    checkedOff: task.checkedOff ? false : true
                                }
                            }
                            return task;
                        })
                    }
                }
                return board;
            })
        });
    }

    const updateTaskTitle = (title, id) => {
        setData({
            ...userData,
            boards: userData.boards.map(board => {
                if (board.id === userData.currentBoardId) {
                    return {
                        ...board,
                        tasks: board.tasks.map(task => {
                            if (task.id === id) {
                                return {
                                    ...task,
                                    title: title
                                };
                            }
                            return task;
                        })
                    }
                }
                return board;
            })
        });
    }

    const updateTaskDescription = (description, id) => {
        setData({
            ...userData,
            boards: userData.boards.map(board => {
                if (board.id === userData.currentBoardId) {
                    return {
                        ...board,
                        tasks: board.tasks.map(task => {
                            if (task.id === id) {
                                return {
                                    ...task,
                                    description: description
                                };
                            }
                            return task;
                        })
                    }
                }
                return board;
            })
        });
    }

    const sidebarToggle = () => {
        setSidebarIsHidden(sidebarIsHidden ? false : true);
    }

    function addBoard() {
        setData({
            ...userData,
            boards: [
                ...userData.boards,
                {
                    title: userData.boardCount + 1,
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
                    id: userData.newBoardId,
                }
            ],
            newBoardId: userData.newBoardId + 1,
            boardCount: userData.boardCount + 1,
        });
    }

    function deleteBoard(id) {
        let newBoardId = 0;
        // If the current board is the one being removed, change boards.
        if (userData.currentBoardId === id && userData.boards.length > 1) {
            // Get first board from the end that isn't the one being removed.
            for (let i = userData.boards.length - 1; i >= 0; i--) {
                if (userData.boards[i].id !== id) {
                    newBoardId = userData.boards[i].id;
                    break;
                }
            }
        }
        // If current board isn't the one being removed, just keep it.
        else if (userData.currentBoardId !== id) {
            newBoardId = userData.currentBoardId;
        }
        setData({
            ...userData,
            boards: userData.boards.filter(board => board.id !== id),
            currentBoardId: newBoardId,
            boardCount: userData.boardCount - 1,
        });
    }

    function changeCurrentBoard(id) {
        setData({
            ...userData,
            currentBoardId: id
        });
    }

    return (
        <div id='Board'>
            <Header 
                addPanel={addPanel}
                sidebarToggle={sidebarToggle}
            />
            <div id='ContentDiv'>
                <Sidebar 
                    boards={userData.boards}
                    isHidden={sidebarIsHidden}
                    addBoard={addBoard}
                    changeCurrentBoard={changeCurrentBoard}
                    deleteBoard={deleteBoard}
                />
                {
                    userData.currentBoardId !== 0 ? 
                    <div className='Panels'>
                        {
                            userData.boards.find(board => board.id === userData.currentBoardId).panels.map((panel, i) => {
                                return <Panel
                                    panelId={panel.id}
                                    panelTitle={panel.title}
                                    taskIds={panel.taskIds}
                                    tasks={userData.boards.find(board => board.id === userData.currentBoardId).tasks}
                                    key={i}
                                    removePanel={removePanel}
                                    addTask={addTask}
                                    removeTask={removeTask}
                                    newTaskId={userData.boards.find(board => board.id === userData.currentBoardId).newTaskId}
                                    changePanelTitle={changePanelTitle}
                                    moveTask={moveTask}
                                    checkOffTask={checkOffTask}
                                    updateTaskTitle={updateTaskTitle}
                                    updateTaskDescription={updateTaskDescription}
                                />
                            })
                        }
                    </div> :
                    <div></div>
                }
            </div>
        </div>
    )
}