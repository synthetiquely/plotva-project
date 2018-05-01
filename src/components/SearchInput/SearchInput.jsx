import React from 'react';
import { connect } from 'react-redux';
import './SearchInput.css';
import { Icon } from '../Icon/Icon';
import { setSearch } from '../../store/actions/searchActions';

const stateToProps = state => ({
  current: state.search.user,
});

export const SearchInput = connect(stateToProps)(
  class SearchInput extends React.Component {
    constructor(props) {
      super(props);

      this.getSearchRequest = this.getSearchRequest.bind(this);
    }

    componentWillUnmount() {
      this.resetState();
    }

    getSearchRequest(event) {
      const value = event.target.value;
      return this.props.dispatch(setSearch(value));
    }

    resetState() {
      return this.props.dispatch(setSearch(''));
    }

    render() {
      return (
        <form className="search-input">
          <Icon className="search-input__icon" type="search" />
          <input
            className="search-input__input"
            type="search"
            placeholder="Искать по контактам..."
            onChange={this.getSearchRequest}
          />
        </form>
      );
    }
  },
);
