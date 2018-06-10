import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Settings from 'components/Settings/Settings';
import Home from 'components/Home/Home';
import AuthenticationProgress from 'components/AuthenticationProgress/AuthenticationProgress';

import AuthenticationToken from 'helpers/AuthenticationToken';

import CurrentUserContext from 'contexts/CurrentUserContext';

const VALID_CURRENT_USER_DATA = {
  uid: 1,
  name: 'name',
  username: 'username',
  accessToken: 'blah',
  client: 'blah',
};

describe('protected', () => {
  var component;
  var history;
  var createComponent = (options) => {
    var defaultOptions = {
      props: {},
      authenticated: false,
      protectedComponent: false,
    };
    options = Object.assign(defaultOptions, options);

    if (component) {
      component.unmount();
    }

    var currentUserData = {};
    if (options.authenticated) {
      currentUserData = VALID_CURRENT_USER_DATA;
    } else {
      Object.entries(VALID_CURRENT_USER_DATA).forEach(([key, value]) => {
        currentUserData[key] = null;
      });
    }
    var currentUser = {
      currentUser: currentUserData,
      setCurrentUser: null,
      clearCurrentUser: null,
    };

    if (options.protectedComponent) {
      component = mount(
        <Router>
          <CurrentUserContext.Provider value={currentUser}>
            <Settings {...options.props} isAuthenticated={options.authenticated} />
          </CurrentUserContext.Provider>
        </Router>
      );
    } else {
      component = mount(
        <Router>
          <CurrentUserContext.Provider value={currentUser}>
            <Home {...options.props} isAuthenticated={options.authenticated} />
          </CurrentUserContext.Provider>
        </Router>
      );
    }
  };

  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('protected component restricts route to authenticated users', () => {
    // not authenticated
    createComponent({
      authenticated: false,
      protectedComponent: true,
    });
    expect(component.find(AuthenticationProgress)).toHaveLength(1);

    createComponent({
      authenticated: false,
      protectedComponent: false,
    });
    expect(component.find(AuthenticationProgress)).toHaveLength(0);

    // authenticated
    createComponent({
      authenticated: true,
      protectedComponent: true,
    });
    expect(component.find(AuthenticationProgress)).toHaveLength(0);

    createComponent({
      authenticated: true,
      protectedComponent: false,
    });
    expect(component.find(AuthenticationProgress)).toHaveLength(0);
  });
});