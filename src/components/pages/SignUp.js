import React, { useState, Fragment, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { styles } from '../../styles/Styles';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../contexts/DBContext';
import Alert from '../layout/Alert';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const { signUp, logInWithGoogle, currentUser } = useAuth();
  const { handleAlert, alert, setLoading } = useDB();

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const onPasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await signUp(email, password);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleAlert('error', 'Oops! Something went wrong');
    }
  };

  const handleLogInWithGoogle = async () => {
    try {
      setLoading(true);
      await logInWithGoogle();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleAlert('error', 'Oops! Something went wrong');
    }
  };

  const history = useHistory();
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
          Sign Up
        </Typography>
        {alert && <Alert formAlert={true} />}
        <form className={classes.form} onSubmit={onSubmit}>
          <TextField
            name='email'
            required
            InputProps={{
              classes: {
                input: classes.inputField,
              },
            }}
            color='primary'
            fullWidth={true}
            type='email'
            label='Email'
            variant='outlined'
            onChange={onEmailChange}
            value={email}
          />
          <TextField
            name='password'
            required
            InputProps={{
              classes: {
                input: classes.inputField,
              },
            }}
            color='primary'
            fullWidth={true}
            type='password'
            label='Password'
            variant='outlined'
            onChange={onPasswordChange}
            value={password}
          />
          <TextField
            name='password-confirm'
            required
            InputProps={{
              classes: {
                input: classes.inputField,
              },
            }}
            color='primary'
            fullWidth={true}
            type='password'
            label='Confirm Password'
            variant='outlined'
            onChange={onPasswordConfirmChange}
            value={passwordConfirm}
          />

          <Button
            className={classes.customBtn}
            type='submit'
            color='primary'
            variant='contained'
            fullWidth={true}>
            Sign Up
          </Button>
        </form>

        <Button
          className={classes.googleButton}
          variant='outlined'
          color='primary'
          fullWidth
          onClick={handleLogInWithGoogle}>
          <i className='fab fa-google'></i>
          Sign up with Google
        </Button>
      </Container>
      <div
        style={{ marginTop: '1em', textAlign: 'center', fontSize: '1.3rem' }}>
        <Link to='/login'>Already have an account?</Link>
      </div>
    </Fragment>
  );
};

export default SignUp;
