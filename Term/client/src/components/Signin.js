import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from './AuthContext';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn, uniqueId, setUniqueId, setUniqueName } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await signIn(email, password);
      setUniqueId(response.user.reloadUserInfo.localId);
      setUniqueName(response.user.reloadUserInfo.email);


      navigate('/home');
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };
  console.log("In signin", uniqueId);
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth={400}
      mx="auto"
      my={16}
      p={4}
      border="1px solid #ccc"
      borderRadius={4}
      boxShadow={1}
    >
      <Typography variant="h4" gutterBottom>
        Sign in to your account
      </Typography>
      <Typography variant="body1" gutterBottom>
        Don't have an account yet?{' '}
        <Link to="/signup" className="underline">
          Sign up.
        </Link>
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Box mt={2}>
          <TextField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            type="password"
            fullWidth
          />
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
          >
            Sign In
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Signin;
