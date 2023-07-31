import React, { useState, useEffect } from 'react';
import "./test.css"
import { Container, Typography, TextField, Button, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel } from '@material-ui/core';
import { AddTasks, GetTodos } from './api';
import Switch from '@mui/material/Switch';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { taskContext } from '../context/tasksContext';
import { useContext } from 'react';
import { UserAuth } from './AuthContext';
import AxiosInstance from './axios';

const HomePage = () => {
    const [extractedText, setExtractedText] = useState('');
    const [file, setFile] = useState(null);
    const { uniqueId } = UserAuth();
    console.log("UNIQQQQQQQQQQQ", uniqueId)

    const { tasks, setTasks,
        newTaskTitle, setNewTaskTitle,
        newTaskDescription, setNewTaskDescription,
        selectedFile, setSelectedFile,
        selectedTask, setSelectedTask,
        editTaskTitle, setEditTaskTitle,
        editTaskDescription, setEditTaskDescription,
        openDialog, setOpenDialog,
        status, setStatus } = useContext(taskContext);

    useEffect(() => {
        GetTodos(uniqueId, (res) => {
            console.log("response of get todo", res)
            setTasks(res.data)
        }, (err) => { console.log(err) })
        // Fetch tasks from the backend API

    }, []);

    const handleAddTask = () => {
        let payload = { user_id: uniqueId, title: newTaskTitle, description: newTaskDescription }
        console.log(uniqueId)
        AddTasks(payload, (res) => {
            console.log("This is response of add todo", res)
            setTasks(prevTasks => [...prevTasks, res.data]);
            setNewTaskTitle('');
            setNewTaskDescription('');
        }, (err) => {
            console.log("Error in Add todo", err)
        })

    };


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        console.log('e.target.files[0]', e.target.files[0])
    };
    const handleUpload = () => {
        console.log('This is the uploaded file ', file)
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            // formData.append('user_id', uniqueId);
            console.log(formData)

            AxiosInstance.post('/upload',
                formData,
            )

                .then((response) => {
                    // Handle the response from the backend
                    let extractedText = response.data.extractedText
                    console.log(response.data.extractedText);
                    const titleValue = extractedText.split("Title - ")[1].split("\n")[0];
                    setNewTaskTitle(titleValue)
                    const descriptionValue = extractedText.split("Description - ")[1];
                    setNewTaskDescription(descriptionValue)

                    let payload = { user_id: uniqueId, title: titleValue, description: descriptionValue }
                    AddTasks(payload, (res) => {
                        console.log("This is response of add todo", res)
                        setTasks(prevTasks => [...prevTasks, res.data]);
                        setNewTaskTitle('');
                        setNewTaskDescription('');
                    }, (err) => {
                        console.log("Error in Add todo", err)
                    })

                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };


    return (
        <>

            <Navbar />
            <Sidebar />
            <Container maxWidth="sm" className="app-container">


                <form className="add-task-form">
                    <TextField
                        label="Title"
                        fullWidth
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={newTaskDescription}
                        onChange={e => setNewTaskDescription(e.target.value)}
                    />

                    <div className="upload-file-container">
                        <input type="file" onChange={handleFileChange} />
                        <Button variant="contained" color="primary" onClick={handleUpload}>
                            Upload File
                        </Button>
                    </div>

                    <Button variant="contained" color="primary" onClick={handleAddTask}>
                        Add Task
                    </Button>
                </form>

                {/* {tasks && tasks.map(task => (
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
                ))}

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
                </Dialog> */}
            </Container>
        </>
    )

}

export default HomePage