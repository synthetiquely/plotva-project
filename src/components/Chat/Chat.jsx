import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { MessagesList } from '../MessagesList/MessagesList';
import { fetchMessages, selectMessage } from '../../store/actions/messagesActions';
import { Error } from '../Error/Error';
import { NoResults } from '../NoResults/NoResults';
import { FETCH_MESSAGES_ERROR } from '../../errorCodes';

class ChatComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      error: null,
    };
    this.fetchNext = this.fetchNext.bind(this);
    this.handleSelectMessage = this.handleSelectMessage.bind(this);
  }

  componentDidMount() {
    this.fetchNext();
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
    return () => {
      if (this.props.messages.selectedMessage && this.props.messages.selectedMessage.id === message.id) {
        this.props.selectMessage(null);
      } else {
        this.props.selectMessage(message);
      }
    };
  }

  render() {
    const { error } = this.state;
    const { messages, match } = this.props;

    if (!messages[match.params.id] && !error) {
      return <NoResults text="No messages here yet..." />;
    }

    return (
      <InfiniteScroller loadMore={this.fetchNext}>
        {messages[match.params.id] ? (
          <MessagesList
            handleSelectMessage={this.handleSelectMessage}
            selectedMessage={messages.selectedMessage}
            messages={messages[match.params.id].messages}
          />
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

export const Chat = withRouter(connect(stateToProps, { fetchMessages, selectMessage })(ChatComponent));
