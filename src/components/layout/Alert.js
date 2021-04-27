import React from 'react';
import { makeStyles } from '@material-ui/styles';
import MUIAlert from '@material-ui/lab/Alert';
import { styles } from '../../styles/Styles';
import '../../styles/Alert.scss';
import { useDB } from '../../contexts/DBContext';

const Alert = ({ formAlert }) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const { alertType, alertMsg } = useDB();

  return (
    <div className={classes.alert} id={!formAlert && 'alert'}>
      <MUIAlert variant={'filled'} severity={alertType}>
        {alertMsg}
      </MUIAlert>
    </div>
  );
};

export default Alert;
