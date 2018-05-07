import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ProfileEdit } from '../ProfileEdit/ProfileEdit';
import { ProfileAvatar } from '../ProfileAvatar/ProfileAvatar';
import { Spinner } from '../Spinner/Spinner';
import { Error } from '../Error/Error';
import { Icon } from '../Icon/Icon';
import { UPDATE_USER_ERROR } from '../../errorCodes';
import { updateAvatar, updateProfile, logout } from '../../store/actions/userActions';
import defaultAvatar from './images/default_avatar.jpg';

import './Profile.css';

class ProfileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      edit: false,
      error: null,
    };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
    this.handleChangeProfile = this.handleChangeProfile.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  toggleEdit() {
    this.setState(prevState => ({
      edit: !prevState.edit,
    }));
  }

  handleChangeAvatar(avatar) {
    this.setState({
      isLoading: true,
    });
    this.props
      .updateAvatar(avatar)
      .then(() => {
        this.setState({
          isLoading: false,
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          error,
        });
      });
  }

  handleChangeProfile(data) {
    this.setState({
      isLoading: true,
    });
    this.props
      .updateProfile(data)
      .then(() => {
        this.setState({
          isLoading: false,
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          error,
        });
      });
  }

  handleLogout() {
    this.props.logout();
  }

  render() {
    const { isLoading, error } = this.state;
    const { user } = this.props;
    if (!user) {
      return <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        <div className="profile-info">
          <button onClick={this.handleLogout} className="profile-info_logout">
            <Icon type="logout" />
          </button>
          <ProfileAvatar image={user.img ? user.img : defaultAvatar} changeAvatar={this.handleChangeAvatar} />
          <div className="profile-info_wrapper">
            <button className="profile-info_edit" onClick={this.toggleEdit}>
              {this.state.edit ? 'Отменить изменения' : 'Редактировать'}
            </button>
          </div>
          {this.state.edit ? null : (
            <div className="profile-info_txt">
              <p className="profile-info_name">{user.name}</p>
              <p className="profile-info_status">в сети</p>
              <p className="profile-info_email">
                <span className="profile-info_label">Электронный адрес:</span> {user.email}
              </p>
              <p className="profile-info_phone">
                <span className="profile-info_label">Номер телефона:</span> {user.phone}
              </p>
            </div>
          )}
        </div>

        {this.state.edit && (
          <ProfileEdit user={user} changeProfileData={this.handleChangeProfile} toggleEdit={this.toggleEdit} />
        )}

        {isLoading && <Spinner />}

        {error && <Error code={UPDATE_USER_ERROR} />}
      </React.Fragment>
    );
  }
}

const stateToProps = state => ({
  user: state.user.user,
});

export const Profile = connect(stateToProps, { updateAvatar, updateProfile, logout })(ProfileComponent);
