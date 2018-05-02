import React from 'react';
import { Layout } from '../Layout/Layout';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Chats } from '../Chats/Chats';

export const ChatsPage = () => (
  <Layout
    header={<Header type="chats" title="Чаты" subtitle="" />}
    content={<Chats />}
    footer={<Footer path="Чаты" />}
  />
);
