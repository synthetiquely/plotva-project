import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ContactsList } from '../ContactsList/ContactsList';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { Spinner } from '../Spinner/Spinner';
import { NoResults } from '../NoResults/NoResults';
import { Error } from '../Error/Error';
import { FETCH_ROOMS_ERROR } from '../../errorCodes';
import { fetchRooms } from '../../store/actions/roomsActions';

export class ChatsComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      rooms: [],
      isLoading: false,
      error: null,
    };
    this.fetchNext = this.fetchNext.bind(this);
  }

  componentDidMount() {
    this.fetchNext();
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.rooms && nextProps.rooms.length) {
      const rooms = nextProps.rooms.map(room => {
        const lastMessage =
          nextProps.messages[room.id] &&
          nextProps.messages[room.id].messages &&
          nextProps.messages[room.id].messages[nextProps.messages[room.id].messages.length - 1];
        return {
          _id: room._id,
          userName: room.userName,
          content: (lastMessage && lastMessage.message) || 'Нет сообщений',
        };
      });

      return {
        rooms,
      };
    }

    return null;
  }

  async fetchNext() {
    try {
      this.setState({
        isLoading: true,
      });
      await this.props.fetchRooms();
      this.setState({
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error,
        isLoading: false,
      });
    }
  }

  render() {
    const { next, rooms, isLoading, error } = this.state;
    if (!rooms.length && !isLoading && !error) {
      return <NoResults text="Нет активных чатов..." />;
    }

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <InfiniteScroller hasResults={!!rooms.length} hasMore={!!next} loadMore={this.fetchNext}>
        <ContactsList contacts={rooms} search="" />
        {error ? <Error code={FETCH_ROOMS_ERROR} /> : null}
      </InfiniteScroller>
    );
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms.rooms,
  messages: state.messages,
});

export const Chats = connect(mapStateToProps, { fetchRooms })(ChatsComponent);
