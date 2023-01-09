import './Board.css'
import { Panel } from '../Panel/Panel';
import { useState } from 'react';

export function Board(props) {
    const  [panels, setPanels] = useState([]);
    const [id, setId] = useState(1);

    const handleAddPanel = (event) => {
        event.preventDefault();
        setId(id + 1);
        console.log(id);
        setPanels([
            ...panels,
            {
                id: id
            }
        ]);
    }

    const removePanel = (panelId) => {
        setPanels(panels.filter(panel => panel.id !== panelId));
    }

    return (
        <div>
            <div className='Panels'>
                {
                    panels.map((panel, i) => {
                        return <Panel
                            panelId={panel.id}
                            key={i}
                            remove={removePanel}
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