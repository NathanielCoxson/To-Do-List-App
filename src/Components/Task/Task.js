import './Task.css'

export function Task(props) {
    const {title, description, id, removeTask} = props;

    const handleRemoval = (event) => {
        event.preventDefault();
        removeTask(id);
    }

    return (
        <div className='Task'>
            <div className='TaskTitle'>
                <h2>{title}</h2>
                <button onClick={handleRemoval}>-</button>
            </div>
            <p>{description}</p>
        </div>
    )
}