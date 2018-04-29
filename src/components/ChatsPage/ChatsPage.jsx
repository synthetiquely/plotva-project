import React, { PureComponent } from 'react';
import { Contacts } from '../Contacts/Contacts';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { NoResults } from '../NoResults/NoResults';
import { Error } from '../Error/Error';
import { FETCH_ROOMS_ERROR } from '../../errorCodes';
import api from '../../api';

export class ChatsPage extends PureComponent {
  constructor() {
    super();
    this.state = {
      rooms: [],
      next: null,
      error: null,
    };
    this.fetchNext = this.fetchNext.bind(this);
  }

  componentDidMount() {
    this.fetchNext(true);
  }

  async fetchNext(next = this.state.next) {
    try {
      if (next) {
        const response = await this.fetchRooms(next);
        this.setState(prevState => {
          return {
            rooms: [...prevState.rooms, ...response.rooms],
            next: response.next,
          };
        });
        return response;
      }
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  async fetchRooms(next) {
    const res = await api.getCurrentUserRooms(next);
    const rooms = await Promise.all(
      res.items.map(async room => {
        const messages = await api.getRoomMessages(room._id);
        let chatUser = await api.getUser(room.users[1]);
        let chatName = room.users.length > 2 ? room.name || 'Group chat' : chatUser.name;
        return {
          _id: room._id,
          userName: chatName,
          content: (messages.items[0] && messages.items[0].message) || 'No messages',
        };
      }),
    );
    return {
      rooms,
      next: res.next,
    };
  }

  render() {
    const { rooms, error } = this.state;
    if (!rooms.length && !error) {
      return <NoResults text="No chats here yet..." />;
    }

    return (
      <InfiniteScroller hasMore={!!this.next} loadMore={this.fetchNext}>
        <Contacts contacts={rooms} search="" />
        {error ? <Error code={FETCH_ROOMS_ERROR} /> : null}
      </InfiniteScroller>
    );
  }
}
