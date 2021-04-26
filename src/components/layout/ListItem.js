import React from 'react';
import { useDB } from '../../contexts/DBContext';

const ListItem = ({ folder, index }) => {
  const {
    selectFolder,
    childFolders,
    childFiles,
    deleteFolder,
    deleteFile,
    downloadFile,
  } = useDB();

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

  const handleContextMenu = (e, folder) => {
    e.preventDefault();

    const menu = document.getElementById('context-menu');
    menu.classList.remove('active');
    menu.style.top = e.pageY + 'px';
    menu.style.left = e.pageX + 'px';

    setTimeout(() => {
      menu.classList.add('active');
    }, 0);

    window.addEventListener('click', () => {
      menu.classList.remove('active');
    });

    function handleDelete() {
      childFolders.forEach((item) => {
        if (e.target.innerText === item.name) {
          deleteFolder(item.id);
        }
      });

      childFiles.forEach((item) => {
        if (e.target.innerText === item.name) {
          deleteFile(item.id);
        }
      });

      deleteBtn.removeEventListener('click', handleDelete);
    }

    const deleteBtn = document.getElementById('delete');
    deleteBtn.addEventListener('click', handleDelete);
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
          folder.fileSize === '-'
            ? () => selectFolder(folder.id)
            : () => downloadFile(folder.id)
        }
        onContextMenu={(e) => {
          handleContextMenu(e, folder);
        }}>
        {folder.fileSize === '-' ? (
          <i className='fas fa-folder'></i>
        ) : (
          <i className='fas fa-file'></i>
        )}
        {folder.name}
      </div>
      <div
        className='fileList-wrapper__item'
        onDoubleClick={() => selectFolder(folder.id)}>
        {folder.timestamp}
      </div>
      <div
        className='fileList-wrapper__item'
        onDoubleClick={() => selectFolder(folder.id)}>
        {folder.fileSize}
      </div>
      <div id='context-menu'>
        <div className='item' id='delete'>
          <i className='fa fa-trash'></i>Delete
        </div>
      </div>
    </div>
  );
};

export default ListItem;
