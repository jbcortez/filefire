import React from 'react';
import '../../styles/ContextMenu.scss';

const ContextMenu = () => {
  return (
    <div id='context-menu'>
      <div className='item' id='delete'>
        <i className='fa fa-trash'></i> Delete
      </div>
    </div>
  );
};

export default ContextMenu;
