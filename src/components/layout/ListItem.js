import React from 'react';
import { useDB } from '../../contexts/DBContext';

const ListItem = ({ item }) => {
  const { selectFolder, openFile, handleContextMenu, setMenuTarget } = useDB();

  const [dragging, setDragging] = React.useState(false);

  const handleOnClick = (e) => {
    let items = document.querySelectorAll('.fileName');
    items.forEach((item) => {
      item.classList.remove('selected');
    });

    if (e.target.classList.contains('text')) {
      e.target.parentNode.classList.add('selected');
    } else {
      e.target.classList.add('selected');
    }
  };

  const handleBlur = (e) => {
    e.target.classList.remove('selected');
  };

  const handleMobileMenu = (item) => {
    setMenuTarget(item.name);

    const menu = document.getElementById('mobile-menu');
    menu.classList.add('active');

    const folderOptions = document.getElementsByClassName('mobile-folder');
    const fileOptions = document.getElementsByClassName('mobile-file');

    if (item.isFolder) {
      for (let option of fileOptions) {
        if (!option.classList.contains('mobile-folder'))
          option.classList.add('hidden');
      }
      for (let option of folderOptions) {
        option.classList.remove('hidden');
      }
    } else {
      for (let option of fileOptions) {
        option.classList.remove('hidden');
      }
      for (let option of folderOptions) {
        if (!option.classList.contains('mobile-file'))
          option.classList.add('hidden');
      }
    }
  };

  return (
    <div
      className='grid-contents'
      onDoubleClick={
        item.isFolder === true
          ? () => selectFolder(item.id)
          : () => openFile(item.id)
      }
      onTouchEnd={(e) => {
        setDragging(false);

        if (!e.target.classList.contains('mobile')) {
          !dragging && item.isFolder === true
            ? selectFolder(item.id)
            : openFile(item.id);
        }
      }}
      onTouchMove={() => setDragging(true)}>
      <div
        tabIndex='0'
        className='fileList-wrapper__item unselectable fileName'
        onBlur={handleBlur}
        onClick={handleOnClick}
        onContextMenu={(e) => handleContextMenu(e)}>
        {item.isFolder === true ? (
          <i className='fa fa-folder icon'></i>
        ) : (
          <i className='fa fa-file icon'></i>
        )}
        <span className='text'>{item.name}</span>
      </div>
      <div
        className={'mobile-icon mobile'}
        onTouchEnd={() => handleMobileMenu(item)}>
        <i className='fa fa-info mobile'></i>
      </div>
      <div
        onClick={handleOnClick}
        className='fileList-wrapper__item timestamp'
        onDoubleClick={() => selectFolder(item.id)}>
        {item.timestamp}
      </div>
      <div
        onClick={handleOnClick}
        className='fileList-wrapper__item fileSize'
        onDoubleClick={() => selectFolder(item.id)}>
        {item.fileSize}
      </div>
    </div>
  );
};

export default ListItem;
