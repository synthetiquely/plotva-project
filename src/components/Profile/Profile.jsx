import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProfileEdit } from '../ProfileEdit/ProfileEdit';
import { Icon } from '../Icon/Icon';

import './Profile.css';

class ProfileComponent extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.user.isFirstLogin && !prevState.edit) {
      return { edit: true };
    }
    return null;
  }

  state = {
    edit: false,
  };

  toggleEdit = () => {
    this.setState(prevState => ({
      edit: !prevState.edit,
    }));
  };

  render() {
    const { user } = this.props;
    return (
      <React.Fragment>
        {this.props.user.isFirstLogin ? (
          <h3>Введите данные:</h3>
        ) : (
          <div className="profile-info">
            {user.img && <img src={user.img} alt={user.name} className="profile-info_img" />}
            <div className="profile-info_txt">
              <p className="profile-info_name">{user.name}</p>
              <p className="profile-info_email">{user.email}</p>
              <p className="profile-info_phone">{user.phone}</p>
            </div>
            <button className="profile-info_edit" onClick={this.toggleEdit}>
              <Icon type="header-write" />
            </button>
          </div>
        )}

        {this.state.edit && <ProfileEdit toggleEdit={this.toggleEdit} />}
      </React.Fragment>
    );
  }
}

const stateToProps = state => ({
  user: state.user.user,
});

export const Profile = connect(stateToProps)(ProfileComponent);
