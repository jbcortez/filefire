import React from 'react';
import '../../styles/ContextMenu.scss';

const ContextMenu = () => {
  return (
    <>
      <ul id='context-menu'>
        <li className='item' id='delete'>
          <i className='fa fa-trash'></i>Delete
        </li>
        <li className='item' id='rename'>
          <i className='fa fa-pencil'></i>Rename
        </li>
      </ul>
    </>
  );
};

export default ContextMenu;
