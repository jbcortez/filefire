export const styles = (theme) => ({
  formContainer: {
    maxWidth: '40rem',
    marginTop: '4rem',
    textAlign: 'center',
    border: '1px solid rgb(231, 231, 231)',
    padding: '3rem',
    borderRadius: 5,
    boxShadow: '0 2px 1px rgba(0,0,0,0.2)',
    backgroundColor: 'rgb(241, 241, 241)',
    '& h2': {
      marginBottom: '2rem',
    },
    [theme.breakpoints.down('sm')]: {
      backgroundColor: 'rgba(0,0,0,0)',
      boxShadow: '0 0 0 #FFF',
      border: 'none',
      marginBottom: '-2rem',
      marginTop: '2rem',
    },
  },
  form: {
    '& > :not(:last-child)': { marginBottom: '1.5rem' },
  },
  inputField: {
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    minWidth: '50rem',
    backgroundColor: '#FFF',
    boxShadow: '0 2px 1px rgba(0,0,0,0.2)',
    padding: '3rem',
    border: '1px solid rgb(231, 231, 231)',
    borderRadius: 5,
    outline: 'none',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.up('md')]: {
      minWidth: '50rem',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '90vw',
    },
  },
  alert: {
    marginBottom: '1.5rem',
  },
  googleButton: {
    '& i': {
      marginRight: '1rem',
    },
    marginTop: '1.5rem',
  },
});
