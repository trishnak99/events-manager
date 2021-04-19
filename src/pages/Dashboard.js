import React, {useState, useEffect} from "react";
// import { Button } from "../components/AuthForm";
import { useAuth } from "../context/auth";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import axios from 'axios';
import List from '@material-ui/core/List';
import CardHeader from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Logo from "../components/Logo";
import PeopleIcon from '@material-ui/icons/People';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import Button from '@material-ui/core/Button';
import GroupIcon from '@material-ui/icons/Group';
import TextField from "@material-ui/core/TextField";
import { Lock, TimelineSharp } from "@material-ui/icons";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import RSOs from './RSOs';
import AddRSO from './AddRSO';
import CreateEvent from '../components/CreateEvent';
import ViewEvent from './ViewEventFull';
import EventNoteIcon from '@material-ui/icons/EventNote';
import Avatar from '@material-ui/core/Avatar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CardActionArea from '@material-ui/core/CardActionArea';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    justifyContent:"space-between",
    paddingRight: '20px', // keep right padding when drawer closed
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
  drawer: {
    paddingTop:'250px',
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
      
    paddingTop:'20px',
    overflow: 'auto',
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  logo: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    width: '200px'
  },
  fixedHeight: {
    height: 240,
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    height: 240
  },
  card: {
    maxWidth: 400,
    height:275,
    borderColor:theme.palette.primary.main,
    borderWidth:'10px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    width: 500,
    height: 450,
  },
  gridCards: {
    flexGrow: 1,
    padding: theme.spacing(2)
  }
}));

function Dashboard(props) {
    const classes = useStyles();
    const { setAuthTokens } = useAuth();
    const [addRSOModalOpen, setAddRSOModalOpen] = useState(false);
    const [addEventModalOpen, setAddEventModalOpen] = useState(false);
    const [viewRSOsModalOpen, setViewRSOsModalOpen] = useState(false);
    const [viewEventModalOpen, setViewEventModalOpen] = useState(false);
    const [user, setUser] = useState({});
    const [events, setEvents] = useState([]);
    const [rsos, setRSOs] = useState([]);
    const [studentRSOs, setStudentRSOs] = useState({});
    const [allStudentRSOs, setAllStudentRSOs] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchType, setSearchType] = useState("Public");
    const [activeEvent, setActiveEvent] = useState({});
    
    const tempUser = JSON.parse(localStorage.getItem("tokens"));
    const history = useHistory();
    let axiosConfig = {
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
      }

    const categoryOptions = ['Team Building','Social', 'Fundraising', 'Workshop', 'Tech Talk', 'Seminar', 'General Body Meeting'];

    // function getCategoryIcon(category) {
    //     switch(expression) {
    //         case categoryOptions[0]:
    //           return <GroupIcon/>
    //         case y:
    //           return <
    //         default:
    //           // code block
    //     }
    // }

    useEffect(() => {

        axios.post("/api/GetUserInfo.php", {
                ID:tempUser.ID
            }).catch(e => {

            }).then((response) => {
            if (!response.data.error) {
                setUser(response.data[0]);
            }
        });

        axios.post("/api/GetLocation.php", {
            Description: "",
            Longitude: "",
            Latitude: ""
            }).catch(e => {

            }).then((response) => {
            if (!response.data.error) {
                setLocations(response.data);
            }
        });
    
        axios.post("/api/SearchRSO", {
          ID: "",
          Name: ""
        }).catch(e => {
    
        }).then((response) => {
          if (response.data && !(response.data.error && response.data.error.length() > 0)) {
            setRSOs(response.data);
          }
        });

        axios.post("/api/SearchStudentRSO", {
            ID: tempUser.ID
          }).catch(e => {
      
          }).then((response) => {
            if (response.data && !(response.data.error && response.data.error.length() > 0)) {
                setStudentRSOs(response.data);
            }
        });
        axios.post("/api/SearchStudentRSO", {
            ID: ""
          }).catch(e => {
      
          }).then((response) => {
            if (response.data && !(response.data.error && response.data.error.length() > 0)) {
                setAllStudentRSOs(response.data);
            }
        });
        axios.post("/api/SearchUniversity", {
            ID: "",
            Name: ""
          },axiosConfig).catch(e => {
      
          }).then((response) => {
            if (!response.data.error) {
                setUniversities(response.data);
            }
        });

        searchEvents(searchType);
    }, []);

    function logOut() {
        setAuthTokens(null);
        history.push('/login');
    }

    function toggleAddRSOModal(modalOpen) {
        setAddRSOModalOpen(modalOpen);
        if (!modalOpen) {
            axios.post("/api/SearchRSO", {
                ID: "",
                Name: ""
              }).catch(e => {
          
              }).then((response) => {
                if (response.data && !(response.data.error && response.data.error.length() > 0)) {
                  setRSOs(response.data);
                }
              });
            
              axios.post("/api/SearchStudentRSO", {
                ID: tempUser.ID
              }).catch(e => {
          
              }).then((response) => {
                if (response.data && !(response.data.error && response.data.error.length() > 0)) {
                    setStudentRSOs(response.data);
                }
            });
        }
        // axios.post("/api/SearchRSO.php", {
        //     ID: "",
        //     Name: ""
        //   },axiosConfig).catch(e => {
      
        //   }).then((response) => {
        //     if (!response.data.error) {
        //       setRSOs(response.data);
        //     }
        // });
    }
    function toggleAddEventModal(modalOpen) {
        setAddEventModalOpen(modalOpen);
        if (!modalOpen)
            searchEvents(searchType);
    }
    function toggleViewEventModal(event, modalOpen) {
        setViewEventModalOpen(modalOpen);
        setActiveEvent(event);
        if (!modalOpen) {

        }
    }
    function toggleViewRSOsModal(modalOpen) {
        setViewRSOsModalOpen(modalOpen);
        if (!modalOpen) {
            axios.post("/api/SearchStudentRSO", {
                ID: tempUser.ID
              }).catch(e => {
          
              }).then((response) => {
                if (response.data && !(response.data.error && response.data.error.length() > 0)) {
                    setStudentRSOs(response.data);
                }
            });
        }
    }

    function searchEvents(searchType) {
        var searchObj = {
            Location: "",
            UniversityName: "",
            EventType: searchType,
            RSOName: ""
          };
          setSearchType(searchType);
        if (searchType == 'Private') {
            searchObj.UniversityName = user.University;
        }
        else if(searchType == 'RSO') {
            searchObj.RSOName = user.RSO;
            if (user.RSO =="") {
                setFilteredEvents([]);
                return;
            }
        }

        axios.post("/api/SearchEvent", searchObj).catch(e => {
      
          }).then((response) => {
            if (Array.isArray(response.data)) {
              setEvents(response.data);
              if (searchType == "Private") {
                setFilteredEvents(response.data.filter(event => event.EventType != "RSO"));
              }
              else if (searchType == "RSO") {
                setFilteredEvents(response.data.filter(event => event.RSOName == user.RSO));
              }
              else {
                setFilteredEvents(response.data.filter(event => event.EventType == "Public"));
              }
            }
        });
    }

    function parseDayTime(date, time) {
        const dateArray = date.split("-").map((value) => parseInt(value));
        const timeArray = time.split(":").map((value) => parseInt(value));
        const myDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], timeArray[2]);
        return myDate.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
    }

    function getAbbrev(name) {
        const nameArray = name.split(" ");
        var abbrev = "";
        nameArray.forEach((part) => {
            const firstLetter = part.charAt(0);
            if(firstLetter == firstLetter.toUpperCase()) {
                abbrev += firstLetter;
            }
        });

        return abbrev.substring(0,3);
    }

    // function parseTime(time) {
    //     const timeArray = time.split(":");
    //     const hour = "";
    //     const min = "";
    //     const checkHour = parseInt(timeArray[0]);
    //     if (checkHour = 0) {
    //         hour = 12
    //     }
    //     if (checkHour > 12) {
    //         hour
    //     }
    // }

    return (
        // <div>
        //   <div>Admin Page</div>
        //   <Button onClick={logOut}>Log out</Button>
        // </div>
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="absolute" className={classes.appBar}>
                
                <Toolbar className={classes.toolbar}>
                    <Box width={200}>
                    <Grid container alignItems="center">
                        <Grid item>
                        <Avatar className={classes.logo}>
                            <EventNoteIcon />
                        </Avatar>
                        </Grid>
                        <Grid item>
                        <Typography variant="h6" align="left" noWrap>
                        EventTap
                    </Typography>
                        </Grid>
                    </Grid>
                    </Box>
                    <Typography variant="body1" align="center">
                        Hello, {user.FirstName}!
                    </Typography>
                    <Button variant="contained" size="small" onClick={logOut}>Log out</Button>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <List>
                        <ListItem 
                            button
                            key="Create Event"
                            onClick={(event) => toggleAddEventModal(true)}
                        >
                            <ListItemIcon><EventAvailableIcon /></ListItemIcon>
                            <ListItemText primary="Create Event" />
                        </ListItem>
                        <ListItem 
                            button
                            key="Create RSO"
                            onClick={(event) => toggleAddRSOModal(true)}
                        >
                            <ListItemIcon><GroupAddIcon/></ListItemIcon>
                            <ListItemText primary="Create RSO" />
                        </ListItem>
                        <Divider />
                        <ListItem 
                            button
                            key="View RSOs"
                            onClick={(event) => toggleViewRSOsModal(true)}
                        >
                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                            <ListItemText primary="View RSOs" />
                        </ListItem>
                    </List>
                </div>
        </Drawer>
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    {/* <Paper className={classes.paper}> */}
                
                        {/* </Paper> */}
                    <Grid container spacing={3}>
                        <Grid item xs={8}>
                            <Typography component="h1" variant="h4" color="inherit" noWrap className={classes.title}>
                            Events Dashboard
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                id="type"
                                select
                                label="Search Events By:"
                                value={searchType}
                                required
                                onChange={(event) => {
                                    searchEvents(event.target.value);
                                }}
                                SelectProps={{
                                    native: true,
                                }}
                                className={classes.paper}
                                >
                                {['Public', 'Private','RSO'].map((option) => (
                                    <option key={option} value={option}>
                                    {option}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        {/* <Grid item xs={6} className={{justifyContent: "space-between"}}>
                            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            Events Dashboard
                            </Typography>
                            <TextField
                                id="type"
                                select
                                label="Search Events By:"
                                value={searchType}
                                required
                                onChange={(event) => {
                                    searchEvents(event.target.value);
                                }}
                                SelectProps={{
                                    native: true,
                                }}
                                className={classes.paper}
                                >
                                {['Private', 'Public', 'RSO'].map((option) => (
                                    <option key={option} value={option}>
                                    {option}
                                    </option>
                                ))}
                            </TextField>
                        </Grid> */}
                    </Grid>
                    <div className={classes.gridCards}>
                        <Grid container spacing={3} direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                        >
                            {console.log(filteredEvents)}
                            {
                                (filteredEvents && filteredEvents.length > 0) ? filteredEvents.map((event) =>
                                <Grid item xs={4} key={event.EventID}>
                                    {/* <Paper className={classes.card}>
                                            {console.log('hi i rendered')}
                                                <Typography variant="h6" color="textSecondary" component="p">
                                                    {event.Category} Event
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    {event.Description}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    {event.Location}, {parseDayTime(event.Date, event.StartTime)}
                                                </Typography> */}
                                        {/* <CardHeader
                                            // avatar={
                                            //     <Avatar aria-label="recipe" className={classes.avatar}>
                                            //     R
                                            //     </Avatar>
                                            // }
                                            // action={
                                            //     <IconButton aria-label="settings">
                                            //     <MoreVertIcon />
                                            //     </IconButton>
                                            // }
                                            title={event.Name}
                                            subheader={event.EventType != "RSO" ? event.UniversityName : event.RSOName}
                                        /> */}
                                        {/* <CardMedia
                                            className={classes.media}
                                            image="/static/images/cards/paella.jpg"
                                            title="Paella dish"
                                        /> */}
                                        {/* <Button size="small" color="primary" onClick={() => toggleViewEventModal(true)}>
                                                    View Event
                                                </Button>
                                    </Paper> */}
                                    <Card className={classes.card}>
                                        <CardActionArea>
                                        <CardHeader
                                            avatar={
                                                <Avatar aria-label="recipe" className={classes.avatar}>
                                                    {event.EventType != "RSO" ? getAbbrev(event.UniversityName): getAbbrev(event.RSOName)}
                                                </Avatar>
                                            }
                                            // action={
                                            //     <IconButton aria-label="settings">
                                            //     <MoreVertIcon />
                                            //     </IconButton>
                                            // }
                                            title={event.Name}
                                            titleTypographyProps={{color:"primary", variant:"h6", noWrap: true}}
                                            subheader={event.EventType != "RSO" ? event.UniversityName : event.RSOName}
                                            subheaderTypographyProps={{color:"secondary"}}
                                        />
                                        <Divider/>
                                            <CardContent>
                                            {console.log('hi i rendered')}
                                                <Typography variant="h6" color="textSecondary" component="p">
                                                    {event.Category} Event
                                                </Typography>
                                                {/* <Typography variant="body1" color="textSecondary" component="p" noWrap gutterBottom>
                                                    {event.Description}
                                                </Typography> */}
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    {event.Location}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    {parseDayTime(event.Date, event.StartTime)}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                        {/* <CardMedia
                                            className={classes.media}
                                            image="/static/images/cards/paella.jpg"
                                            title="Paella dish"
                                        /> */}
                                        <CardActions>
                                                <Button size="medium" color="primary" onClick={() => toggleViewEventModal(event, true)}>
                                                    View Event
                                                </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                                )
                                :
                                <Grid item xs={12}>
                                    <Typography align="center">
                                    There are no events to display
                                </Typography>
                                </Grid>

                            }
                    </Grid>
                    </div>
                    <CreateEvent 
                        locations={locations} 
                        universities={universities} 
                        rsos={rsos} 
                        studentRSOs={studentRSOs}
                        toggleModal={toggleAddEventModal}
                        modalOpen={addEventModalOpen}
                        user={user}
                    />
                    <AddRSO
                        locations={locations} 
                        universities={universities} 
                        rsos={rsos} 
                        studentRSOs={studentRSOs}
                        toggleModal={toggleAddRSOModal}
                        modalOpen={addRSOModalOpen}
                        user={user}
                    />
                    <RSOs
                        locations={locations} 
                        universities={universities} 
                        rsos={rsos} 
                        studentRSOs={studentRSOs}
                        toggleModal={toggleViewRSOsModal}
                        modalOpen={viewRSOsModalOpen}
                        user={user}
                    />
                    <ViewEvent
                        locations={locations} 
                        universities={universities} 
                        rsos={rsos} 
                        studentRSOs={allStudentRSOs}
                        event={activeEvent}
                        toggleModal={toggleViewEventModal}
                        modalOpen={viewEventModalOpen}
                        user={user}
                    />
                </Container>
            </main>
        </div>
    );
}

export default Dashboard;