import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
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
        <Route exact path="/profile" component={PrivateRoute(ProfilePage)} />
        <Route exact path="/chats" component={PrivateRoute(ChatsPage)} />
        <Route exact path="/chat/:id" component={PrivateRoute(ConversationPage)} />
        <Route exact path="/contacts" component={PrivateRoute(ContactsPage)} />
        <Route exact path="/create_chat" component={PrivateRoute(CreateGroupChatPage)} />
      </Switch>
    );
  }
}
