import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthenticationPage } from '../AuthenticationPage/AuthenticationPage';
import { ChatsPage } from '../ChatsPage/ChatsPage';
import { ConversationPage } from '../ConversationPage/ConversationPage';
import { ContactsPage } from '../ContactsPage/ContactsPage';
import { CreateGroupChatPage } from '../CreateGroupChatPage/CreateGroupChatPage';
import { ProfilePage } from '../ProfilePage/ProfilePage';

export class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={AuthenticationPage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/chats" component={ChatsPage} />
        <Route exact path="/chat/:id" component={ConversationPage} />
        <Route exact path="/contacts" component={ContactsPage} />
        <Route exact path="/create_chat" component={CreateGroupChatPage} />
      </Switch>
    );
  }
}
