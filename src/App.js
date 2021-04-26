import './styles/App.scss';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import Navbar from './layout/Navbar';
import Dashboard from './pages/Dashboard';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Fragment } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PrivateRoute from '../routes/PrivateRoute';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

const App = () => {
  const { currentUser } = useAuth();

  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Fragment>
        <Switch>
          <Route exact path='/'>
            {currentUser ? <Redirect to='/dashboard' /> : <Login />}
          </Route>
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={SignUp} />
          <Route exact path='/forgotpassword' component={ForgotPassword} />
          <PrivateRoute exact path='/profile' component={Profile} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
        </Switch>
      </Fragment>
    </Router>
  );
};

export default App;
