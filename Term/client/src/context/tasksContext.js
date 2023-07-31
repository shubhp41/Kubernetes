import React, { useState } from 'react'
import { createContext } from 'react'

const taskContext = createContext();
const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [editTaskDescription, setEditTaskDescription] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [status, setStatus] = useState('');
    const payload = {
        tasks, setTasks,
        newTaskTitle, setNewTaskTitle,
        newTaskDescription, setNewTaskDescription,
        selectedFile, setSelectedFile,
        selectedTask, setSelectedTask,
        editTaskTitle, setEditTaskTitle,
        editTaskDescription, setEditTaskDescription,
        openDialog, setOpenDialog,
        status, setStatus

    }
    return (
        <taskContext.Provider value={payload}>{children}</taskContext.Provider>
    )
}

export { taskContext, TaskProvider }