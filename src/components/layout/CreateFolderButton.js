import React, { Fragment, useState } from 'react';
import Button from '@material-ui/core/Button';
import Modal from '../layout/Modal';
import { database } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../contexts/DBContext';

const CreateFolderButton = ({ currentFolder }) => {
  const { name, setName, handleFormAlert } = useDB();

  const [open, setOpen] = useState(false);

  const { currentUser } = useAuth();
  const { formatTime, getChildFolders } = useDB();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const path = [...currentFolder.path];
    path.push({ name: currentFolder.name, id: currentFolder.id });

    try {
      database.folders.add({
        name: name,
        parentId: currentFolder.id,
        userId: currentUser.uid,
        fileSize: '-',
        isFolder: true,
        path: path,
        timestamp: formatTime(database.getCurrentTimestamp()),
      });

      getChildFolders();

      handleFormAlert('success', 'Folder created');
    } catch {
      handleFormAlert('error', 'Error: folder not created');
    }

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
      <Modal
        open={open}
        setOpen={setOpen}
        handleSubmit={handleSubmit}
        label={'Folder Name'}
        buttonLabel={'Create Folder'}
        headline={'Create folder'}
      />
    </Fragment>
  );
};

export default CreateFolderButton;
