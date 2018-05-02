import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InputGroup } from '../InputGroup/InputGroup';
import { Button } from '../Button/Button';
import { Spinner } from '../Spinner/Spinner';
import { Error } from '../Error/Error';
import { AUTHENTICATION_ERROR } from '../../errorCodes';

import api from '../../api';
import { setUser } from '../../store/actions/userActions';

export class SigninFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
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
    const { name, password } = this.state;
    this.setState({
      isLoading: true,
    });

    //TODO: implement sign in method
    api
      .signin({ name, password })
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
    const { name, password, isLoading, error } = this.state;
    return (
      <React.Fragment>
        <form className="profile-edit">
          <InputGroup type="text" name="name" onInputChange={this.handleChange} value={name} label="Ваше имя" />
          <InputGroup
            type="password"
            name="password"
            onInputChange={this.handleChange}
            value={password}
            label="Ваш пароль"
          />
          <Button txt="Войти" />
        </form>
        {isLoading ? <Spinner /> : null}
        {error ? <Error code={AUTHENTICATION_ERROR} /> : null}
      </React.Fragment>
    );
  }
}

export const SigninForm = connect(null, { setUser })(SigninFormComponent);
