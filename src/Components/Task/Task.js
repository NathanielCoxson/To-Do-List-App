import './Task.css'

export function Task(props) {
    const {title, description, id, removeTask, parentId} = props;

    const handleRemoval = (event) => {
        event.preventDefault();
        removeTask(id);
    }

    const handleCheckOff = event => {
        event.preventDefault();
        props.checkOffTask(id);
    }

    const dragstart_handler = (event) => {
        //Set data to be the task id of the task being dragged
        event.dataTransfer.setData("text/plain", JSON.stringify({
            taskId: id,
            srcPanelId: parentId
        }));
    }

    const dragover_handler = event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
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
        event.preventDefault();
        if(event.target.id === 'TaskOuterDiv') {
            event.target.closest('#TaskOuterDiv').style.paddingBottom = '0';
            event.target.closest('#TaskOuterDiv').style.paddingTop = '0'; 
        }
    }

    const drop_handler = event => {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        const targetDiv = event.target.closest('#TaskOuterDiv');
        const paddingTop = parseInt(targetDiv.style.paddingTop);
        const taskMove = {
            ...data,
            dstPanelId: props.parentId,
            targetTask: id,
            position: paddingTop ? 'over' : 'under'
        }
        props.moveTask(taskMove);
        targetDiv.style.paddingTop = '0';
        targetDiv.style.paddingBottom = '0';
    }

    const handleTitleInput = event => {
        event.preventDefault();
        props.updateTaskTitle(event.target.value, id);
    }

    const handleDescriptionInput = event => {
        event.preventDefault();
        props.updateTaskDescription(event.target.value, id);
        event.target.style.height = 0;
        event.target.style.height = (event.target.scrollHeight) + 'px';
    }

    return (
        <div id='TaskOuterDiv'
            onDragOver={dragover_handler}
            onDragLeave={dragleave_handler}
            onDrop={drop_handler}   
        >
            <div 
                className='Task'
                id='TaskDiv' 
            >
                <div 
                    id='TaskTitle'
                    draggable='true'
                    onDragStart={dragstart_handler}
                >
                    {props.checkedOff ? 
                        <form className='TaskTitleForm'>
                            <input 
                                className='TaskTitleInput'
                                type='text'
                                name='title'
                                onChange={handleTitleInput}
                                value={title}
                                style={{textDecoration: 'line-through'}}
                            ></input>
                        </form> :
                        <form className='TaskTitleForm'>
                            <input 
                                className='TaskTitleInput'
                                type='text'
                                name='title'
                                onChange={handleTitleInput}
                                value={title}
                            ></input>
                        </form>
                    }
                    <div className='TaskCloseButton' onClick={handleRemoval}><span>X</span></div>
                </div>
                
                <div className='TaskContent'>
                    {props.checkedOff ?
                        <form className='TaskContentForm'>
                            <textarea  
                                className='taskDescriptionTextarea' 
                                type='text'
                                name='description'
                                onChange={handleDescriptionInput}
                                value={description}
                                style={{textDecoration: 'line-through'}}
                            ></textarea>
                        </form> :
                        <form className='TaskContentForm'>
                            <textarea
                                className='taskDescriptionTextarea' 
                                type='text'
                                name='description'
                                onChange={handleDescriptionInput}
                                value={description}
                            ></textarea>
                        </form>
                    }  
                </div>
                <div 
                    id='TaskCheckoffButton'
                    draggable='true'
                    onDragStart={dragstart_handler}
                ><span onClick={handleCheckOff}>✓</span></div>
            </div>
        </div>
    )
}