import React from 'react';
import '../../styles/ProgressBar.scss';
import { useDB } from '../../contexts/DBContext';

const ProgressBar = () => {
  const { progress } = useDB();

  const showProgress = {
    display: progress.loading || progress.error ? 'flex' : 'none',
  };
  return (
    <div className='progress-bar-container' style={showProgress}>
      <div className='progress-bar-fileName'>
        {progress.completed ? (
          <i
            className='fas fa-check-circle'
            style={{ color: 'green', fontSize: '2rem' }}></i>
        ) : (
          progress.name
        )}
      </div>
      <div className='progress-bar'>
        <div
          style={{
            width: progress.percent,
            backgroundColor: progress.error ? 'red' : '#303f9f',
          }}
          className='inner-progress-bar'>
          {progress.percent}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
