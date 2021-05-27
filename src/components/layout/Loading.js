import React from 'react';
import '../../styles/App.scss';

const Loading = () => {
  return (
    <div className={'loading'}>
      <div className='loading__icon-wrapper'>
        <i className='fas fa-spinner fa-4x' id='spinner'></i>
      </div>
    </div>
  );
};

export default Loading;
