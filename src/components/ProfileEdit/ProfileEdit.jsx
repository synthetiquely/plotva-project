import React, { Component } from 'react';
import { InputGroup } from '../InputGroup/InputGroup';
import { Button } from '../Button/Button';

import './ProfileEdit.css';

export class ProfileEdit extends Component {
  state = {
    ...this.props.user,
  };

  onSubmit = async e => {
    e.preventDefault();
    const user = this.state;
    await this.props.changeProfileData(user);
    this.props.toggleEdit();
  };

  onInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { user } = this.props;
    return (
      <form className="profile-edit" onSubmit={this.onSubmit}>
        <InputGroup type="text" name="name" onInputChange={this.onInputChange} value={user.name} label="Ваше имя" />
        <InputGroup
          type="email"
          name="email"
          onInputChange={this.onInputChange}
          value={user.email}
          label="Ваш почтовый ящик"
        />
        <InputGroup
          type="tel"
          name="phone"
          onInputChange={this.onInputChange}
          value={user.phone}
          label="Ваш номер телефона"
        />
        <Button fullWidth txt="Обновить профиль" />
      </form>
    );
  }
}
