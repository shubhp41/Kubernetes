import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/task.css"
import { Typography, TextField, Button, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel } from '@material-ui/core';
import { GetTodos } from './api';
import Switch from '@mui/material/Switch';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { taskContext } from '../context/tasksContext';
import { useContext } from 'react';
import { UserAuth } from './AuthContext';
import AxiosInstance from './axios';

// axios.defaults.baseURL = 'http://localhost:3001';
const Tasks = () => {
    const { tasks, setTasks,
        newTaskTitle, setNewTaskTitle,
        newTaskDescription, setNewTaskDescription,
        selectedFile, setSelectedFile,
        selectedTask, setSelectedTask,
        editTaskTitle, setEditTaskTitle,
        editTaskDescription, setEditTaskDescription,
        openDialog, setOpenDialog,
        status, setStatus } = useContext(taskContext);
    const { uniqueId } = UserAuth();
    console.log("GETTTTTTTTTT", uniqueId)
    useEffect(() => {
        GetTodos(uniqueId, (res) => {
            console.log("response of get todo", res)
            setTasks(res.data)
        }, (err) => { console.log(err) })
        // Fetch tasks from the backend API

    }, []);


    const handleEditTask = (task) => {
        setSelectedTask(task);
        setEditTaskTitle(task.title);
        setEditTaskDescription(task.description);
        setOpenDialog(true)
    };
    const handleToggleStatus = (task) => {
        const updatedStatus = !task.completed;
        setStatus(!task.completed)

        AxiosInstance.put(`/api/status/${task.id}`, { completed: updatedStatus, user_id: uniqueId })
            .then(response => {
                const updatedTasks = tasks.map(t =>
                    t.id === task.id ? { ...t, completed: updatedStatus } : t
                );
                setTasks(updatedTasks);
            })
            .catch(error => {
                console.error(error);
            });
    };
    const handleDeleteTask = (taskId) => {
        AxiosInstance.delete(`/api/tasks/${taskId}`)
            .then(() => {
                const updatedTasks = tasks.filter(task => task.id !== taskId);
                setTasks(updatedTasks);
            })
            .catch(error => {
                console.error(error);
            });
    };
    const handleUpdateTask = () => {

        AxiosInstance.put(`/api/tasks/${selectedTask.id}`, { title: editTaskTitle, description: editTaskDescription, completed: status, user_id: uniqueId })
            .then(response => {
                const updatedTasks = tasks.map(task =>
                    task.id === selectedTask.id ? { ...task, title: editTaskTitle, description: editTaskDescription } : task
                );
                GetTodos(uniqueId, (res) => {
                    console.log("response of get todo", res)
                    setTasks(res.data)
                }, (err) => { console.log(err) })
                setTasks(updatedTasks);
                setSelectedTask(null);
                setEditTaskTitle('');
                setEditTaskDescription('');
                setOpenDialog(false)
            })
            .catch(error => {
                console.error(error);
            });

    };
    console.log(tasks)
    return (<>
        <Navbar />
        <Sidebar />
        {tasks.length != 0 ? tasks.map(task => (
            <Card key={task.id} className="task-card" onClick={() => handleEditTask(task)}>
                <CardContent>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body1">{task.description}</Typography>
                    <Typography
                        variant="body2"
                        className={task.completed ? 'status-completed' : 'status-pending'}
                        onClick={e => {
                            e.stopPropagation();
                            handleToggleStatus(task);
                        }}
                    >
                        {task.completed ? 'Completed' : 'Pending'}
                    </Typography>
                </CardContent>
                <div className="task-actions">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={e => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </Card>
        ))
            : <Card className="task-card">
                <Typography variant="h6">No Task For Today</Typography>
            </Card>
        }


        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
                <TextField
                    label="Title"
                    fullWidth
                    value={editTaskTitle}
                    onChange={e => setEditTaskTitle(e.target.value)}
                />
                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={editTaskDescription}
                    onChange={e => setEditTaskDescription(e.target.value)}
                />

                <FormControlLabel control={<Switch checked={status} onChange={(e) => {
                    setStatus(e.target.checked)
                    console.log(e.target.checked)
                }} />} label="Completed" />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleUpdateTask}>
                    Update
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setOpenDialog(false)}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    </>
    )
}

export default Tasks