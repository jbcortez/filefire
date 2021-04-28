import React from 'react';
import { useDB } from '../../contexts/DBContext';

const ListItem = ({ item }) => {
  const { selectFolder, downloadFile, handleContextMenu } = useDB();

  // ************************** Highlight item **************************

  const handleOnClick = (e) => {
    let items = document.querySelectorAll('#fileName');
    items.forEach((item) => {
      item.classList.remove('selected');
    });

    e.target.classList.add('selected');
  };

  const handleBlur = (e) => {
    e.target.classList.remove('selected');
  };

  return (
    <div className='grid-contents'>
      <div
        id='fileName'
        tabIndex='0'
        className='fileList-wrapper__item unselectable'
        onBlur={handleBlur}
        onClick={handleOnClick}
        onDoubleClick={
          item.isFolder === true
            ? () => selectFolder(item.id)
            : () => downloadFile(item.id)
        }
        onContextMenu={(e) => handleContextMenu(e)}>
        {item.isFolder === true ? (
          <i className='fa fa-folder'></i>
        ) : (
          <i className='fa fa-file'></i>
        )}
        {item.name}
      </div>
      <div
        className='fileList-wrapper__item'
        onDoubleClick={() => selectFolder(item.id)}>
        {item.timestamp}
      </div>
      <div
        className='fileList-wrapper__item'
        onDoubleClick={() => selectFolder(item.id)}>
        {item.fileSize}
      </div>
    </div>
  );
};

export default ListItem;
