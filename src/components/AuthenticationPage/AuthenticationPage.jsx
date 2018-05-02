import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

export const AuthenticationPageComponent = ({ user }) => {
  if (user.isFirstLogin) {
    return <Redirect to="/profile" />;
  }
  return <Redirect to="/chats" />;
};

const stateToProps = state => ({
  user: state.user.user,
});

export const AuthenticationPage = withRouter(connect(stateToProps)(AuthenticationPageComponent));
