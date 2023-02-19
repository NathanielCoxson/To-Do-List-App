import { useEffect } from 'react';
import './Sidebar.css'

export function Sidebar(props) {
    const { 
        isHidden, 
        addBoard, 
        boards, 
        changeCurrentBoard,
        deleteBoard 
    } = props;

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
        addBoard();
    }

    function handleSwitchBoard(event) {
        changeCurrentBoard(Number(event.target.id));
    }

    function handleDeleteBoard(event) {
        deleteBoard(Number(event.target.id));
    }

    return (
        <div id='SidebarDiv'>
            <div className='sidebarItem sidebarTitle' >
                <span>Boards</span>
            </div>
            {
                boards.map((board, i) => {
                    return (
                        <div className='sidebarItem' key={i} >
                            <span
                                className='sidebarEntryTitle' 
                                onClick={handleSwitchBoard} 
                                id={board.id}>
                                    {board.title}
                            </span>
                            <span 
                                className='deleteBoardButton'
                                onClick={handleDeleteBoard}
                                id={board.id}>
                                X
                            </span>
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