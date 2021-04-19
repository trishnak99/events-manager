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
import { CalendarToday, Category, ContactPhone, Delete, Details, Edit, Info, InfoOutlined, LocationOn, People, Person } from '@material-ui/icons';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
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
import AddComment from '../components/AddComment';
import EditComment from '../components/EditComment';
import Icon from '@material-ui/core/Icon';
import CardActionArea from '@material-ui/core/CardActionArea';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import AddCommentIcon from '@material-ui/icons/AddComment';


const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  paper: {
      padding: theme.spacing(1),
  },
  avatar: {
      backgroundColor: theme.palette.secondary.main,
  },
  commentSection: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey
},
  comment: {
    margin: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  }
}));

export default function CreateEvent(props) {
  const classes = useStyles();
  const currentDate = new Date();
  const user = props.user;
  var event = props.event;
  const studentRSOs = props.studentRSOs;
  const [commentUsers, setCommentUsers] = useState([]);
//   const [event, setEvent] = useState(props.event);

  const [addCommentOpen, setAddCommentOpen] = useState(false);
  const [editCommentOpen, setEditCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeComment, setActiveComment] = useState({});

  let axiosConfig = {
    headers: {
        "Access-Control-Allow-Origin": "*",
    }
  }

  useEffect(() => {
      if (props.event && props.event.EventID) {
        axios.post("/api/GetComments.php", {
            EventID: event.EventID
          },axiosConfig).catch(e => {
      
          }).then((response) => {
              
                if (Array.isArray(response.data)) {
                    setComments(response.data);
                }
          });
      }
    // axios.post("/api/SearchRSO.php", {
    //   ID: "",
    //   Name: ""
    // },axiosConfig).catch(e => {

    // }).then((response) => {
    //   if (!response.data.error) {
    //     setRsoOptions(response.data);
    //   }
    // });
  }, [props]);

  const getComments =() => {
    axios.post("/api/GetComments.php", {
        EventID: event.EventID
      },axiosConfig).catch(e => {
  
      }).then((response) => {
          
            if (Array.isArray(response.data)) {
                setComments(response.data);
                // var newCommentUsers = [];
                // response.data.forEach(comment => {
                //     console.log(comment);
                //     axios.post("/api/GetUserInfo.php", {
                //         ID:comment.UserID
                //     }).catch(e => {
        
                //     }).then((user) => {
                //         if (!user.data.error) {
                //             newCommentUsers.push(user.data[0]);
                //         }
                //     });
                // });
                // setCommentUsers(newCommentUsers);
            }
            else {
                setComments([]);
            }
      });
  }

  const locationOptions = props.locations;
  const rsoOptions = props.rsos;
  const universityOptions = props.universities;
  const schedule = parseDayTime(event);
  function parseDayTime(event) {
    const date = event.Date;
    const startTime = event.StartTime;
    const endTime = event.EndTime;
    if (date) {
        const dateArray = date.split("-").map((value) => parseInt(value));
        const startTimeArray = startTime.split(":").map((value) => parseInt(value));
        const endTimeArray = endTime.split(":").map((value) => parseInt(value));
        const myDateStart = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], startTimeArray[0], startTimeArray[1], startTimeArray[2]);
        const myDateEnd = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], endTimeArray[0], endTimeArray[1], endTimeArray[2]);
        return {
            Date: myDateStart.toLocaleDateString(),
            StartTime: myDateStart.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
            EndTime: myDateEnd.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        };
    }
    else {
        return {};
    }
}

    function toggleAddCommentModal(comment, modalOpen) {
        setAddCommentOpen(modalOpen);
        if (!modalOpen && comment.Rating) {
            // var newComments = comments;
            // newComments.push(comment);
            // console.log(newComments);
            // setComments(newComments);
            getComments();
        }
    }
    function toggleEditCommentModal(editIndex, comment, modalOpen) {
        console.log(comment);
        setEditCommentOpen(modalOpen);
        setActiveIndex(editIndex);
        setActiveComment(comment);
        if (!modalOpen && comment.Rating) {
            // var newComments = comments;
            // newComments[editIndex] = comment;
            // setComments(newComments);
            getComments();
        }
    }

    function deleteComment(deleteIndex) {
        // var newComments = comments;
        // newComments.splice(deleteIndex, 1);
        // setComments(newComments);
        const commentObj = {
            UserID: comments[deleteIndex].UserID,
            Timestamp: comments[deleteIndex].Timestamp
          }
          axios.post("/api/DeleteComment.php", commentObj
          ,axiosConfig)
          .catch(e => {
          
          })
          .then((response) => {
                getComments();
          });
    }

    function getPoster(userID) {
        // const localUser = commentUsers.find(rso => rso.ID == userID);
        return user.FirstName + " " + user.LastName;
    }

  return (
      <Dialog open={props.modalOpen} onClose={() => {event = null; props.toggleModal({},false)}} fullScreen aria-labelledby="form-dialog-title">
        {/* <DialogTitle id="form-dialog-title">
            <Typography variant="h2" color="primary" align="center">
              {event.Name}
            </Typography>
        </DialogTitle> */}
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => {event = null; props.toggleModal({},false)}} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h5" className={classes.title} align="center">
              {event.Name}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
            <Container maxWidth="md" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Card className={classes.card}>
                            {/* <CardActionArea> */}
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        <CalendarToday/>
                                    </Avatar>
                                }
                                title={'Event Details'}
                                titleTypographyProps={{color:"secondary", variant:"h5", noWrap: true}}
                                // subheader={event.EventType != "RSO" ? event.UniversityName : event.RSOName}
                                // subheaderTypographyProps={{color:"secondary"}}
                            />
                                <CardContent>
                                    <Typography variant="h6" color="textSecondary" component="p">
                                        {event.Location}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" component="p">
                                        {schedule.Date}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" component="p">
                                        {schedule.StartTime} to {schedule.EndTime}
                                    </Typography>
                                </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card className={classes.card}>
                            {/* <CardActionArea> */}
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        <People/>
                                    </Avatar>
                                }
                                title={'Host Organization'}
                                titleTypographyProps={{color:"secondary", variant:"h5", noWrap: true}}
                                // subheader={event.EventType != "RSO" ? event.UniversityName : event.RSOName}
                                // subheaderTypographyProps={{color:"secondary"}}
                            />
                                <CardContent>
                                    <Typography variant="h6" color="textSecondary" component="p">
                                        {event.EventType != "RSO" ? event.UniversityName : event.RSOName}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" component="p">
                                        Email: {event.ContactEmail}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" component="p">
                                        Phone: {event.ContactPhone}
                                    </Typography>
                                </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card className={classes.card}>
                            {/* <CardActionArea> */}
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        <Info/>
                                    </Avatar>
                                }
                                title={'Description'}
                                titleTypographyProps={{color:"secondary", variant:"h5", noWrap: true}}
                                // subheader={event.Description}
                                // subheaderTypographyProps={{variant:"h6", color:"textSecondary"}}
                            />
                                <CardContent>
                                    <Typography variant="h6" color="textSecondary" component="p">
                                        Category: {event.Category}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" component="p">
                                        {event.Description}
                                    </Typography>
                                </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Paper className={classes.commentSection}>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item md={2} alignItems="center">
                                    <Typography component="h1" variant="h5" color="secondary" noWrap className={classes.title}>
                                        Comments
                                    </Typography>
                                </Grid>
                                <Grid item md={10}>
                                    <Button 
                                            startIcon={<AddCommentIcon />}
                                            size="small" color="secondary" variant="contained" onClick={() => toggleAddCommentModal({}, true)}>
                                            Add
                                            {/* <Icon color="secondary" fontSize="large">add_circle</Icon> */}
                                        </Button>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} justifyContent="space-around">
                                {
                                    (comments && comments.length > 0) ? comments.map((comment, index) => 
                                        <Grid item xs={12} key={index}>
                                            <Paper className={classes.comment}>
                                                    <Typography variant="h6" color="secondary">
                                                        {comment.UserID == user.ID ? getPoster(comment.UserID) : "Anonymous User"}
                                                        {
                                                            comment.UserID == user.ID &&
                                                            <>
                                                                <Button
                                                                style={{marginLeft:20}}
                                                                startIcon={<Edit />}
                                                                size="small" color="secondary" variant="outlined" onClick={() => toggleEditCommentModal(index,comment, true)}>
                                                                Edit
                                                                {/* <Icon color="secondary" fontSize="large">add_circle</Icon> */}
                                                            </Button>
                                                            <Button
                                                                style={{marginLeft:20}}
                                                                startIcon={<Delete />}
                                                                size="small" color="secondary" variant="outlined" onClick={() => deleteComment(index)}>
                                                                Delete
                                                                {/* <Icon color="secondary" fontSize="large">add_circle</Icon> */}
                                                            </Button>
                                                            </>
                                                        }
                                                    </Typography>
                                                
                                                    <Rating
                                                        name="simple-controlled"
                                                        value={comment.Rating}
                                                        readOnly
                                                    />
                                                    <Box component="fieldset" mt={2} borderColor="">
                                                    <Typography component="legend" variant="body2" color="textPrimary">{comment.Comment}</Typography>
                                                    </Box>
                                                
                                            </Paper>
                                        </Grid>
                                    )
                                    :
                                    <Grid item xs={12} alignItems="center">
                                        <Typography component="h1" variant="h6" align="center" color="textSecondary" noWrap className={classes.title}>
                                            No comments
                                        </Typography>
                                    </Grid>
                                }
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </DialogContent>
        <AddComment
                event={event}
                toggleModal={toggleAddCommentModal}
                modalOpen={addCommentOpen}
                user={user}
        />
        <EditComment
                event={event}
                toggleModal={toggleEditCommentModal}
                modalOpen={editCommentOpen}
                user={user}
                commentIndex={activeIndex}
                comment={activeComment}
        />
      </Dialog>
  );
}