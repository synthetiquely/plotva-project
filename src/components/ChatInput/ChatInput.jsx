import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from '../Icon/Icon';
import { setNewRoomName } from '../../store/actions/roomsActions';
import './ChatInput.css';

export class ChatInputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatName: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      chatName: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.setNewRoomName(this.state.chatName);
  }

  render() {
    const { chatName } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="search-input">
        <button
          className="no-button-button"
          type="submit"
          onClick={this.handleSubmit}
        >
          <Icon className="search-input__icon" type="header-add" />
        </button>
        <input
          className="search"
          type="text"
          value={chatName}
          placeholder="Придумайте уникальное имя для чата"
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export const ChatInput = connect(null, { setNewRoomName })(ChatInputComponent);
