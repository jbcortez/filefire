import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { styles } from '../../styles/Styles';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { auth } from '../../firebase';
import firebase from 'firebase/app';

const Account = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [currentPassword, setCurrentPassword] = useState();
  const [currentPasswordEmail, setCurrentPasswordEmail] = useState();

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const reauthenticate = (currentPassowrd) => {
    const user = auth.currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(credential);
  };

  const onEmailSubmit = (e) => {
    e.preventDefault();

    reauthenticate(currentPassword)
      .then(() => {
        auth.currentUser
          .updateEmail(email)
          .then(() => {
            // alert success
            alert('Email changed');
          })
          .catch((error) => {
            // alert error
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const onPasswordSubmit = (e) => {
    e.preventDefault();

    reauthenticate(currentPassword)
      .then(() => {
        auth.currentUser
          .updatePassword(password)
          .then(() => {
            // alert success
            alert('Password changed');
          })
          .catch((error) => {
            // alert error
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <Container className={classes.formContainer}>
        <Typography variant='h4' component='h2'>
          My Account
        </Typography>
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
            type='password'
            name='password'
            label='New Password'
            variant='outlined'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
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

// current password
// new password
// confirm new password
// new email
// update buttons
