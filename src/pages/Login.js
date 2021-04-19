import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import logoImg from "../logo.svg";
// import { Card, Logo, Form, Input, Button, Error } from "../components/AuthForm";
import { useAuth } from "../context/auth";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Logo from '../components/Logo';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import EventNoteIcon from '@material-ui/icons/EventNote';
import {
  saveUser
} from '../features/counter/counterSlice';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login(props) {
  const classes = useStyles();
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const { setAuthTokens } = useAuth();
    const history = useHistory();
    const dispatch = useDispatch();

    const referer = document.referrer || '/';

    let axiosConfig = {
      headers: {
          "Access-Control-Allow-Origin": "*",
      }
    }
  
    function postLogin() {
      axios.post("/api/Login.php", {
        Username: userName,
        Password: password
      },axiosConfig).catch(e => {
        setError(true);
        setAlertMessage("Email/password combination incorrect.");
        setAlertOpen(true);
      }).then((response) => {
        if (response.data.UserName && response.data.userName.length() == 0) {
          setError(true);
          setAlertMessage("Email/password combination incorrect.");
          setAlertOpen(true);
        }
        else {
          setAuthTokens(response.data);
          setLoggedIn(true);
          dispatch(saveUser(response.data));
          history.push("/");
        }
      });
    }

  
    if (isLoggedIn) {
      history.push('/')
  }
  
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
        <Avatar className={classes.avatar}>
            <EventNoteIcon fontSize="large"/>
          </Avatar>
        <Typography variant="h3" color="primary" align="center">
          EventTap
        </Typography>
          <Typography component="h2" variant="h5">
            Sign in
          </Typography>
          {
                alertOpen &&
                <Alert severity={error ? "error" : "success"}>{alertMessage}</Alert>
            }
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              onChange={e => {
                setUserName(e.target.value);
              }}
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={e => {
                setPassword(e.target.value);
              }}
              autoComplete="current-password"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={postLogin}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Button color="primary" onClick={() => {history.push('/signup')}}>
                  {"Don't have an account?"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
  
  export default Login;