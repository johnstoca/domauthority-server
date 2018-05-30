import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import 'promise-polyfill';

import 'foundation-sites/dist/css/foundation.min.css'
import 'pnotify/dist/PNotifyBrightTheme.css'

import './App.css';

import Layout from '../Layout/Layout';

import CurrentUser from '../../contexts/User';

import $ from 'jquery';
window.$ = window.jQuery = $;
require('foundation-sites');

class App extends Component {
  render() {
    return (
      <CurrentUser.Provider value={{name: "Name", username: "myUsername"}}>
        <Router>
          <Route to='/' component={Layout} />
        </Router>
      </CurrentUser.Provider>
    );
  }
}

export default App;
