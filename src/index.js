/* import configureStore from './store/configureStore';
import { fetchPullRequestsIfNeeded } from './actions/index';

const store = configureStore();

store
  .dispatch(fetchPullRequestsIfNeeded('facebook/react'))
  .then(() => store.dispatch(
    fetchPullRequestsIfNeeded('reactjs/redux'))
      .then(() => console.log(store.getState()))
  ); */

import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';

render(
  <Root />,
  document.getElementById('root'),
);
