// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from './homePage.jsx';
import AdminPage from './adminPage.jsx';
import LoginPage from './loginPage.jsx';
import CreateUser from './createUser.jsx';
import UpdateUser from './updateUser.jsx';
import { BrowserRouter, Route, Link } from 'react-router-dom';


ReactDOM.render(
	<BrowserRouter>
    <div>
      <Route exact path="/" component={LoginPage} />
      <Route path='/api' component={HomePage} />
      <Route path='/admin' component={AdminPage} />
      <Route path='/createUser' component={CreateUser} />
      <Route path='/updateUser/:userId' component={UpdateUser} />

    </div>
  </BrowserRouter>
, document.getElementById('root'));