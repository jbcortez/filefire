import '../styles/App.scss';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Account from './pages/Account';
import ForgotPassword from './pages/ForgotPassword';
import Navbar from './layout/Navbar';
import Dashboard from './pages/Dashboard';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { Fragment } from 'react';
import PrivateRoute from '../routes/PrivateRoute';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
  const theme = createMuiTheme({
    typography: {
      htmlFontSize: 10,
    },
  });

  return (
    <Router>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Navbar />
        <Fragment>
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/forgotpassword' component={ForgotPassword} />
            <PrivateRoute exact path='/account' component={Account} />
            <PrivateRoute exact path='/' component={Dashboard} />
          </Switch>
        </Fragment>
      </ThemeProvider>
    </Router>
  );
};

export default App;
