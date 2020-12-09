import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Search extends Component {
  state = {
    text: '',
  }

  static propTypes = {
    searchUsers: PropTypes.func.isRequired,
    clearUsers: PropTypes.func.isRequired,
    showClear: PropTypes.bool.isRequired,
    setAlert: PropTypes.func.isRequired,
  }

  onSubmit = (e) => {
    e.preventDefault()

    if (this.state.text === '') {
      this.props.setAlert('Enter something', 'light')
    } else {
      this.props.searchUsers(this.state.text)
      this.setState({
        text: '',
      })
    }
  }
  onChange = (e) => {
    this.setState({
      text: e.target.value,
    })
  }

  showClear() {
    if (this.props.showClear) {
      return (
        <button
          className="btn btn-light btn-block"
          onClick={this.props.clearUsers}
        >
          Clear
        </button>
      )
    }
  }

  render() {
    const { showClear, clearUsers } = this.props
    return (
      <div>
        <form onSubmit={this.onSubmit.bind(this)} className="form">
          <input
            type="text"
            name="text"
            id=""
            placeholder="Search users..."
            value={this.state.text}
            onChange={this.onChange}
          />
          <input
            type="submit"
            value="Search"
            className="btn btn-dark btn-block"
          />
          {showClear && (
            <button className="btn btn-light btn-block" onClick={clearUsers}>
              Clear
            </button>
          )}
        </form>
      </div>
    )
  }
}

export default Search
