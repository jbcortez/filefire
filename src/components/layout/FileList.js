import React from 'react';
import '../../styles/FileList.scss';
import { useDB } from '../../contexts/DBContext';
import ListItem from './ListItem';

const FileList = () => {
  const { childFolders, childFiles } = useDB();

  return (
    <div className='container'>
      <div className='fileList-wrapper'>
        <div className='fileList-wrapper__header'>Name</div>
        <div className='fileList-wrapper__header'>Last modified</div>
        <div className='fileList-wrapper__header'>File size</div>
        {childFolders.length > 0 &&
          childFolders.map((folder, i) => {
            return <ListItem key={folder.id} folder={folder} index={i} />;
          })}
        {childFiles.length > 0 &&
          childFiles.map((folder, i) => {
            return <ListItem key={folder.id} folder={folder} index={i} />;
          })}
      </div>
    </div>
  );
};

export default FileList;
