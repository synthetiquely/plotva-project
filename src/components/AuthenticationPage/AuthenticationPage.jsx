import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from '../Layout/Layout';
import { Header } from '../Header/Header';
import { Authentication } from '../Authentication/Authentication';

export const AuthenticationPageComponent = ({ user }) => {
  if (user) {
    return <Redirect to="/chats" />;
  }
  return (
    <Layout
      header={<Header type="profile" title="Добро пожаловать" subtitle="" />}
      content={<Authentication />}
    />
  );
};

const stateToProps = state => ({
  user: state.user.user,
});

export const AuthenticationPage = connect(stateToProps)(
  AuthenticationPageComponent,
);
