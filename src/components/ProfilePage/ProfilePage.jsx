import React from 'react';
import { Layout } from '../Layout/Layout';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Profile } from '../Profile/Profile';

export const ProfilePage = () => (
  <Layout
    header={<Header type="profile" title="Профиль" subtitle="" />}
    content={<Profile />}
    footer={<Footer path="Профиль" />}
  />
);
