import React, { useState, Fragment } from 'react';
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

  const { logIn } = useAuth();
  const { handleAlert, alert } = useDB();

  const history = useHistory();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await logIn(email, password);
      history.push('/');
    } catch {
      handleAlert('error', 'Incorrect username or password');
    }
  };

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
      </Container>
      <div
        style={{ marginTop: '1em', textAlign: 'center', fontSize: '1.3rem' }}>
        <Link to='/signup'>Create account</Link>
      </div>
    </Fragment>
  );
};

export default Login;
