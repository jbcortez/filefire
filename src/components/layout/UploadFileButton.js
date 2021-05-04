import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { useDB } from '../../contexts/DBContext';
import '../../styles/Dashboard.scss';

const UploadFileButton = () => {
  const { uploadFile } = useDB();

  return (
    <Fragment>
      <Button
        style={{ marginBottom: '1.5rem' }}
        className='btn'
        variant='contained'
        color='primary'
        component='label'>
        Upload file
        <input
          type='file'
          id='file'
          onChange={(e) => {
            uploadFile(e.target.files[0]);
          }}
          hidden
        />
      </Button>
    </Fragment>
  );
};

export default UploadFileButton;
