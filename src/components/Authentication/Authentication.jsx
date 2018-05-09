import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { SigninForm } from '../SigninForm/SigninForm';
import { SignupForm } from '../SignupForm/SignupForm';
import { Button } from '../Button/Button';
import { Spinner } from '../Spinner/Spinner';
import { Error } from '../Error/Error';
import { AUTHENTICATION_ERROR } from '../../errorCodes';

import { connect } from 'react-redux';
import { decodeTokenAndSetUser } from '../../store/actions/userActions';
import { signin, signup } from '../../api/auth';

import './styles.css';

export class AuthenticationComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignin: true,
      isLoading: false,
      error: null,
    };
    this.toggleForm = this.toggleForm.bind(this);
    this.handleSignin = this.handleSignin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  toggleForm() {
    this.setState(prevState => ({
      showSignin: !prevState.showSignin,
      isLoading: false,
      error: null,
    }));
  }

  handleSignin(signinData) {
    this.setState({
      isLoading: true,
    });

    signin(signinData)
      .then(response => {
        this.props.decodeTokenAndSetUser(response.token);
        this.setState({
          isLoading: false,
        });
        this.props.history.push('/chats');
      })
      .catch(error => {
        this.setState({
          error,
          isLoading: false,
        });
      });
  }

  handleSignup(signupData) {
    this.setState({
      isLoading: true,
    });

    signup(signupData)
      .then(response => {
        this.props.decodeTokenAndSetUser(response.token);
        this.setState({
          isLoading: false,
        });
        this.props.history.push('/chats');
      })
      .catch(error => {
        this.setState({
          error,
          isLoading: false,
        });
      });
  }

  render() {
    const { showSignin, isLoading, error } = this.state;
    return (
      <React.Fragment>
        {showSignin ? (
          <div>
            <SigninForm handleSubmit={this.handleSignin} />
            <div className="toggle-form-link form-wrapper">
              <p>Нет учетной записи?</p>
              <Button onClick={this.toggleForm} txt="Создать учетную запись" />
            </div>
          </div>
        ) : (
          <div>
            <SignupForm handleSubmit={this.handleSignup} />
            <div className="toggle-form-link form-wrapper">
              <p>Уже есть аккаунт?</p>
              <Button onClick={this.toggleForm} txt="Войти" />
            </div>
          </div>
        )}

        {isLoading ? <Spinner /> : null}
        {error ? <Error code={AUTHENTICATION_ERROR} /> : null}
      </React.Fragment>
    );
  }
}

export const Authentication = withRouter(
  connect(null, { decodeTokenAndSetUser })(AuthenticationComponent),
);
