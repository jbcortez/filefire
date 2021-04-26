import React, { useEffect } from 'react';
import CreateFolderButton from '../layout/CreateFolderButton';
import FileList from '../layout/FileList';
import { useDB } from '../../contexts/DBContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Dashboard.scss';
import UploadFileButton from '../layout/UploadFileButton';
import FolderBreadcrumbs from '../layout/FolderBreadcrumbs';

const Dashboard = () => {
  const { currentFolder, getChildFolders, getChildFiles } = useDB();
  const { currentUser } = useAuth();

  useEffect(() => {
    getChildFolders();
    getChildFiles();
    // eslint-disable-next-line
  }, [currentFolder, currentUser]);

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
      </div>
    </div>
  );
};

export default Dashboard;
