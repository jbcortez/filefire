import React, { Fragment, useState } from 'react';
import Button from '@material-ui/core/Button';
import Modal from '../layout/Modal';
import { useDB } from '../../contexts/DBContext';

const CreateFolderButton = () => {
  const {
    name,

    checkForDuplicate,
    setOpenDuplicateModal,
    createFolder,
  } = useDB();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isDuplicate = checkForDuplicate(name);
    if (isDuplicate) {
      handleClose();
      setOpenDuplicateModal(true);
    } else {
      createFolder();
      handleClose();
    }
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
