const request = require('superagent');
const { username, token } = require('../github-credentials.json');

export const REQUEST_PULL_REQUESTS = 'REQUEST_PULL_REQUESTS';
export const RECEIVE_PULL_REQUESTS = 'RECEIVE_PULL_REQUESTS';
export const SELECT_REPOSITORY = 'SELECT_REPOSITORY';
export const INVALIDATE_REPOSITORY = 'INVALIDATE_REPOSITORY';
export const GENERATE_ERROR_MESSAGE = 'GENERATE_ERROR_MESSAGE';
export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

export function selectRepository(repository) {
  return {
    type: SELECT_REPOSITORY,
    repository,
  };
}

export function invalidateRepository(repository) {
  return {
    type: INVALIDATE_REPOSITORY,
    repository,
  };
}

export function generateErrorMessage(repository, error) {
  return {
    type: GENERATE_ERROR_MESSAGE,
    repository,
    error: error || 'Something bad happened.',
  };
}

// Resets the currently visible error message.
export function resetErrorMessage(repository) {
  return {
    type: RESET_ERROR_MESSAGE,
    repository,
  };
}

function requestPullRequests(repository) {
  return {
    type: REQUEST_PULL_REQUESTS,
    repository,
  };
}

function receivePullRequests(repository, jsonArray) {
  return {
    type: RECEIVE_PULL_REQUESTS,
    repository,
    pullRequests: jsonArray,
    receivedAt: Date.now(),
  };
}

function fetchPullRequests(repository, maximumNumberOfPages) {
  return (dispatch) => {
    dispatch(requestPullRequests(repository));

    const targetUrl = `https://api.github.com/repos/${repository}/pulls?state=all`;
    let pullRequests = [];

    function fetchPullRequestsPage(pageUrl, pageIndex) {
      console.log(`Fetching ${pageUrl}...`);

      return request
        .get(pageUrl)
        .auth(username, token)
        .set('Accept', 'application/vnd.github.v3+json')
        .on('error', (error) => {
          dispatch(generateErrorMessage(repository, error.message));
        })
        .then((success, failure) => {
          if (failure) {
            dispatch(generateErrorMessage(repository, failure));
          } else {
            pullRequests = pullRequests.concat(JSON.parse(success.text));

            if (pageIndex < maximumNumberOfPages - 1 && success.links.next) {
              fetchPullRequestsPage(success.links.next, pageIndex + 1);
            } else {
              dispatch(receivePullRequests(repository, pullRequests));
            }
          }
        });
    }

    fetchPullRequestsPage(targetUrl, 0);
  };
}

function shouldFetchPullRequests(state, repository) {
  const pullRequests = state.pullRequestsByRepository[repository];
  if (!pullRequests) {
    return true;
  } else if (pullRequests.isFetching) {
    return false;
  }
  return pullRequests.didInvalidate;
}

export function fetchPullRequestsIfNeeded(repository, maximumNumberOfPages = 10) {
  return (dispatch, getState) => {
    if (shouldFetchPullRequests(getState(), repository)) {
      return dispatch(fetchPullRequests(repository, maximumNumberOfPages));
    }

    return false;
  };
}
