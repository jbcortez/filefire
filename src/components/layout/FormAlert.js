import React from 'react';
import { makeStyles } from '@material-ui/styles';
import MUIAlert from '@material-ui/lab/Alert';
import { styles } from '../../styles/Styles';
import { useDB } from '../../contexts/DBContext';

const FormAlert = () => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const { alertType, alertMsg } = useDB();

  return (
    <div className={classes.alert}>
      <MUIAlert variant={'outlined'} severity={alertType}>
        {alertMsg}
      </MUIAlert>
    </div>
  );
};

export default FormAlert;
