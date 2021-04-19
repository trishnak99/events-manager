import React from 'react';
import Typography from '@material-ui/core/Typography';
import EventNoteIcon from '@material-ui/icons/EventNote';
import Avatar from '@material-ui/core/Avatar';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

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
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  
}));
function Logo(props) {
  const classes = useStyles();
    return (
      <Grid container direction="row" alignItems="center" zeroMinWidth>
        <Grid item xs={1}>
        <Avatar className={classes.avatar}>
          <EventNoteIcon />
        </Avatar>
        </Grid>
        <Grid item xs={2}>
        <Typography variant={props.variant} align={props.align}>
        
        EventTap
    </Typography>
        </Grid>
      </Grid>
    );
}

export default Logo;