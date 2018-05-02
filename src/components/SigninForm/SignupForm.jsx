import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InputGroup } from '../InputGroup/InputGroup';
import { Button } from '../Button/Button';
import { Spinner } from '../Spinner/Spinner';
import { Error } from '../Error/Error';
import { AUTHENTICATION_ERROR } from '../../errorCodes';

import api from '../../api';
import { setUser } from '../../store/actions/userActions';

export class SignupFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
      isLoading: false,
      error: null,
    };
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { name, email, phone, password } = this.state;
    this.setState({
      isLoading: true,
    });

    //TODO: implement sign up method
    api
      .saveUser({ name, email, phone, password })
      .then(user => {
        this.props.setUsersetUser(user);
        this.setState({
          isLoading: false,
        });
      })
      .catch(error => {
        this.setState({
          error,
          isLoading: false,
        });
      });
  }

  render() {
    const { name, email, phone, password, isLoading, error } = this.state;
    return (
      <React.Fragment>
        <form className="profile-edit">
          <InputGroup type="text" name="name" onInputChange={this.handleChange} value={name} label="Введите ваше имя" />
          <InputGroup
            type="email"
            name="email"
            onInputChange={this.handleChange}
            value={email}
            label="Введите ваш почтовый ящик"
          />
          <InputGroup
            type="tel"
            name="phone"
            onInputChange={this.handleChange}
            value={phone}
            label="Введите ваш номер телефона"
          />
          <InputGroup
            type="password"
            name="password"
            onInputChange={this.handleChange}
            value={password}
            label="Придумайте пароль"
          />
          <Button txt="Зарегистрироваться" />
        </form>
        {isLoading ? <Spinner /> : null}
        {error ? <Error code={AUTHENTICATION_ERROR} /> : null}
      </React.Fragment>
    );
  }
}

export const SignupForm = connect(null, { setUser })(SignupFormComponent);
