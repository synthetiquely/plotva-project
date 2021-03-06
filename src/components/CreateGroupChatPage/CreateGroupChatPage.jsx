import React from 'react';
import { Layout } from '../Layout/Layout';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { ChatInput } from '../ChatInput/ChatInput';
import { Contacts } from '../Contacts/Contacts';

export const CreateGroupChatPage = () => (
  <Layout
    header={<Header type="contacts" title="Контакты" subtitle="" createChat />}
    content={
      <React.Fragment>
        <ChatInput />
        <Contacts createChat />
      </React.Fragment>
    }
    footer={<Footer path="Чаты" />}
  />
);
