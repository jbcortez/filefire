import React, { Fragment, useState } from 'react';
import Button from '@material-ui/core/Button';
import Modal from '../layout/Modal';
import { useDB } from '../../contexts/DBContext';
import '../../styles/Dashboard.scss';

const CreateFolderButton = () => {
  const { createFolder } = useDB();

  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    createFolder();
    setOpen(false);
  };

  return (
    <Fragment>
      <Button
        onClick={() => setOpen(true)}
        variant='outlined'
        color='primary'
        className='btn'>
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
