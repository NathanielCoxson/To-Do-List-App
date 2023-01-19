import './Task.css'

export function Task(props) {
    const {title, description, id, removeTask} = props;

    const handleRemoval = (event) => {
        event.preventDefault();
        removeTask(id);
    }

    return (
        <div id='TaskDiv' className='Task'>
            <div id='TaskTitle'>
                <h2>{title}</h2>
                <div className='TaskCloseButton' onClick={handleRemoval}><span>x</span></div>
            </div>
            <p>{description}</p>
        </div>
    )
}