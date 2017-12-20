import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
export default class pullRequests extends Component {
  render() {
    return (
      <Tabs>
        <TabList>
          <Tab>Pull Requests</Tab>
          <Tab>Charts</Tab>
        </TabList>

        <TabPanel>
          <ol>
            {this.props.pullRequests.map(pullRequest => (
              <li key={pullRequest.id}>
                {pullRequest.user.login} - <a href={pullRequest.html_url}>{pullRequest.title}</a>
              </li>
            ))}
          </ol>
        </TabPanel>
        <TabPanel>
          <h2>What do we say to the god of procrastination? Not today!</h2>
        </TabPanel>
      </Tabs>
    );
  }
}

pullRequests.propTypes = {
  pullRequests: PropTypes.array.isRequired,
};
