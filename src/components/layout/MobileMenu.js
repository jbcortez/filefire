import React from 'react';
import { useDB } from '../../contexts/DBContext';

function MobileMenu() {
  const {
    handleDelete,
    setOpenRename,
    setOpenURL,
    handleOpen,
    downloadFile,
    menuTarget,
    URL,
  } = useDB();

  const handleClose = () => {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('active');
  };

  return (
    <div className='background' onClick={handleClose} id='mobile-menu'>
      <div className='mobile-menu-container'>
        <ul>
          <li
            className='menu-item mobile-folder mobile-file'
            onClick={() => handleDelete(menuTarget)}
            id='delete'>
            <i className='fa fa-trash'></i>Delete
          </li>
          <li
            className='menu-item mobile-folder'
            onClick={() => setOpenRename(true)}
            id='rename'>
            <i className='fas fa-edit'></i>Rename
          </li>
          <li
            className='menu-item mobile-file'
            id='getLink'
            onClick={() => {
              setOpenURL(true);
            }}>
            <i className='fa fa-link'></i>Get Link
          </li>
          <li
            className='menu-item mobile-folder mobile-file'
            id='open'
            onClick={() => handleOpen(menuTarget)}>
            <i className='fa fa-folder-open'></i>Open
          </li>
          <li
            className='menu-item mobile-file'
            id='download'
            onClick={() => downloadFile(URL)}>
            <i className='fas fa-file-download'></i>Download
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MobileMenu;
