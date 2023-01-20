import './Task.css'

export function Task(props) {
    const {title, description, id, removeTask, parentId} = props;

    const handleRemoval = (event) => {
        event.preventDefault();
        removeTask(id);
    }

    const dragstart_handler = (event) => {
        //Set data to be the task id of the task being dragged
        event.dataTransfer.setData("text/plain", JSON.stringify({
            taskId: id,
            srcPanelId: parentId
        }));
    }

    return (
        <div 
            id='TaskDiv' 
            className='Task'
            draggable='true'
            onDragStart={dragstart_handler}
        >
            <div id='TaskTitle'>
                <h2>{title}</h2>
                <div className='TaskCloseButton' onClick={handleRemoval}><span>X</span></div>
            </div>
            <p>{description}</p>
        </div>
    )
}