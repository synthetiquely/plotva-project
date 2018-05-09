import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { InputBar } from '../InputBar/InputBar';
import { sendMessage } from '../../store/actions/messagesActions';

class ChatFormComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      messageText: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.sendMessage(this.props.match.params.id, this.state.messageText);
    this.setState({
      messageText: '',
    });
  }

  handleChange(e) {
    this.setState({
      messageText: e.target.value,
    });
  }

  render() {
    const { messageText } = this.state;
    return (
      <InputBar
        value={messageText}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export const ChatForm = withRouter(
  connect(null, { sendMessage })(ChatFormComponent),
);
