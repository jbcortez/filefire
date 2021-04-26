import React from 'react';
import { useDB } from '../../contexts/DBContext';
import '../../styles/Breadcrumbs.scss';

const FolderBreadcrumbs = ({ currentFolder }) => {
  const { selectFolder } = useDB();

  return (
    <div className='breadcrumbs'>
      {currentFolder.path.length > 0 &&
        currentFolder.path.map((folder) => {
          return (
            <span key={folder.id}>
              <span
                onClick={() => selectFolder(folder.id)}
                className='breadcrumbs__item'>
                {folder.name}
              </span>
              <span className='separator'>
                {currentFolder.path.length > 0 ? '/' : ''}
              </span>
            </span>
          );
        })}
      <span className='breadcrumbs__item'>{currentFolder.name}</span>
    </div>
  );
};

export default FolderBreadcrumbs;
