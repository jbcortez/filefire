import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MUIModal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { styles } from '../../styles/Styles';
import { useDB } from '../../contexts/DBContext';

const Modal = ({ open, setOpen, handleSubmit, label, headline }) => {
  const { name, setName } = useDB();

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MUIModal open={open} onClose={handleClose}>
        <div className={classes.modal}>
          <Typography variant='h6' style={{ marginBottom: '2rem' }}>
            {headline}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              type='text'
              color='primary'
              InputProps={{
                classes: {
                  input: classes.inputField,
                },
              }}
              fullWidth
              name='name'
              label={label}
              variant='outlined'
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
            <div style={{ float: 'right', paddingTop: '2rem' }}>
              <Button
                variant='outlined'
                onClick={handleClose}
                style={{ marginRight: '1rem' }}>
                Close
              </Button>
              <Button variant='contained' color='primary' type='submit'>
                Ok
              </Button>
            </div>
          </form>
        </div>
      </MUIModal>
    </>
  );
};

export default Modal;
