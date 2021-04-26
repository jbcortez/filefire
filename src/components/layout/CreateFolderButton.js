import React, { Fragment, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { styles } from '../../styles/Styles';
import { database } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../contexts/DBContext';

const CreateFolderButton = ({ currentFolder }) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const { currentUser } = useAuth();
  const { formatTime, getChildFolders } = useDB();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const path = [...currentFolder.path];
    path.push({ name: currentFolder.name, id: currentFolder.id });

    database.folders.add({
      name: name,
      parentId: currentFolder.id,
      userId: currentUser.uid,
      fileSize: '-',
      path: path,
      timestamp: formatTime(database.getCurrentTimestamp()),
    });

    getChildFolders();

    setName('');
    handleClose();
  };

  return (
    <Fragment>
      <Button
        onClick={handleOpen}
        variant='outlined'
        color='primary'
        style={{ width: '15rem' }}>
        Create folder
      </Button>
      <Modal open={open} onClose={handleClose}>
        <div className={classes.modal}>
          <Typography variant='h6' style={{ marginBottom: '2rem' }}>
            Create folder
          </Typography>
          <form onSubmit={onSubmit}>
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
              label='Folder name'
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
                Create folder
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </Fragment>
  );
};

export default CreateFolderButton;
