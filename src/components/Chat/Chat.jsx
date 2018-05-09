import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { MessagesList } from '../MessagesList/MessagesList';
import {
  fetchMessagesForFirstTime,
  fetchMessages,
  selectMessage,
  readMessages,
} from '../../store/actions/messagesActions';
import { Spinner } from '../Spinner/Spinner';
import { Error } from '../Error/Error';
import { NoResults } from '../NoResults/NoResults';
import { FETCH_MESSAGES_ERROR } from '../../errorCodes';

class ChatComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      error: null,
    };
    this.fetchNext = this.fetchNext.bind(this);
    this.handleSelectMessage = this.handleSelectMessage.bind(this);
    this.setRefToBottomLine = this.setRefToBottomLine.bind(this);
    this.onScrollToBottom = this.onScrollToBottom.bind(this);
  }

  componentDidMount() {
    this.fetchMessages();
  }

  componentDidUpdate(prevProps) {
    const { messages, match } = prevProps;
    if (match.params.id !== this.props.match.params.id) {
      this.onScrollToBottom();
    } else if (
      messages[prevProps.match.params.id].messages.length <
      this.props.messages[this.props.match.params.id].messages.length
    ) {
      this.onScrollToBottom();
    }
  }

  static getDerivedStateFromProps(nextProps) {
    const { messages, match } = nextProps;
    if (
      messages[match.params.id] &&
      messages[match.params.id].messages.length
    ) {
      const notReadMessages = messages[match.params.id].messages.filter(
        message => !message.isRead && !message.isMy,
      );

      if (notReadMessages.length) {
        nextProps.readMessages(match.params.id);
      }
    }

    return null;
  }

  async fetchMessages() {
    try {
      this.setState({
        isLoading: true,
      });
      await this.props.fetchMessagesForFirstTime(this.props.match.params.id);
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

  async fetchNext() {
    try {
      await this.props.fetchMessages(this.props.match.params.id);
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  handleSelectMessage(message) {
    const { selectedMessage } = this.props.messages;
    return () => {
      if (selectedMessage && selectedMessage.id === message.id) {
        this.props.selectMessage(null);
      } else {
        this.props.selectMessage(message);
      }
    };
  }

  setRefToBottomLine(node) {
    this.el = node;
  }

  onScrollToBottom() {
    if (this.el) {
      this.el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  render() {
    const { isLoading, error } = this.state;
    const { messages, match } = this.props;

    if (!messages[match.params.id] && !error) {
      return <NoResults text="No messages here yet..." />;
    }

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <InfiniteScroller reverse loadMore={this.fetchNext}>
        {messages[match.params.id] ? (
          <React.Fragment>
            <MessagesList
              handleSelectMessage={this.handleSelectMessage}
              selectedMessage={messages.selectedMessage}
              messages={messages[match.params.id].messages}
            />
            <div ref={this.setRefToBottomLine} />
          </React.Fragment>
        ) : null}
        {error ? <Error code={FETCH_MESSAGES_ERROR} /> : null}
      </InfiniteScroller>
    );
  }
}

const stateToProps = state => ({
  user: state.user.user,
  messages: state.messages,
});

export const Chat = withRouter(
  connect(stateToProps, {
    fetchMessagesForFirstTime,
    fetchMessages,
    selectMessage,
    readMessages,
  })(ChatComponent),
);
