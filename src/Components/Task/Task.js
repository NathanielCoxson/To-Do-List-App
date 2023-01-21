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

    const drag_handler = event => {
        //console.log(event);
    }

    const dragover_handler = event => {
        //console.log(event.target.closest('#TaskDiv'));
        //event.target.closest('#TaskDiv').style.marginBottom = '5em';
        let targetDiv = event.target.closest('#TaskOuterDiv');
        let y = event.pageY;
        let top = targetDiv.offsetTop;
        let bottom = targetDiv.offsetHeight + top;
        let middle = (top + bottom) / 2;
        if(event.dataTransfer.getData('text/plain')) {
            console.log(JSON.parse(event.dataTransfer.getData('text/plain')));
        }
        if(y > middle) {
            targetDiv.style.paddingBottom = '3em';
            targetDiv.style.paddingTop = '0';
        }
        else {
            targetDiv.style.paddingTop = '3em';
            targetDiv.style.paddingBottom = '0';
        }
    }

    const dragleave_handler = event => {
        // event.target.closest('#TaskOuterDiv').style.paddingBottom = '0';
        // event.target.closest('#TaskOuterDiv').style.paddingTop = '0';
        //console.log(event);
        if(event.target.id === 'TaskOuterDiv') {
            event.target.closest('#TaskOuterDiv').style.paddingBottom = '0';
            event.target.closest('#TaskOuterDiv').style.paddingTop = '0'; 
        }
    }


    /* 
        When a task is dropped on another, determine where that drop
        happened so that you can determine if the new task should go
        before or after the one that was already there. Then pass that
        information with the task move object up to the board using
        its moveTask function.
    */
    const drop_handler = event => {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        console.log(data);
        // if(data.srcPanelId !== props.parentId) {
        //     const taskMove = {
        //         ...data,
        //         dstPanelId: props.parentId
        //     }
        //     props.moveTask(taskMove);
        // }  
        // if(props.taskIds.length > 0) {
        //     event.target.closest('#TaskOuterDiv').style.paddingBottom = '0';
        //     event.target.closest('#TaskOuterDiv').style.paddingTop = '0';
        // }
        console.log(event);
    }

    return (
        <div id='TaskOuterDiv'
            onDragOver={dragover_handler}
            onDragLeave={dragleave_handler}
            onDrop={drop_handler}
        >
            <div 
                id='TaskDiv' 
                className='Task'
                draggable='true'
                onDragStart={dragstart_handler}
                onDrag={drag_handler}
            >
                <div id='TaskTitle'>
                    <h2>{title}</h2>
                    <div className='TaskCloseButton' onClick={handleRemoval}><span>X</span></div>
                </div>
                <p>{description}</p>
            </div>
        </div>
    )
}