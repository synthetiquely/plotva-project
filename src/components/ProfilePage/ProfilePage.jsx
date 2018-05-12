import React from 'react';
import { Layout } from '../Layout/Layout';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Profile } from '../Profile/Profile';
import { connect } from 'react-redux';

export const ProfilePageComponent = ({ user }) => {
  if (user.isFirstLogin) {
    return (
      <Layout
        header={<Header type="profile" title="Профиль" subtitle="" />}
        content={<Profile edit />}
        footer={<Footer path="Профиль" />}
      />
    );
  } else {
    return (
      <Layout
        header={<Header type="profile" title="Профиль" subtitle="" />}
        content={<Profile />}
        footer={<Footer path="Профиль" />}
      />
    );
  }
};

const stateToProps = state => ({
  user: state.user.user,
});

export const ProfilePage = connect(stateToProps)(ProfilePageComponent);
