import React, { Component } from 'react';
import { Notification } from 'react-notification';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Link, withRouter } from 'react-router-dom';
import { Icon } from '../Icon/Icon';
import { SearchInput } from '../SearchInput/SearchInput';
import { HeaderTitle } from '../HeaderTitle/HeaderTitle';
import { HeaderBtn } from '../HeaderBtn/HeaderBtn';
import { Avatar } from '../Avatar/Avatar';
import './Header.css';
import chatApi from '../../api/chat';
import { setSelectedUsers, setUsers } from '../../store/actions/userActions';
import { setNewRoomName, createRoom } from '../../store/actions/roomsActions';
import { requestMessageRemoval } from '../../store/actions/messagesActions';

import { connect } from 'react-redux';

class HeaderComponent extends Component {
  state = {
    isActive: false,
    error: null,
  };

  newChat = async () => {
    const { user, selectedUsers } = this.props;
    try {
      const rooms = await chatApi.getRooms({
        name: this.props.newRoomChatName,
      });
      if (!rooms.count) {
        selectedUsers.push(user);
        await this.createRoomWithUsers(
          this.props.newRoomChatName,
          selectedUsers,
          user,
        );

        const users = [].concat(this.props.users);
        users.forEach(user => {
          user.checked = false;
        });
        this.props.dispatch(setUsers(users));
        this.props.dispatch(setSelectedUsers([]));
        this.props.dispatch(setNewRoomName(''));
      }
    } catch (err) {
      this.setState({
        error:
          'Произошла неизвестная ошибка. Попробуйте перезагрузить страницу.',
      });
    }
  };

  removeMessage = async () => {
    try {
      this.props.dispatch(
        requestMessageRemoval(this.props.roomId, this.props.selectedMessage.id),
      );
    } catch (err) {
      this.setState({
        error: 'Произошла ошибка при попытке удалить сообщение.',
      });
    }
  };

  createRoomWithUsers = async (name, users, currentUser) => {
    try {
      if (users.length <= 2) {
        throw new Error('Выделите более двух контактов');
      } else {
        const room = await chatApi.createRoom({ name });
        await Promise.all(
          users.map(user => this.joinUserToRoom(user._id, room._id)),
        );
        const usersToAppend = users
          .filter(user => user._id !== currentUser._id)
          .map(user => user._id);
        room.users.push(...usersToAppend);

        this.props.dispatch(createRoom(room));
        this.props.history.push('/chats');
      }
    } catch (err) {
      this.setState({
        error: 'Выделите более двух контактов',
      });
    }
  };

  joinUserToRoom = async (userId, roomId) => {
    try {
      await chatApi.userJoinRoom(userId, roomId);
    } catch (err) {
      this.setState({
        error: 'Произошла ошибка при добавлении пользователя в комнату.',
      });
    }
  };

  toggleNotification = () => {
    this.setState(prevState => {
      return {
        isActive: !prevState.isActive,
      };
    });
  };

  render() {
    const { isActive, error } = this.state;
    let {
      title,
      subtitle,
      avatar,
      selectedMessage,
      type = 'chats',
    } = this.props;
    let size = subtitle ? 'lg' : 'sm';

    return (
      <div className={`header header_${size}`}>
        <div className="header__left">
          {type === 'search' && <SearchInput />}
          {type === 'dialog' && (
            <HeaderBtn
              onClick={this.props.history.goBack}
              type="back"
              txt="Назад"
            />
          )}
        </div>
        {title && (
          <div className="header__center">
            <HeaderTitle title={title} subtitle={subtitle} />
          </div>
        )}
        <div className="header__right">
          {type === 'contacts' &&
            (this.props.createChat ? (
              <Icon type="header-add" onClick={this.newChat} />
            ) : (
              <Link to="/create_chat">
                <Icon type="header-add" />
              </Link>
            ))}
          {type === 'chats' && (
            <Link to="/create_chat">
              <Icon type="header-add" onClick={this.newChat} />
            </Link>
          )}
          {type === 'search' && (
            <Link to="/contacts">
              <Header type="action" txt="Отменить" />
            </Link>
          )}
          {type === 'dialog' &&
            !selectedMessage && (
              <Avatar avatar={avatar} color="4" defaultName="C" size="xsmall" />
            )}
          {type === 'dialog' &&
            selectedMessage && (
              <div className="header__right__actions">
                <CopyToClipboard
                  text={selectedMessage.text}
                  onCopy={this.toggleNotification}
                >
                  <button className="button-icon" title="Copy message">
                    <Icon type="copy" />
                  </button>
                </CopyToClipboard>
                <button
                  onClick={this.removeMessage}
                  className="button-icon"
                  title="Remove message"
                >
                  <Icon type="remove" />
                </button>
                <Avatar
                  avatar={avatar}
                  color="4"
                  defaultName="C"
                  size="xsmall"
                />
              </div>
            )}
        </div>
        {error && (
          <Notification
            isActive={error}
            message={error}
            dismissAfter={2000}
            onDismiss={() => this.setState({ error: null })}
          />
        )}
        <Notification
          isActive={isActive}
          message={'Скопировано!'}
          dismissAfter={2000}
          onDismiss={this.toggleNotification}
        />
      </div>
    );
  }
}

const stateToProps = state => ({
  selectedUsers: state.user.selectedUsers,
  newRoomChatName: state.rooms.newRoomName,
  user: state.user.user,
  users: state.user.users,
  selectedMessage: state.messages.selectedMessage,
});

export const Header = connect(stateToProps)(withRouter(HeaderComponent));
