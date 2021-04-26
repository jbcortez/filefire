import React, { useState } from 'react';
import { useDB } from '../../contexts/DBContext';
import ContextMenu from '../layout/ContextMenu';
import Modal from '../layout/Modal';

const ListItem = ({ item, index }) => {
  const {
    selectFolder,
    childFolders,
    childFiles,
    deleteFolder,
    deleteFile,
    downloadFile,
    renameFolder,
    renameFile,
    setName,
    name,
  } = useDB();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (item.isFolder) {
      renameFolder(item.id, name);
    } else {
      renameFile(item.id, name);
    }

    setName('');
    handleClose();
  };

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

  // ************************** Context Menu **************************
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

    function handleRename(e) {
      setOpen(true);
      childFolders.forEach((childFolder) => {
        if (e.target.innerText === childFolder.name) {
          renameFolder(childFolder.id);
        }
      });

      childFiles.forEach((childFile) => {
        if (e.target.innerText === childFile.name) {
          renameFile(childFile.id);
        }
      });

      const renameBtn = document.getElementById('rename');
      renameBtn.removeEventListener('click', handleRename);
    }

    const deleteBtn = document.getElementById('delete');
    deleteBtn.addEventListener('click', handleDelete);

    const renameBtn = document.getElementById('rename');
    renameBtn.addEventListener('click', handleRename);
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
        onContextMenu={(e) => {
          handleContextMenu(e, item);
        }}>
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
      <ContextMenu />
      <Modal
        open={open}
        setOpen={setOpen}
        handleSubmit={handleSubmit}
        label={item.isFolder === true ? 'Folder name' : 'File name'}
        headline={item.isFolder === true ? 'Rename folder' : 'Rename file'}
      />
    </div>
  );
};

export default ListItem;
