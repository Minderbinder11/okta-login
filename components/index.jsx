// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import LoginPage from './loginPage.jsx';
import HomePage from './homePage.jsx';

ReactDOM.render(
	<BrowserRouter>
    <div>
      <Route exact path="/" component={LoginPage} />
      <Route path='/api' component={HomePage} />
    </div>
  </BrowserRouter>
, document.getElementById('root'));