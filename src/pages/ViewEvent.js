import React, { useState } from "react";
// import { Button } from "../components/AuthForm";
import { useAuth } from "../context/auth";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import AddCommentIcon from '@material-ui/icons/AddComment';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
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
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
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

function ViewEvent(props) {
    const classes = useStyles();
    // const [event, setEvent] = useState({});
    const [user, setUser] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(null);

    const event = props.event;

    <div className={classes.root}>
        <CssBaseline />
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Chart />
                        </Paper>
                    </Grid>
                    {
                      comments && comments.map((comment) => 
                        <Grid item xs={12}>
                          <Paper className={classes.paper}>
                              <form className={classes.form} noValidate>
                                  <TextField
                                      margin="normal"
                                      required
                                      fullWidth
                                      id="newComment"
                                      label="Comment"
                                      name="newComment"
                                      
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
                                  <Button
                                      type="submit"
                                      variant="contained"
                                      color="primary"
                                      className={classes.submit}
                                  >
                                      Add Comment
                                  </Button>
                              </form>
                          </Paper>
                        </Grid>
                      )
                    }
                    {/* <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <form className={classes.form} noValidate>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
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
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Add Comment
                                </Button>
                            </form>
                        </Paper>
                    </Grid> */}
                </Grid>
            </Container>
        </main>

    </div>
}