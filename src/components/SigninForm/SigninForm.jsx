import React, { Component } from 'react';
import { InputGroup } from '../InputGroup/InputGroup';
import { Button } from '../Button/Button';

export class SigninForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
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
    const { email, password } = this.state;
    this.props.handleSubmit({ email, password });
  }

  render() {
    const { email, password } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="profile-edit">
        <InputGroup type="text" name="email" onInputChange={this.handleChange} value={email} label="Ваше имя" />
        <InputGroup
          type="password"
          name="password"
          onInputChange={this.handleChange}
          value={password}
          label="Ваш пароль"
        />
        <div className="form-wrapper">
          <Button txt="Войти" />
        </div>
      </form>
    );
  }
}
