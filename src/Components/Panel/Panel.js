import './Panel.css'
import { Task } from '../Task/Task.js'
import { useEffect, useState } from 'react';

export function Panel(props) {
    const [tasks, setTasks] = useState();
    return (
        <div className='Panel'>
            <Task title='Math HW' description="Calc problems"/>
            <Task title='Math HW' description="Calc problems"/>
        </div>
    );
}