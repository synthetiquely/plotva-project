import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { ContactsList } from '../ContactsList/ContactsList';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { Contact } from '../Contact/Contact';
import {
  fetchUsers,
  setUsers,
  setSelectedUsers,
} from '../../store/actions/userActions';
import { NoResults } from '../NoResults/NoResults';
import { Error } from '../Error/Error';
import { Spinner } from '../Spinner/Spinner';
import { FETCH_CONTACTS_ERROR } from '../../errorCodes';
import { connect } from 'react-redux';

class ContactsComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      error: null,
      isLoading: false,
    };
    this.fetchNext = this.fetchNext.bind(this);
    this.addToChat = this.addToChat.bind(this);
  }

  componentDidMount() {
    this.fetchNext();
  }

  componentWillUnmount() {
    const users = [].concat(this.props.users);
    users.forEach(user => {
      user.checked = false;
    });

    this.props.setUsers(users);
    this.props.setSelectedUsers([]);
  }

  async fetchNext() {
    try {
      this.setState({
        isLoading: true,
      });
      await this.props.fetchUsers();
      this.setState({
        isLoading: false,
      });
    } catch (err) {
      console.error(err);
      this.setState({ error: err, isLoading: false });
    }
  }

  addToChat(index) {
    const users = [].concat(this.props.users);
    const selectedUsers = [].concat(this.props.selectedUsers);
    const current = users[index];

    if (!current.checked) {
      selectedUsers.push(current);
      this.props.setSelectedUsers(selectedUsers);
    } else {
      let user = selectedUsers.find(user => user._id === current._id);
      let deleteIndex = selectedUsers.indexOf(user);
      selectedUsers.splice(deleteIndex, 1);
      this.props.setSelectedUsers(selectedUsers);
    }

    current.checked = !current.checked;
    this.props.setUsers(users);
  }

  render() {
    const { error, isLoading } = this.state;

    const { users, user, createChat, current } = this.props;
    if (!users.length && !error && !isLoading) {
      return <NoResults text="Нет контактов..." />;
    }

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <React.Fragment>
        {createChat ? (
          false
        ) : (
          <Link to="/profile">
            <Contact
              userName={user.name ? user.name : 'Аноним'}
              content={user.phone}
              avatar={user.img}
              size="large"
              contentType="message"
              color="7"
            />
          </Link>
        )}
        <InfiniteScroller loadMore={this.fetchNext}>
          <ContactsList
            type="contactList"
            contacts={users}
            user={user}
            search={current}
            addToChat={this.addToChat}
            createChat={createChat}
          />
          {error ? <Error code={FETCH_CONTACTS_ERROR} /> : null}
        </InfiniteScroller>
      </React.Fragment>
    );
  }
}

const stateToProps = state => ({
  user: state.user.user,
  users: state.user.users,
  selectedUsers: state.user.selectedUsers,
  current: state.search.currentUserSearch,
});

export const Contacts = connect(stateToProps, {
  fetchUsers,
  setUsers,
  setSelectedUsers,
})(ContactsComponent);
