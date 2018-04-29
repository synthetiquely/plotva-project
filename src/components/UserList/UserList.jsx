import React, { PureComponent } from 'react';
import { Contacts } from '../Contacts/Contacts';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { Contact } from '../Contact/Contact';
import { setUsers, setNext, setSelectedUsers } from '../../store/actions/userActions';
import { NoResults } from '../NoResults/NoResults';
import { Error } from '../Error/Error';
import { FETCH_CONTACTS_ERROR } from '../../errorCodes';
import { connect } from 'react-redux';

import api from '../../../src/api.js';

class UserListComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      error: null,
    };
    this.fetchNext = this.fetchNext.bind(this);
    this.addToChat = this.addToChat.bind(this);
  }

  async componentDidMount() {
    //two pages to fill the screen
    await this.fetchNext();
    await this.fetchNext();
  }

  componentWillUnmount() {
    const users = [].concat(this.props.users);
    users.forEach(user => {
      user.checked = false;
    });

    this.props.dispatch(setUsers(users));
    this.props.dispatch(setSelectedUsers([]));
  }

  async fetchNext() {
    const next = this.props.next;
    if (next === null) {
      return;
    }
    try {
      let resp = await api.getUsers(next);
      const users = this.props.users.concat(
        resp.items.map(user => {
          const status = user.online ? 'online' : 'offline';
          return {
            _id: user._id,
            userName: user.name ? user.name : 'Anonymous',
            avatar: user.img,
            size: 'small',
            content: status,
            contentType: status,
          };
        }),
      );
      this.props.dispatch(setUsers(users));
      this.props.dispatch(setNext(resp.next));
    } catch (err) {
      console.error(err);
      this.setState({ error: err });
    }
  }

  addToChat(index) {
    const users = [].concat(this.props.users);
    const selectedUsers = [].concat(this.props.selectedUsers);
    const current = users[index];

    if (!current.checked) {
      selectedUsers.push(current);
      this.props.dispatch(setSelectedUsers(selectedUsers));
    } else {
      let user = selectedUsers.find(user => user._id === current._id);
      let deleteIndex = selectedUsers.indexOf(user);
      selectedUsers.splice(deleteIndex, 1);
      this.props.dispatch(setSelectedUsers(selectedUsers));
    }

    current.checked = !current.checked;
    this.props.dispatch(setUsers(users));
  }

  render() {
    const { error } = this.state;
    const { users, user, createChat, current } = this.props;
    if (!users.length && !error) {
      return <NoResults text="No contacts yet..." />;
    }
    return (
      <React.Fragment>
        {createChat ? (
          false
        ) : (
          <Contact
            userName={user.name}
            content={user.phone}
            avatar={user.img}
            size="large"
            contentType="message"
            color="7"
          />
        )}
        <InfiniteScroller loadMore={this.fetchNext}>
          <Contacts
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
  next: state.user.next,
  selectedUsers: state.user.selectedUsers,
  current: state.search.currentUserSearch,
});

export const UserList = connect(stateToProps)(UserListComponent);
