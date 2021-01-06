import React, { Fragment } from "react"
import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from "./components/layouts/Landing";
import Navbar from "./components/layouts/Navbar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

//Redux
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
   <Provider store={store}> 
    <Router>
      <Fragment>
        <Navbar/>
        <Route exact path='/' component={Landing} />
        <section className="container">
           <Switch>
             <Route exact path="/register" component={Register} />
             <Route exact path="/login" component={Login} />
           </Switch>
        </section>
      </Fragment>
    </Router> 
   </Provider> 
  );
}

export default App;
