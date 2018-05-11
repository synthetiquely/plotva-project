import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from '../Layout/Layout';
import { Header } from '../Header/Header';
import { Chat } from '../Chat/Chat';
import { ChatForm } from '../ChatForm/ChatForm';
import chatApi from '../../api/chat';

export class ConversationPageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: null,
      title: '',
      subtitle: '',
      avatar: '',
      personalChat: false,
    };
  }

  componentDidMount() {
    this.joinRoom();
  }

  async joinRoom() {
    try {
      await chatApi.currentUserJoinRoom(this.props.match.params.id);
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.rooms.length) {
      const room = nextProps.rooms.find(
        room => room._id === nextProps.match.params.id,
      );
      if (room) {
        if (room.users && room.users.length >= 2) {
          return {
            roomId: room._id,
            title: room.userName,
            subtitle: room.status,
            avatar: room.avatar,
          };
        } else if (room.users && room.users.length === 1) {
          return {
            roomId: room._id,
            title: room.userName,
            subtitle: room.status,
            avatar: room.avatar,
            personalChat: true,
          };
        } else {
          return null;
        }
      }
    }

    return null;
  }

  async getOnlineStatus() {}

  render() {
    const { roomId, personalChat, title, subtitle, avatar } = this.state;
    return (
      <Layout
        header={
          <Header
            type="dialog"
            title={title || 'Загружаем...'}
            subtitle={subtitle || 'Загружаем...'}
            avatar={avatar}
            roomId={roomId}
          />
        }
        content={<Chat personalChat={personalChat} />}
        footer={<ChatForm />}
      />
    );
  }
}

const stateToProps = state => ({
  rooms: state.rooms.rooms,
});

export const ConversationPage = connect(stateToProps)(
  ConversationPageComponent,
);
