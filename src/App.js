import React, { createContext, useEffect } from 'react';
import 'reset-css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import '~~styles/style.scss';

import Main from '~~containers/Main';
import Store from '~~src/Store';

function App() {
  return (
    <Store>
      <Router>
        <Switch>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </Router>
    </Store>
  );
}

export default App;
