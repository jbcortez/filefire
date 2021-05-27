import React, { useState, Fragment, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { styles } from '../../styles/Styles';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../contexts/DBContext';
import Alert from '../layout/Alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const { logIn, currentUser, logInWithGoogle } = useAuth();
  const { handleAlert, alert, setLoading, loading } = useDB();

  const history = useHistory();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await logIn(email, password);
      setLoading(false);
    } catch {
      setLoading(false);
      handleAlert('error', 'Incorrect username or password');
    }
  };

  const handleLogInWithGoogle = async () => {
    try {
      await logInWithGoogle();
      setLoading(true);
    } catch (err) {
      setLoading(false);
      handleAlert('error', 'Oops! Something went wrong');
    }
  };

  useEffect(() => {
    if (currentUser) {
      history.push('/');
      setLoading(false);
    }
  }, [currentUser, history]);

  return (
    <Fragment>
      <Container className={classes.formContainer}>
        <Typography variant='h4' component='h2'>
          Log In
        </Typography>
        {alert && <Alert formAlert={true} />}
        <form autoComplete='off' onSubmit={onSubmit} className={classes.form}>
          <TextField
            color='primary'
            InputProps={{
              classes: {
                input: classes.inputField,
              },
            }}
            fullWidth
            name='email'
            label='Email'
            variant='outlined'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <TextField
            color='primary'
            InputProps={{
              classes: {
                input: classes.inputField,
              },
            }}
            fullWidth
            type='password'
            name='password'
            label='Password'
            variant='outlined'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <br />
          <div
            style={{
              textAlign: 'left',
              fontWeight: 'bold',
            }}>
            <Link
              to='/forgotpassword'
              style={{ textDecoration: 'none', fontSize: '1.3rem' }}>
              Forgot password
            </Link>
          </div>
          <Button type='submit' color='primary' variant='contained' fullWidth>
            Log In
          </Button>
        </form>
        <Button
          className={classes.googleButton}
          variant='outlined'
          color='primary'
          fullWidth
          onClick={handleLogInWithGoogle}>
          <i className='fab fa-google'></i>
          Log in with Google
        </Button>
      </Container>
      <div
        style={{ marginTop: '1em', textAlign: 'center', fontSize: '1.3rem' }}>
        <Link to='/signup'>Create account</Link>
      </div>
    </Fragment>
  );
};

export default Login;
