import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MUIModal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { styles } from '../../styles/Styles';
import { useDB } from '../../contexts/DBContext';

const Modal = ({
  open,
  setOpen,
  handleSubmit,
  label,
  headline,
  submitText,
  urlModal,
}) => {
  const { name, setName, URL } = useDB();

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return (
    <>
      <MUIModal open={open} onClose={() => setOpen(false)}>
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
              id={urlModal ? 'urlInput' : ''}
              name='name'
              label={label}
              variant='outlined'
              onChange={(e) => setName(e.target.value)}
              value={urlModal ? URL : name}
              required={!urlModal}
            />
            <div style={{ float: 'right', paddingTop: '2rem' }}>
              <Button
                variant='outlined'
                onClick={() => setOpen(false)}
                style={{ marginRight: '1rem' }}>
                Close
              </Button>
              <Button variant='contained' color='primary' type='submit'>
                {submitText ? submitText : 'Ok'}
              </Button>
            </div>
          </form>
        </div>
      </MUIModal>
    </>
  );
};

export default Modal;
