import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { storage, database } from '../../firebase';
import { useDB } from '../../contexts/DBContext';
import { useAuth } from '../../contexts/AuthContext';

const UploadFileButton = () => {
  const { currentFolder, formatTime, getChildFiles } = useDB();
  const { currentUser } = useAuth();

  const formatFileSize = (fileSize) => {
    let formattedFileSize;

    if (fileSize < 1000) {
      formattedFileSize = `${fileSize} B`;
    }

    if (fileSize > 999 && fileSize < 1000000) {
      formattedFileSize = `${Math.round(fileSize / 1000)} KB`;
    }

    if (fileSize > 999999) {
      formattedFileSize = `${Math.round(fileSize / 1000000)} MB`;
    }

    return formattedFileSize;
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    let folderPath = [];

    currentFolder.path.forEach((folder) => {
      if (folder.id !== 'root') {
        folderPath.push(folder.id);
      }
    });

    const filePath = `${folderPath.join('/')}/${
      currentFolder.id !== 'root' ? currentFolder.id : ''
    }/${file.name}`;

    const uploadTask = storage
      .ref(`/files/${currentUser.uid}/${filePath}`)
      .put(file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
      },
      (error) => {
        //handle unsucessful uploads
      },
      () => {
        // After upload is successful...
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          database.files.add({
            name: file.name,
            fileSize: formatFileSize(uploadTask.snapshot.totalBytes),
            parentId: currentFolder.id,
            url: url,
            userId: currentUser.uid,
            timestamp: formatTime(database.getCurrentTimestamp()),
          });

          getChildFiles();
        });
      }
    );
  };

  return (
    <Fragment>
      <Button
        style={{ width: '15rem', marginBottom: '1.5rem' }}
        variant='contained'
        color='primary'
        component='label'>
        Upload file
        <input type='file' id='file' onChange={handleUploadFile} hidden />
      </Button>
    </Fragment>
  );
};

export default UploadFileButton;
