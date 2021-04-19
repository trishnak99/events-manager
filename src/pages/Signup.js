import React, { useState, useEffect } from "react";
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
import Alert from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import EventNoteIcon from '@material-ui/icons/EventNote';
import {
  saveUser
} from '../features/counter/counterSlice';
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
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

function Signup(props) {
  const classes = useStyles();
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [university, setUniversity] = useState("");
    const [universities, setUniversities] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const { setAuthTokens } = useAuth();

    const dispatch = useDispatch();
    const history = useHistory();

    const referer = document.referrer || '/';

    let axiosConfig = {
      headers: {
          "Access-Control-Allow-Origin": "*",
      }
    }

    useEffect(() => {
      axios.post("/api/SearchUniversity", {
          ID: "",
          Name: ""
        },axiosConfig).catch(e => {
    
        }).then((response) => {
          if (!response.data.error) {
              setUniversities(response.data);
          }
      });
  }, []);
  
    function postSignUp() {
      axios.post("/api/Register.php", {
        Username: email,
        FirstName: firstName,
        LastName: lastName,
        Password: password
      },axiosConfig).catch(e => {
        setError(true);
        setAlertMessage("Unable to register user.");
        setAlertOpen(true);
      }).then((response) => {
        if (response.data && !response.data.Success) {
          setError(true);
          setAlertMessage("Unable to register user.");
          setAlertOpen(true);
        }
        else {
          axios.post("/api/Login.php", {
            Username: email,
            Password: password
          },axiosConfig).catch(e => {
            setError(true);
            setAlertMessage("Unable to register user.");
            setAlertOpen(true);
          }).then((response) => {
            if (typeof response != 'object') {
              setError(true);
              setAlertMessage("Unable to register user.");
              setAlertOpen(true);
            }
            else {
              axios.post("/api/JoinUniversity.php", {
                ID: response.data.ID,
                UniversityName: university
              },axiosConfig).catch(e => {
                setError(true);
                setAlertMessage("Unable to register user.");
                setAlertOpen(true);
              }).then((responseNew) => {
                if (typeof responseNew != 'object') {
                  setError(true);
                  setAlertMessage("Unable to register user.");
                  setAlertOpen(true);
                }
                else {
                  const user = {
                    ID: response.data.ID,
                    Username: response.data.Username
                  }
                  setAuthTokens(user);
                  setLoggedIn(true);
                  dispatch(saveUser(response.data));
                  history.push("/");
                }
              });
            }
          });
        }
      });
    }

  
    if (isLoggedIn) {
        history.push('/')
    };
  
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
        <Avatar className={classes.avatar}>
            <EventNoteIcon fontSize="large" />
          </Avatar>
          <Typography variant="h3" color="primary" align="center">
          EventTap
        </Typography>
        <Divider/>
          <Typography component="h2" variant="h5">
            Sign Up
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
              id="firstName"
              label="First Name"
              onChange={e => {
                setFirstName(e.target.value);
              }}
              name="firstName"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              onChange={e => {
                setLastName(e.target.value);
              }}
              name="LastName"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              onChange={e => {
                setEmail(e.target.value);
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              select
              name="university"
              label="University"
              value={university}
                  onChange={(event) => {
                    setUniversity(event.target.value);
                  }}
                  SelectProps={{
                    native: true,
                  }}
            >
                  <option key={""} value={""}>
                      {""}
                  </option>
                  {universities && universities.map((option) => (
                    <option key={option.ID} value={option.Name}>
                      {option.Name}
                    </option>
                  ))}
            </TextField>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={postSignUp}
            >
              Sign up
            </Button>
            <Grid container>
              <Grid item>
              <Button color="primary" onClick={() => {history.push('/login')}}>
                  {"Already have an account?"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
  
  export default Signup;