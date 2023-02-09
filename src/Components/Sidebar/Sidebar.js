import { useEffect } from 'react';
import './Sidebar.css'

export function Sidebar(props) {
    const { isHidden, addBoard } = props;
    const exampleBoards = [
        // 'Homework',
        // 'Project 1',
    ]

    useEffect(() => {
        if (isHidden) {
            let target = document.getElementById('SidebarDiv');
            target.style.width = '0%';
        }
        else {
            let target = document.getElementById('SidebarDiv');
            target.style.width = '15%';
        }
    }, [isHidden]);

    function handleAddBoard(event) {
        addBoard()
    }

    return (
        <div id='SidebarDiv'>
            {
                exampleBoards.map((title, i) => {
                    return (
                        <div className='sidebarItem' key={i} >
                            <span>{title}</span>
                        </div>
                    );
                })
            }
            <div 
                id='AddPanelButton' 
                onClick={handleAddBoard}
            >
                <span>+</span>
            </div>
        </div>
    );
}