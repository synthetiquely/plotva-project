import React, { PureComponent } from 'react';
import { Contacts } from '../Contacts/Contacts';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { Spinner } from '../Spinner/Spinner';
import { NoResults } from '../NoResults/NoResults';
import { Error } from '../Error/Error';
import { FETCH_ROOMS_ERROR } from '../../errorCodes';
import api from '../../api';

export class ChatsPage extends PureComponent {
  constructor() {
    super();
    this.state = {
      isLoading: false,
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
      this.setState({
        isLoading: true,
      });
      if (next) {
        const response = await this.fetchRooms(next);
        this.setState(prevState => {
          return {
            rooms: [...prevState.rooms, ...response.rooms],
            next: response.next,
            isLoading: false,
          };
        });
        return response;
      }
    } catch (error) {
      this.setState({
        error,
        isLoading: false,
      });
    }
  }

  async fetchRooms(next) {
    const res = await api.getCurrentUserRooms(next);
    const rooms = await Promise.all(
      res.items.map(async room => {
        const messages = await api.getRoomMessages(room._id);
        let chatUser = await api.getUser(room.users[1]);
        let chatName = room.users.length > 2 ? room.name || 'Групповой чат' : chatUser.name;
        return {
          _id: room._id,
          userName: chatName,
          content: (messages.items[0] && messages.items[0].message) || 'Нет сообщений',
        };
      }),
    );
    return {
      rooms,
      next: res.next,
    };
  }

  render() {
    const { next, rooms, isLoading, error } = this.state;
    if (!rooms.length && !isLoading) {
      return <NoResults text="Нет активных чатов..." />;
    }

    if (isLoading) {
      return <Spinner />;
    }
    return (
      <InfiniteScroller hasResults={!!rooms.length} hasMore={!!next} loadMore={this.fetchNext}>
        <Contacts contacts={rooms} search="" />
        {error ? <Error code={FETCH_ROOMS_ERROR} /> : null}
      </InfiniteScroller>
    );
  }
}
