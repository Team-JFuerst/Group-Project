import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { triggerLogin, formError, clearError } from '../../redux/actions/loginActions';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const mapStateToProps = state => ({
  user: state.user,
  login: state.login,
});

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  componentDidMount() {
    this.props.dispatch(clearError());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.userName) {
      this.props.history.push('/schedule');
    }
  }

  login = (event) => {
    event.preventDefault();

    if (this.state.username === '' || this.state.password === '') {
      this.props.dispatch(formError());
    } else {
      this.props.dispatch(triggerLogin(this.state.username, this.state.password));
    }
  }

  handleInputChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value,
    });
  }

  renderAlert = () => {
    if (this.props.login.message !== '') {
      return (
        <h2
          className="alert"
          role="alert"
        >
          {this.props.login.message}
        </h2>
      );
    }
    return (<span />);
  }

  render() {
    return (
      <div>
        {this.renderAlert()}
        <form onSubmit={this.login}>
          <h1>Login</h1>
          <div>
            <label htmlFor="username">
              Username:
              <Input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleInputChange}
              />
            </label>
          </div>
          <div>
            <label htmlFor="password">
              Password:
              <Input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
            </label>
          </div>
          <div>
            {/* <input
              type="submit"
              name="submit"
              value="Log In"
            /> */}
            <Button variant="contained" color="primary" onClick={this.login}>Login</Button>
            <Button variant="contained" color="default" ><Link to="/register" style={{textDecoration: 'none'}}>Register</Link></Button>
          </div>
        </form>
      </div>
    );
  }
}


export default connect(mapStateToProps)(LoginPage);
