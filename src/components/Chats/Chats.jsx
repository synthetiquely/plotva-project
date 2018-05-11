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
    if (this.props.currentUser) {
      const { rooms } = this.props;
      if (rooms && rooms.length) {
        return;
      } else {
        this.fetchNext();
      }
    }
  }

  static getDerivedStateFromProps(nextProps) {
    const { rooms, messages } = nextProps;
    if (rooms && rooms.length) {
      const transformedRooms = rooms.map(room => {
        const lastMessage =
          messages[room._id] &&
          messages[room._id].messages &&
          messages[room._id].messages[messages[room._id].messages.length - 1];

        if (lastMessage) {
          return {
            _id: room._id,
            userName: room.userName,
            content: (lastMessage && lastMessage.text) || 'Нет сообщений',
            contentType: 'room',
            isRead: lastMessage.isMy ? true : lastMessage.isRead,
            avatar: room.avatar,
          };
        } else {
          return {
            _id: room._id,
            userName: room.userName,
            content: 'Нет сообщений',
            contentType: 'room',
            isRead: true,
            avatar: room.avatar,
          };
        }
      });

      return {
        rooms: transformedRooms,
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
      console.log('error', error);
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
      <InfiniteScroller
        hasResults={!!rooms.length}
        hasMore={!!next}
        loadMore={this.fetchNext}
      >
        <ContactsList contacts={rooms} search="" />
        {error ? <Error code={FETCH_ROOMS_ERROR} /> : null}
      </InfiniteScroller>
    );
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms.rooms,
  messages: state.messages,
  currentUser: state.user.user,
});

export const Chats = connect(mapStateToProps, { fetchRooms })(ChatsComponent);
