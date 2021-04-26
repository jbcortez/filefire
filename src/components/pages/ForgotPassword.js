import React, { Fragment, useState } from 'react';

import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { styles } from '../../styles/Styles';
import { makeStyles } from '@material-ui/styles';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const { sendPasswordReset } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordReset(email);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Fragment>
      <Container className={classes.formContainer}>
        <Typography variant='h4' component='h2'>
          Reset Password
        </Typography>

        <form autoComplete='off' onSubmit={onSubmit} className={classes.form}>
          <TextField
            color='primary'
            className={classes.inputField}
            fullWidth
            name='email'
            label='Email'
            variant='outlined'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <Button type='submit' variant='contained' color='primary'>
            Reset Password
          </Button>
        </form>
      </Container>
      <div
        style={{ marginTop: '1em', textAlign: 'center', fontSize: '1.3rem' }}>
        <Link to='/login'>Log in to your account</Link>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;
