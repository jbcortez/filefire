import React, { Fragment, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useDB } from '../../contexts/DBContext';
import '../../styles/Dashboard.scss';
import MUIModal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { styles } from '../../styles/Styles';

const UploadFileButton = () => {
  const { uploadFile } = useDB();

  const [open, setOpen] = useState(false);

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return (
    <Fragment>
      <Button
        style={{ marginBottom: '1.5rem' }}
        className='btn'
        variant='contained'
        color='primary'
        component='label'
        onClick={() => setOpen(true)}>
        Upload file
      </Button>
      <MUIModal open={open} onClose={() => setOpen(false)}>
        <div className={classes.modal}>
          <Typography variant='h6' style={{ marginBottom: '2rem' }}>
            Due to storage constraints, individual uploads are limited to 10MB.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            component='label'
            style={{ float: 'right' }}
            onClick={() => {
              setOpen(false);
            }}>
            OK
            <input
              type='file'
              id='file'
              onChange={(e) => {
                uploadFile(e.target.files[0]);
              }}
              hidden
            />
          </Button>
        </div>
      </MUIModal>
    </Fragment>
  );
};

export default UploadFileButton;
