import React, { useEffect } from 'react';
import '../../styles/ContextMenu.scss';
import { useDB } from '../../contexts/DBContext';

const ContextMenu = () => {
  const { handleRename, handleDelete, menuEvent, setOpen } = useDB();

  return (
    <>
      <ul id='context-menu'>
        <li
          className='item folder file'
          onClick={() => setOpen(true)}
          id='delete'>
          <i className='fa fa-trash'></i>Delete
        </li>
        <li
          className='item folder'
          onClick={() => handleRename(menuEvent)}
          id='rename'>
          <i className='fas fa-edit'></i>Rename
        </li>
        <li className='item file' id='rename'>
          <i className='fa fa-link'></i>Get Link
        </li>
        <li className='item folder file' id='rename'>
          <i className='fa fa-folder-open'></i>Open
        </li>
        <li className='item file' id='rename'>
          <i className='fas fa-file-download'></i>Download
        </li>
      </ul>
    </>
  );
};

export default ContextMenu;
