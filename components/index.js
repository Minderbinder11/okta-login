// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

ReactDOM.render(
  <Router history = {browserHistory}>
    <Route path='/' component={Web}></Route>
  </Router>
, document.getElementById('root'));