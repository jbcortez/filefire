import React, { useState } from 'react';
import { useDB } from '../../contexts/DBContext';
import ContextMenu from '../layout/ContextMenu';
import Modal from '../layout/Modal';

const ListItem = ({ item }) => {
  const {
    selectFolder,
    downloadFile,
    renameFolder,
    renameFile,
    setName,
    name,
    handleContextMenu,
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
        onContextMenu={(e) => handleContextMenu(e, setOpen, item)}>
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
        label='Name'
        headline='Rename'
      />
    </div>
  );
};

export default ListItem;
