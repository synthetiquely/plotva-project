import React, { Component } from 'react';
import { InputGroup } from '../InputGroup/InputGroup';
import { Button } from '../Button/Button';

export class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { name, email, phone, password } = this.state;
    this.props.handleSubmit({ name, email, phone, password });
  }

  render() {
    const { name, email, phone, password } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="profile-edit">
        <InputGroup
          type="text"
          name="name"
          placeholder="Введите ваше имя"
          onInputChange={this.handleChange}
          value={name}
          label="Введите ваше имя"
        />
        <InputGroup
          type="email"
          name="email"
          placeholder="Введите ваш email"
          onInputChange={this.handleChange}
          value={email}
          label="Введите ваш почтовый ящик"
        />
        <InputGroup
          type="tel"
          name="phone"
          placeholder="Введите ваш номер телефона"
          onInputChange={this.handleChange}
          value={phone}
          label="Введите ваш номер телефона"
        />
        <InputGroup
          type="password"
          name="password"
          placeholder="Придумайте пароль"
          onInputChange={this.handleChange}
          value={password}
          label="Придумайте пароль"
        />
        <div className="form-wrapper">
          <Button txt="Зарегистрироваться" />
        </div>
      </form>
    );
  }
}
