import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Contact } from '../Contact/Contact';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import { Error } from '../Error/Error';
import { FETCH_CONTACTS_ERROR } from '../../errorCodes';
import { createRoom } from '../../store/actions/roomsActions';
import api from '../../api';

import './ContactsList.css';

class ContactsListComponent extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
    };
  }

  getChatId = contact => async e => {
    console.log('contact', contact);
    const currentUserId = this.props.user._id;
    const roomMembers = [currentUserId, contact._id].sort().toString();
    try {
      const rooms = await api.getRooms({ name: roomMembers });
      if (!rooms.count) {
        this.createRoomWithUser(roomMembers, contact._id, currentUserId);
      } else {
        this.props.history.push(`/chat/${rooms.items[0]._id}`);
      }
    } catch (err) {
      this.setState({ error: 'Произошла ошибка.' });
    }
  };

  createRoomWithUser = async (name, userId, currentUserId) => {
    try {
      const room = await api.createRoom({ name });
      await this.joinUserToRoom(userId, room._id);
      if (currentUserId !== userId) {
        room.users.push(userId);
      }
      this.props.createRoom(room);
      this.props.history.push(`/chat/${room._id}`);
    } catch (err) {
      this.setState({ error: 'Произошла при создании комнаты.' });
    }
  };

  joinUserToRoom = async (userId, roomId) => {
    try {
      await api.userJoinRoom(userId, roomId);
    } catch (err) {
      this.setState({ error: 'Произошла ошибка при создании комнаты.' });
    }
  };

  render() {
    const { error } = this.state;
    const { contacts, createChat, addToChat, search, user } = this.props;
    return (
      <React.Fragment>
        <SectionTitle title="Контакты" />
        <div className="contacts">
          {contacts.map((contact, index) => {
            const props = {};
            if (user) {
              props.onClick = createChat
                ? () => addToChat(index)
                : this.getChatId(contact);
            } else {
              props.link = `/chat/${contact._id}`;
            }
            if (contact.userName.toLowerCase().indexOf(search) + 1 > 0) {
              if (createChat && contact._id === user._id) {
                return null;
              }

              return (
                <Contact
                  key={index}
                  color={`${index}`}
                  {...props}
                  {...contact}
                />
              );
            }
            return null;
          })}
          {error ? <Error code={FETCH_CONTACTS_ERROR} /> : null}
        </div>
      </React.Fragment>
    );
  }
}

export const ContactsList = withRouter(
  connect(null, { createRoom })(ContactsListComponent),
);
