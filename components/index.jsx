// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom'
import LoginPage from './loginPage.jsx';

ReactDOM.render(
	<BrowserRouter>
      <Route exact path="/" component={LoginPage}/>
  </BrowserRouter>
, document.getElementById('root'));