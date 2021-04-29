import React, { useEffect } from 'react';
import '../../styles/ContextMenu.scss';
import { useDB } from '../../contexts/DBContext';

const ContextMenu = () => {
  const {
    handleDelete,
    menuTarget,
    setOpenRename,
    handleOpen,
    setOpenURL,
    getURL,
    downloadFile,
    URL,
  } = useDB();

  useEffect(() => {
    getURL(menuTarget);
  }, [menuTarget, getURL]);

  return (
    <>
      <ul id='context-menu'>
        <li
          className='item folder file'
          onClick={() => handleDelete(menuTarget)}
          id='delete'>
          <i className='fa fa-trash'></i>Delete
        </li>
        <li
          className='item folder'
          onClick={() => setOpenRename(true)}
          id='rename'>
          <i className='fas fa-edit'></i>Rename
        </li>
        <li
          className='item file'
          id='getLink'
          onClick={() => {
            setOpenURL(true);
          }}>
          <i className='fa fa-link'></i>Get Link
        </li>
        <li
          className='item folder file'
          id='open'
          onClick={() => handleOpen(menuTarget)}>
          <i className='fa fa-folder-open'></i>Open
        </li>
        <li
          className='item file'
          id='download'
          onClick={() => downloadFile(URL)}>
          <i className='fas fa-file-download'></i>Download
        </li>
      </ul>
    </>
  );
};

export default ContextMenu;
