import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

export const AuthenticationPageComponent = ({ user }) => {
  if (user.isFirstLogin) {
    return <Redirect to="/profile" />;
  }
  return <Redirect to="/chats" />;
};

const stateToProps = state => ({
  user: state.user.user,
});

export const AuthenticationPage = connect(stateToProps)(
  AuthenticationPageComponent,
);
