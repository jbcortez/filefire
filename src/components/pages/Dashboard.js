import React, { useEffect } from 'react';
import CreateFolderButton from '../layout/CreateFolderButton';
import FileList from '../layout/FileList';
import { useDB } from '../../contexts/DBContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Dashboard.scss';
import UploadFileButton from '../layout/UploadFileButton';
import FolderBreadcrumbs from '../layout/FolderBreadcrumbs';
import ContextMenu from '../layout/ContextMenu';
import Alert from '../layout/Alert';
import Modal from '../layout/Modal';

const Dashboard = () => {
  const {
    currentFolder,
    getChildFolders,
    getChildFiles,
    alert,
    menuEvent,
    renameFolder,
    childFolders,
    name,
    setOpen,
  } = useDB();
  const { currentUser } = useAuth();

  useEffect(() => {
    getChildFolders();
    getChildFiles();
    // eslint-disable-next-line
  }, [currentFolder, currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    childFolders.forEach((childFolder) => {
      if (menuEvent === childFolder.name) {
        renameFolder(childFolder.id, name);
        setOpen(false);
      }
    });
  };

  return (
    <div className='container'>
      <div className='sidebar'>
        <UploadFileButton currentFolder={currentFolder} />
        <CreateFolderButton currentFolder={currentFolder} />
      </div>
      <div className='main-content'>
        <div>
          <FolderBreadcrumbs currentFolder={currentFolder} />
        </div>
        <FileList />
        <ContextMenu />
        <Modal
          handleSubmit={handleSubmit}
          label='Name'
          headline='Rename folder'
        />
      </div>
      {alert && <Alert formAlert={false} />}
    </div>
  );
};

export default Dashboard;
