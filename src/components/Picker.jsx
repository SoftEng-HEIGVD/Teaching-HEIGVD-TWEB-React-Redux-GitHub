import React, { Component } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
export default class Picker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: props.options,
      newOption: '',
    };

    this.updateInputValue = this.updateInputValue.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
  }

  updateInputValue(e) {
    this.setState({
      options: this.state.options,
      newOption: e.target.value,
    });
  }

  handleAddClick(e) {
    e.preventDefault();

    this.setState({
      options: this.state.options.concat([this.state.newOption]),
      newOption: '',
    });
  }

  render() {
    const { value, onChange } = this.props;

    return (
      <span>
        Select a project: <select onChange={e => onChange(e.target.value)} value={value}>
          {this.state.options.map(option => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select> or add a new one (username/repository): <input
          type="text"
          onChange={this.updateInputValue}
          value={this.state.newOption}
        /> <button onClick={this.handleAddClick}>Add</button>
      </span>
    );
  }
}

Picker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
