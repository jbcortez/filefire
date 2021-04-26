import React, { useState } from 'react';
import { useDB } from '../../contexts/DBContext';
import ContextMenu from '../layout/ContextMenu';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { styles } from '../../styles/Styles';
import { database } from '../../firebase';

const ListItem = ({ folder, index }) => {
  const {
    selectFolder,
    childFolders,
    childFiles,
    deleteFolder,
    deleteFile,
    downloadFile,
    renameFolder,
    renameFile,
  } = useDB();

  // ************************** Rename file/folder modal **************************
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setName('');
    handleClose();
  };
  // ******************************************************************************

  // ************************** Highlight item **************************

  const handleOnClick = (e) => {
    let items = document.querySelectorAll('#fileName');
    items.forEach((item) => {
      item.classList.remove('selected');
    });

    e.target.classList.add('selected');
  };

  const handleBlur = (e) => {
    e.target.classList.remove('selected');
  };

  // ************************** Context Menu **************************
  const handleDelete = (e) => {
    childFolders.forEach((item) => {
      if (e.target.innerText === item.name) {
        deleteFolder(item.id);
      }
    });

    childFiles.forEach((item) => {
      if (e.target.innerText === item.name) {
        deleteFile(item.id);
      }
    });

    const deleteBtn = document.getElementById('delete');
    deleteBtn.removeEventListener('click', handleDelete);
  };

  const handleRename = (e) => {
    childFolders.forEach((item) => {
      if (e.target.innerText === item.name) {
        renameFolder(item.id);
      }
    });

    childFiles.forEach((item) => {
      if (e.target.innerText === item.name) {
        renameFile(item.id);
      }
    });

    const renameBtn = document.getElementById('rename');
    renameBtn.removeEventListener('click', handleRename);
  };

  const handleContextMenu = (e, folder) => {
    e.preventDefault();

    const menu = document.getElementById('context-menu');
    menu.classList.remove('active');
    menu.style.top = e.pageY + 'px';
    menu.style.left = e.pageX + 'px';

    setTimeout(() => {
      menu.classList.add('active');
    }, 0);

    window.addEventListener('click', () => {
      menu.classList.remove('active');
    });

    const deleteBtn = document.getElementById('delete');
    deleteBtn.addEventListener('click', handleDelete);

    const renameBtn = document.getElementById('rename');
    renameBtn.addEventListener('click', handleRename);
  };

  return (
    <div className='grid-contents'>
      <div
        id='fileName'
        tabIndex='0'
        className='fileList-wrapper__item unselectable'
        onBlur={handleBlur}
        onClick={handleOnClick}
        onDoubleClick={
          folder.fileSize === '-'
            ? () => selectFolder(folder.id)
            : () => downloadFile(folder.id)
        }
        onContextMenu={(e) => {
          handleContextMenu(e, folder);
        }}>
        {folder.fileSize === '-' ? (
          <i className='fa fa-folder'></i>
        ) : (
          <i className='fa fa-file'></i>
        )}
        {folder.name}
      </div>
      <div
        className='fileList-wrapper__item'
        onDoubleClick={() => selectFolder(folder.id)}>
        {folder.timestamp}
      </div>
      <div
        className='fileList-wrapper__item'
        onDoubleClick={() => selectFolder(folder.id)}>
        {folder.fileSize}
      </div>
      <ContextMenu />
      <Modal open={open} onClose={handleClose}>
        <div className={classes.modal}>
          <Typography variant='h6' style={{ marginBottom: '2rem' }}>
            {folder.fileSize === '-' ? 'Update Folder' : 'Update File'}
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
              label={folder.fileSize === '-' ? 'Folder Name' : 'File Name'}
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
                {folder.fileSize === '-' ? 'Update Folder' : 'Update File'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ListItem;
