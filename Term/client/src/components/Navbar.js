import React from 'react';
import { AppBar, Toolbar, Typography, makeStyles, Button } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import '../css/navbar.css';
import { useNavigate } from 'react-router-dom';

import { UserAuth } from './AuthContext';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        marginRight: theme.spacing(2),
    },
    username: {
        marginRight: theme.spacing(2),
    },
    logoutButton: {
        textTransform: 'none',
    },
    logoutIcon: {
        marginRight: theme.spacing(1),
    },
}));

const Navbar = () => {
    const { uniqueName, user, logout } = UserAuth();
    const navigate = useNavigate();
    const classes = useStyles();
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            console.log('You are logged out')
        } catch (e) {
            console.log(e.message);
        }
    };
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Todo App
                    </Typography>
                    <Typography variant="body1" className={classes.username}>
                        {uniqueName}
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        className={classes.logoutButton}
                        startIcon={<ExitToApp className={classes.logoutIcon} />}
                    >
                        Logout
                    </Button>

                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;
