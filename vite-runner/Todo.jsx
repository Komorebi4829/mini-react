import React from './core/React'
const { useState, useEffect } = React
import './Todo.css'

const STORAGE_KEYS = {
    tasks: 'tasks',
}

function Todo() {
    const [newtodo, setnewtodo] = useState('')
    const [tasks, settasks] = useState([])
    const [displayTasks, setdisplayTasks] = useState([])
    const [filter, setfilter] = useState('all')

    useEffect(() => {
        const tasksStr = localStorage.getItem(STORAGE_KEYS.tasks) || '[]'
        settasks(JSON.parse(tasksStr))
        return () => {}
    }, [])

    useEffect(() => {
        if (filter === 'all') {
            setdisplayTasks(tasks)
        } else {
            setdisplayTasks(tasks.filter((task) => task.status === filter))
        }
    }, [filter, tasks])

    function handleAdd() {
        if (!newtodo) return window.alert('请先输入')
        settasks((old) => [...old, { todo: newtodo, status: 0 }])
        setnewtodo('')
    }
    function handleSave() {
        localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks))
    }
    function handleDelete(index) {
        tasks.splice(index, 1)
        settasks([...tasks])
    }
    function toggleStatus(task, index) {
        tasks.splice(index, 1, { ...task, status: Number(!task.status) })
        settasks([...tasks])
    }
    return (
        <div>
            <h1>Todo</h1>
            <input type='text' value={newtodo} onChange={(e) => setnewtodo(e.target.value)} />
            <button onClick={handleAdd}>add</button>
            <div>
                <button onClick={handleSave}>save</button>
            </div>
            <div>
                <input
                    type='radio'
                    name='filter'
                    id='all'
                    checked={filter === 'all'}
                    onChange={() => setfilter('all')}
                />
                <label htmlFor='all'>all</label>

                <input type='radio' name='filter' id='0' checked={filter === 0} onChange={() => setfilter(0)} />
                <label htmlFor='0'>active</label>

                <input type='radio' name='filter' id='1' checked={filter === 1} onChange={() => setfilter(1)} />
                <label htmlFor='1'>done</label>
            </div>
            <ul>
                {...displayTasks.map((task, index) => {
                    return (
                        <li key={index}>
                            <span className={task.status === 1 && 'done'}>{task.todo}</span>
                            <button onClick={() => handleDelete(index)}>delete</button>
                            <button onClick={() => toggleStatus(task, index)}>
                                {task.status === 0 ? 'done' : 'cancel'}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Todo
