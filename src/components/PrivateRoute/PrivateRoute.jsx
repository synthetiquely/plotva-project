import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent) {
  class PrivateRoute extends Component {
    componentWillMount() {
      if (!this.props.user) {
        this.props.history.push('/');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.user) {
        this.props.history.push('/');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      user: state.user ? state.user.user : null,
    };
  }

  return connect(mapStateToProps)(PrivateRoute);
}
