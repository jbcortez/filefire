import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { styles } from '../../styles/Styles';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { auth } from '../../firebase';
import { useDB } from '../../contexts/DBContext';
import firebase from 'firebase/app';
import Alert from '../layout/Alert';

const Account = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordEmail, setCurrentPasswordEmail] = useState('');

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const { handleAlert, alert } = useDB();

  const reauthenticate = (pass) => {
    const user = auth.currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      pass
    );
    return user.reauthenticateWithCredential(credential);
  };

  const onEmailSubmit = (e) => {
    e.preventDefault();

    reauthenticate(currentPasswordEmail)
      .then(() => {
        auth.currentUser
          .updateEmail(email)
          .then(() => {
            // alert success
            handleAlert('success', 'Email successfully updated');
          })
          .catch((error) => {
            // alert error
            handleAlert('error', 'Oops! Something went wrong');
          });
      })
      .catch((error) => {
        handleAlert('error', 'Oops! Something went wrong');
      });
  };

  const onPasswordSubmit = (e) => {
    e.preventDefault();

    reauthenticate(currentPassword)
      .then(() => {
        auth.currentUser
          .updatePassword(newPassword)
          .then(() => {
            // alert success
            handleAlert('success', 'Password successfully changed');
          })
          .catch((error) => {
            // alert error
            handleAlert('error', 'Oops! Something went wrong');
          });
      })
      .catch((error) => {
        handleAlert('error', 'Oops! Something went wrong');
      });
  };

  return (
    <>
      <Container className={classes.formContainer}>
        <Typography variant='h4' component='h2'>
          My Account
        </Typography>
        {alert && <Alert formAlert={true} />}
        <form
          onSubmit={onEmailSubmit}
          className={classes.form}
          style={{ marginBottom: '3rem' }}>
          <TextField
            color='primary'
            InputProps={{
              classes: {
                input: classes.inputField,
              },
            }}
            fullWidth
            type='password'
            name='currentPasswordEmail'
            label='Current Password'
            variant='outlined'
            onChange={(e) => setCurrentPasswordEmail(e.target.value)}
            value={currentPasswordEmail}
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
            type='email'
            name='email'
            label='New Email'
            variant='outlined'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <Button type='submit' fullWidth color='primary' variant='contained'>
            Update Email
          </Button>
        </form>

        <form onSubmit={onPasswordSubmit} className={classes.form}>
          <TextField
            color='primary'
            InputProps={{
              classes: {
                input: classes.inputField,
              },
            }}
            fullWidth
            type='password'
            name='currentPassword'
            label='Current Password'
            variant='outlined'
            onChange={(e) => setCurrentPassword(e.target.value)}
            value={currentPassword}
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
            type='newPassword'
            name='newPassword'
            label='New Password'
            variant='outlined'
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
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
            name='confirmPassword'
            label='Confirm Password'
            variant='outlined'
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
          />
          <Button type='submit' fullWidth color='primary' variant='contained'>
            Update Password
          </Button>
        </form>
      </Container>
    </>
  );
};

export default Account;
