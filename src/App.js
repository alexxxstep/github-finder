import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/layout/Navbar'

import Users from './components/users/Users'
import axios from 'axios'
import Search from './components/users/Search'
import Alert from './components/layout/Alert'
import About from './components/pages/About'
import User from './components/users/User'

const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID
const clientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null,
  }

  // Search Github users
  searchUsers = async (text) => {
    try {
      this.setState({
        loading: true,
      })

      const url = `https://api.github.com/search/users?q=${text}&client_id=${clientId}&client_secret=${clientSecret}`

      const res = await axios.get(url)

      this.setState({
        users: res.data.items,
        loading: false,
        alert: null,
      })
    } catch (err) {
      console.log(err)
      this.setState({
        loading: false,
      })
    }
  }

  // Clear users from state
  clearUsers = () => {
    this.setState({
      users: [],
      loading: false,
      alert: null,
    })
  }

  // Set Alert
  setAlert = (msg, type) => {
    this.setState({
      alert: {
        msg,
        type,
      },
    })

    setTimeout(() => {
      this.setState({
        alert: null,
      })
    }, 5000)
  }

  // Get Github user https://api.github.com/users/[name]
  getUser = async (username) => {
    try {
      this.setState({
        loading: true,
      })

      const url = `https://api.github.com/users/${username}?client_id=${clientId}&client_secret=${clientSecret}`

      const res = await axios.get(url)

      this.setState({
        user: res.data,
        loading: false,
      })
    } catch (err) {
      console.log(err)
      this.setAlert('Limit to data of user', 'danger')
      this.setState({
        loading: false,
      })
    }
  }

  // get users from
  getUserRepos = async (username) => {
    try {
      this.setState({
        loading: true,
      })

      const url = `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${clientId}&client_secret=${clientSecret}`

      const res = await axios.get(url)

      this.setState({
        repos: res.data,
        loading: false,
      })
    } catch (err) {
      console.log(err)
      this.setAlert('Limit to data of user', 'danger')
      this.setState({
        loading: false,
      })
    }
  }

  render() {
    const { users, loading, alert, user, repos } = this.state

    return (
      <Router>
        <div className="App">
          <Navbar title={'Git Finder'} />
          <div className="container">
            <Alert alert={alert} />

            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Fragment>
                    <Search
                      searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={this.setAlert}
                    />
                    <Users
                      users={users}
                      loading={loading}
                      getUser={this.getUser}
                    />
                  </Fragment>
                )}
              />
              <Route exact path="/about" component={About} />
              <Route
                path="/user/:login"
                render={(props) => (
                  <User
                    {...props}
                    getUser={this.getUser}
                    getUserRepos={this.getUserRepos}
                    user={user}
                    repos={repos}
                    loading={loading}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App
