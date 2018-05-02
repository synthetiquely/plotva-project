import React from 'react';
import { connect } from 'react-redux';
import { Icon } from '../Icon/Icon';
import { setSearch } from '../../store/actions/searchActions';

import './SearchInput.css';

const stateToProps = state => ({
  current: state.search.user,
});

export const SearchInput = connect(stateToProps)(
  class SearchInput extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
    }

    componentWillUnmount() {
      this.resetState();
    }

    handleChange(event) {
      const value = event.target.value;
      this.props.dispatch(setSearch(value));
    }

    resetState() {
      this.props.dispatch(setSearch(''));
    }

    render() {
      return (
        <form className="search-input">
          <Icon className="search-input__icon" type="search" />
          <input
            className="search-input__input"
            type="search"
            placeholder="Искать по контактам..."
            onChange={this.handleChange}
          />
        </form>
      );
    }
  },
);
