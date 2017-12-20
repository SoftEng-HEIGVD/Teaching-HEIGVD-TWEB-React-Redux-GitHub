import React, { Component } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
export default class Picker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: props.options,
      selected: props.value,
      newOption: '',
    };

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
  }

  handleSelectChange(e) {
    this.setState({
      options: this.state.options,
      selected: e.target.value,
      newOption: '',
    });

    this.props.onChange(e.target.value);
  }

  updateInputValue(e) {
    this.setState({
      options: this.state.options,
      selected: this.state.selected,
      newOption: e.target.value,
    });
  }

  handleInputKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleAddClick(e);
    }
  }

  handleAddClick(e) {
    e.preventDefault();

    if (this.state.newOption) {
      this.setState({
        options: this.state.options.concat([this.state.newOption]),
        selected: this.state.newOption,
        newOption: '',
      });

      this.props.onChange(this.state.newOption);
    }
  }

  render() {
    return (
      <span>
        Select a project:
        <select onChange={this.handleSelectChange} value={this.state.selected}>
          {this.state.options.map(option => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
        or add a new one (username/repository):
        <input
          type="text"
          onChange={this.updateInputValue}
          onKeyPress={this.handleInputKeyPress}
          value={this.state.newOption}
        />
        <button onClick={this.handleAddClick}>Add</button>
      </span>
    );
  }
}

Picker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
