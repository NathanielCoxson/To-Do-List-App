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
                    tasks: [],
                    newTaskId: 1
                },
                {
                    id: 2,
                    title: 2,
                    tasks: [],
                    newTaskId: 1
                }
            ],
            panelId: 3,
            panelCount: 2
        }));
    }
    const  [panels, setPanels] = useState(JSON.parse(localStorage.getItem('userData')).panels);
    const [id, setId] = useState(JSON.parse(localStorage.getItem('userData')).panelId);
    const [panelCount, setPanelCount] = useState(localStorage.getItem('userData'.panelCount));

    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify({
            panels: panels,
            panelId: id,
            panelCount: panels.length
        }));
        setPanelCount(panels.length);
        console.log(localStorage.getItem('userData'));
    }, [panels]);

    const handleAddPanel = (event) => {
        event.preventDefault();
        setId(id + 1);
        setPanels([
            ...panels,
            {
                id: id,
                title: panelCount + 1,
                tasks: [],
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
                    tasks: [
                        ...panel.tasks,
                        {title, description, id}
                    ],
                    newTaskId: panel.newTaskId + 1
                };
            }
            return panel;
        }));
    } 

    const removeTask = (panelId, taskId) => {
        setPanels(panels.map(panel => {
            if(panelId === panel.id) {
                return {
                    ...panel,
                    tasks: panel.tasks.filter(task => taskId !== task.id)
                };
            }
            return panel;
        }))
    }

    return (
        <div>
            <div className='Panels'>
                {
                    panels.map((panel, i) => {
                        return <Panel
                            panelId={panel.id}
                            panelTitle={panel.title}
                            tasks={panel.tasks}
                            key={i}
                            removePanel={removePanel}
                            addTask={addTask}
                            removeTask={removeTask}
                            newTaskId={panel.newTaskId}
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