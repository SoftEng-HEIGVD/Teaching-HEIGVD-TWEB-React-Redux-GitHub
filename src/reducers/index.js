import { combineReducers } from 'redux';
import {
  SELECT_REPOSITORY,
  INVALIDATE_REPOSITORY,
  REQUEST_PULL_REQUESTS,
  RECEIVE_PULL_REQUESTS,
  GENERATE_ERROR_MESSAGE,
  RESET_ERROR_MESSAGE,
} from '../actions/index';

function selectedRepository(state = 'reactjs/redux', action) {
  switch (action.type) {
    case SELECT_REPOSITORY:
      return action.repository;
    default:
      return state;
  }
}

function pullRequests(
  state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
  },
  action,
) {
  switch (action.type) {
    case INVALIDATE_REPOSITORY:
      return Object.assign({}, state, {
        didInvalidate: true,
        error: '',
      });
    case REQUEST_PULL_REQUESTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
        error: '',
      });
    case RECEIVE_PULL_REQUESTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.pullRequests,
        lastUpdated: action.receivedAt,
        error: '',
      });
    case GENERATE_ERROR_MESSAGE:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error,
      });
    case RESET_ERROR_MESSAGE:
      return Object.assign({}, state, {
        error: '',
      });
    default:
      return state;
  }
}

function pullRequestsByRepository(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_REPOSITORY:
    case RECEIVE_PULL_REQUESTS:
    case REQUEST_PULL_REQUESTS:
    case GENERATE_ERROR_MESSAGE:
    case RESET_ERROR_MESSAGE:
      return Object.assign({}, state, {
        [action.repository]: pullRequests(state[action.repository], action),
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  pullRequestsByRepository,
  selectedRepository,
});

export default rootReducer;
