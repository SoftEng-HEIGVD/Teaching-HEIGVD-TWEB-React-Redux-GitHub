import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectRepository,
  fetchPullRequestsIfNeeded,
  invalidateRepository,
  resetErrorMessage,
} from '../actions';
import Picker from '../components/Picker';
import PullRequests from '../components/PullRequests';

class AsyncApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      maximumNumberOfPages: 1,
    };

    this.handlePickerChange = this.handlePickerChange.bind(this);
    this.handleInputNumberPagesChange = this.handleInputNumberPagesChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
    this.handleDismissClick = this.handleDismissClick.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedRepository } = this.props;
    dispatch(fetchPullRequestsIfNeeded(selectedRepository, this.state.maximumNumberOfPages));
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedRepository !== prevProps.selectedRepository) {
      const { dispatch, selectedRepository } = this.props;
      dispatch(fetchPullRequestsIfNeeded(selectedRepository, this.state.maximumNumberOfPages));
    }
  }

  handlePickerChange(nextRepository) {
    this.props.dispatch(selectRepository(nextRepository));
    this.props.dispatch(fetchPullRequestsIfNeeded(nextRepository, this.state.maximumNumberOfPages));
  }

  handleInputNumberPagesChange(event) {
    this.setState({ maximumNumberOfPages: event.target.value });
  }

  handleRefreshClick(e) {
    e.preventDefault();

    const { dispatch, selectedRepository } = this.props;
    dispatch(invalidateRepository(selectedRepository));
    dispatch(fetchPullRequestsIfNeeded(selectedRepository, this.state.maximumNumberOfPages));
  }

  handleDismissClick(e) {
    e.preventDefault();

    const { dispatch, selectedRepository } = this.props;
    dispatch(resetErrorMessage(selectedRepository));
  }

  renderErrorMessage() {
    if (!this.props.error) {
      return null;
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{this.props.error}</b>
        {' '}
        <button onClick={this.handleDismissClick}>
          Dismiss
        </button>
      </p>
    );
  }

  render() {
    const { selectedRepository, pullRequests, isFetching, lastUpdated } = this.props;

    return (
      <div className="center-div">
        <h1>GitHub Pull Requests Analyzer</h1>
        <Picker
          value={selectedRepository}
          onChange={this.handlePickerChange}
          options={['reactjs/redux', 'facebook/react']}
        />
        <p>
          Maximum number of pages:
          <input
            type="number"
            onChange={this.handleInputNumberPagesChange}
            value={this.state.maximumNumberOfPages}
          />
        </p>
        <p className="lastUpdatedElements">
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>}
          {!isFetching &&
            <button onClick={this.handleRefreshClick}>
              Refresh
            </button>}
        </p>
        {this.renderErrorMessage()}
        {isFetching && pullRequests.length === 0 && <h2>Loading...</h2>}
        {!isFetching && pullRequests.length === 0 && <h2>Empty.</h2>}
        {pullRequests.length > 0 &&
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <PullRequests pullRequests={pullRequests} />
          </div>}
      </div>
    );
  }
}

AsyncApp.propTypes = {
  selectedRepository: PropTypes.string.isRequired,
  pullRequests: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
};

AsyncApp.defaultProps = {
  lastUpdated: Date.now(),
};

function mapStateToProps(state) {
  const { selectedRepository, pullRequestsByRepository } = state;
  const {
    isFetching,
    lastUpdated,
    items: pullRequests,
    error,
  } = pullRequestsByRepository[selectedRepository] || {
    isFetching: true,
    items: [],
    error: '',
  };

  return {
    selectedRepository,
    pullRequests,
    isFetching,
    lastUpdated,
    error,
  };
}

export default connect(mapStateToProps)(AsyncApp);
