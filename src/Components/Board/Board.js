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

    const [data, setData] = useState(JSON.parse(localStorage.getItem('userData')));

    // // App State
    const [sidebarIsHidden, setSidebarIsHidden] = useState(true);
    // const [boards, setBoards] = useState(userData.boards);
    // const [currentBoardId, setCurrentBoardId] = useState(userData.currentBoardId);
    // const [newBoardId, setNewBoardId] = useState(userData.newBoardId);

    // // Individual Board State
    // const [panels, setPanels] = useState(userData.boards.find(board => board.id === currentBoardId).panels);
    // const [newPanelId, setNewPanelId] = useState(userData.boards.find(board => board.id === currentBoardId).newPanelId);
    // const [panelCount, setPanelCount] = useState(userData.boards.find(board => board.id === currentBoardId).panelCount);
    // const [tasks, setTasks] = useState(userData.boards.find(board => board.id === currentBoardId).tasks);
    // const [newTaskId, setNewTaskId] = useState(userData.boards.find(board => board.id === currentBoardId).newTaskId);

    /*
        Maybe store userData as state and only have one hook that depends on userData,
        then change any update to state variables to instead update userData.
    */

    // Update localStorage any time state changes
    // useEffect(() => {
    //     localStorage.setItem('userData', JSON.stringify({
    //         ...JSON.parse(localStorage.getItem('userData')),
    //         boards: boards.map(board => {
    //             if(board.id === currentBoardId) {
    //                 return {
    //                     ...board,
    //                     panels: panels,
    //                     tasks: tasks,
    //                     newPanelId: newPanelId,
    //                     panelCount: panelCount,
    //                     newTaskId: newTaskId,
    //                 }
    //             }
    //             return board;
    //         }),
    //     }));
    // }, [panels, newPanelId, tasks, newTaskId, panelCount, boards, currentBoardId]);

    // // Switch between boards
    // useEffect(() => {
    //     localStorage.setItem('userData', JSON.stringify({
    //         ...JSON.parse(localStorage.getItem('userData')),
    //         boards: boards,
    //         newBoardId: newBoardId,
    //     }));
    // }, [boards, newBoardId]);

    // useEffect(() => {
    //     localStorage.setItem('userData', JSON.stringify({
    //         ...JSON.parse(localStorage.getItem('userData')),
    //         currentBoardId: currentBoardId,
    //     }));
    //     let b = boards.find(board => board.id === currentBoardId);
    //     setPanels(b.panels);
    //     setNewPanelId(b.newPanelId);
    //     setPanelCount(b.panelCount);
    //     setTasks(b.tasks);
    //     setNewTaskId(b.newTaskId);
    // }, [currentBoardId, boards])

    useEffect(() => {
        let elements = document.getElementsByClassName('taskDescriptionTextarea');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.height = 0;
            elements[i].style.height = elements[i].scrollHeight + 'px';
        }
    });

    // NEW EFFECT HOOK
    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify(data));
    }, [data]);

    const addPanel = () => {
        setData({
            ...data,
            boards: data.boards.map(board => {
                if (board.id === data.currentBoardId) {
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
                        newPanelId: board.newBoardId + 1,
                        panelCount: board.panelCount + 1,
                    }    
                }
                return board;
            })
        });
    }

    const removePanel = (panelId) => {
        const board = data.boards.find(board => board.id === data.currentBoardId);
        //Get the list of task ids kept by the panel right before deletion
        //so that they can be remove from tasks first.
        const taskIds = board.panels.find(panel => panel.id === panelId).taskIds;

        setData({
            ...data,
            boards: data.boards.map(board => {
                if (board.id === data.currentBoardId) {
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
            ...data,
            boards: data.boards.map(board => {
                if (board.id === data.currentBoardId) {
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
            ...data,
            boards: data.boards.map(board => {
                if (board.id === data.currentBoardId) {
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
            ...data,
            boards: data.boards.map(board => {
                if (board.id === data.currentBoardId) {
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
            ...data,
            boards: data.boards.map(board => {
                if (board.id === data.currentBoardId) {
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
            ...data,
            boards: data.boards.map(board => {
                if (board.id === data.currentBoardId) {
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
            ...data,
            boards: data.boards.map(board => {
                if (board.id === data.currentBoardId) {
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
            ...data,
            boards: data.boards.map(board => {
                if (board.id === data.currentBoardId) {
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
            ...data,
            boards: [
                ...data.boards,
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
                    id: data.newBoardId,
                }
            ],
            newBoardId: data.newBoardId + 1
        });
    }

    function changeCurrentBoard(id) {
        setData({
            ...data,
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
                    boards={data.boards}
                    isHidden={sidebarIsHidden}
                    addBoard={addBoard}
                    changeCurrentBoard={changeCurrentBoard}
                />
                <div className='Panels'>
                    {
                        data.boards.find(board => board.id === data.currentBoardId).panels.map((panel, i) => {
                            return <Panel
                                panelId={panel.id}
                                panelTitle={panel.title}
                                taskIds={panel.taskIds}
                                tasks={data.boards.find(board => board.id === data.currentBoardId).tasks}
                                key={i}
                                removePanel={removePanel}
                                addTask={addTask}
                                removeTask={removeTask}
                                newTaskId={data.boards.find(board => board.id === data.currentBoardId).newTaskId}
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