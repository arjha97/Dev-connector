import React, { Fragment, useEffect } from "react"
import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from "./components/layouts/Landing";
import Navbar from "./components/layouts/Navbar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from './components/layouts/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';
import PrivateRoute from './components/routing/PrivateRoute';

//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import { addEducation } from "./actions/profile";

if(localStorage.token){
  setAuthToken(localStorage.token); 
}


const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
   <Provider store={store}> 
    <Router>
      <Fragment>
        <Navbar/>
        <Route exact path='/' component={Landing} />
        <section className="container">
          <Alert />
           <Switch>
             <Route exact path='/register' component={Register} />
             <Route exact path='/login' component={Login} />
             <Route exact path='/profiles' component={Profiles} />
             <Route exact path='/profile/:id' component={Profile} />
             <PrivateRoute exact path='/dashboard' component={Dashboard} />
             <PrivateRoute exact path='/create-profile' component={CreateProfile} />
             <PrivateRoute exact path='/edit-profile' component={EditProfile} />
             <PrivateRoute exact path='/add-experience' component={AddExperience} />
             <PrivateRoute exact path='/add-education' component={AddEducation} />
             <PrivateRoute exact path='/posts' component={Posts} />
           </Switch>
        </section>
      </Fragment>
    </Router> 
   </Provider> 
  );
}

export default App;
