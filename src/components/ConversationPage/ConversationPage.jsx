import React from 'react';
import { connect } from 'react-redux';

import { Layout } from '../Layout/Layout';
import { Header } from '../Header/Header';
import { Chat } from '../Chat/Chat';
import { ChatForm } from '../ChatForm/ChatForm';

export const ConversationPageComponent = ({ chat }) => (
  <Layout
    header={<Header type="dialog" title={chat.title || 'Загружаем...'} subtitle={chat.subtitle || 'Загружаем...'} />}
    content={<Chat />}
    footer={<ChatForm />}
  />
);

const stateToProps = state => ({
  chat: state.chat,
});

export const ConversationPage = connect(stateToProps)(ConversationPageComponent);
