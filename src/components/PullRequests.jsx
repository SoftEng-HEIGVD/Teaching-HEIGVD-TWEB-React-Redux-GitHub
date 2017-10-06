import React, { Component } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
export default class pullRequests extends Component {
  render() {
    return (
      <ol>
        {this.props.pullRequests.map((pullRequest, i) => (
          <li key={i}>
            <strong>{pullRequest.user.login}</strong>
             - <a href={pullRequest.html_url}>{pullRequest.title}</a>
          </li>
        ))}
      </ol>
    );
  }
}

pullRequests.propTypes = {
  pullRequests: PropTypes.array.isRequired,
};
