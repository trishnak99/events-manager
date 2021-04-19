import React, {useEffect, useState} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import Alert from '@material-ui/lab/Alert';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    drawerContainer: {
      overflow: 'auto',
    },
    menuButton: {
      marginRight: 36,
    },
    title: {
      flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 240,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    fixedHeightPaper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 240
    }
}));

export default function AddComment(props) {
  const classes = useStyles();
  const currentDate = new Date();
  const user = props.user;
  const event = props.event;

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(null);
  const [error, setError] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // const generateTimes = () => {
  //   const list = [];
  //   var i = 0;
  //   while (i < 24) {
  //       const miliTime = (i + 12) % 12;
  //       const timeObj = {};
  //       if (i == 0) {
  //           timeObj.value = '0:00:00';
  //           timeObj.label = '12:00 AM';
  //       }
  //       else if (i == 12) {
  //           timeObj.value = '12:00:00';
  //           timeObj.label = '12:00 PM';
  //       }
  //       else {
  //           timeObj.value = '' + i + ':00:00';
  //           timeObj.label = miliTime + ':00 '  + ((i < 12) ? 'PM' : 'AM');
  //       }
  //       list.push(timeObj);
  //   }
  //   return list;
  // }

  let axiosConfig = {
    headers: {
        "Access-Control-Allow-Origin": "*",
    }
  }

  // useEffect(() => {
  //   axios.post("/api/GetLocation.php", {
  //     Description: "",
  //     Longitude: "",
  //     Latitude: ""
  //   },axiosConfig).catch(e => {

  //   }).then((response) => {
  //     if (!response.data.error) {
  //       setLocationOptions(response.data);
  //     }
  //   });
  // }, []);

  const saveComment = () => {
    const commentObj = {
      Comment: newComment,
      Rating: newRating,
      UserID: user.ID,
      EventID: event.EventID
    }
    axios.post("/api/AddComment.php", commentObj
    ,axiosConfig)
    .catch(e => {
    
    })
    .then((response) => {
           setNewComment("");
           setNewRating(null);
           props.toggleModal(commentObj, false);
    });
    // props.toggleModal(commentObj, false);
  }

  // const categoryOptions = ['Team Building','Social', 'Fundraising', 'Workshop', 'Tech Talk', 'Seminar', 'General Body Meeting'];

  return (
      <Dialog open={props.modalOpen} onClose={() => props.toggleModal({}, false)} fullWidth maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Comment</DialogTitle>
        <DialogContent>
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
                                    multiline
                                    id="newComment"
                                    label="Comment"
                                    name="newComment"
                                    onChange={e => {
                                        setNewComment(e.target.value);
                                    }}
                                    autoFocus
                                />
                                <Box component="fieldset" mb={3} borderColor="transparent">
                                    <Typography component="legend">Rating</Typography>
                                    <Rating
                                        name="simple-controlled"
                                        value={newRating}
                                        onChange={(event, newValue) => {
                                            setNewRating(newValue);
                                        }}
                                    />
                                </Box>
                            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.toggleModal({}, false)} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button color="primary" variant="contained" onClick={() => saveComment()}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
  );
}