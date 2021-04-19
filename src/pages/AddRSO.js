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
import { ContactPhone } from '@material-ui/icons';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

export default function AddRSO(props) {
  const classes = useStyles();
  const currentDate = new Date();
  const user = props.user;

  const [description, setDescription] = useState("");
  const [university, setUniversity] = useState("");
  const [name, setName] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [error, setError] = useState(false);
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

  const locationOptions = props.locations;
  const rsoOptions = props.rsos;
  const universityOptions = props.universities;

  const createRSO = () => {
    // if (type != "RSO" || (user.Rank == 1 && rso == user.RSOName)) {
      axios.post("/api/AddRSO.php", {
        Name: name,
        Description: description,
        Domain: emailDomain
      },axiosConfig).catch(e => {
          setError(true);
          setAlertOpen(true);
          setAlertMessage("Unable to create RSO.");
      }).then((response) => {
        if (typeof response == 'object') {
          axios.post("/api/SearchRSO.php", {
            ID: "",
            Name: name
          },axiosConfig).catch(e => {
              setError(true);
              setAlertOpen(true);
              setAlertMessage("Unable to create RSO.");
          }).then((rsoRes) => {
            if (typeof rsoRes == 'object') {
              axios.post("/api/JoinRSO.php", {
                ID: user.ID,
                RSOName: name
              },axiosConfig).catch(e => {
                  setError(true);
                  setAlertOpen(true);
                  setAlertMessage("Unable to create RSO.");
              }).then((response) => {
                if (typeof response == 'object') {
                  axios.post("/api/ElevateRank.php", {
                    ID: user.ID,
                    RSOID: rsoRes.data.find(rso => rso.Name == name).ID
                  },axiosConfig).catch(e => {
                      setError(true);
                      setAlertOpen(true);
                      setAlertMessage("Unable to create RSO.");
                  }).then((response) => {
                    if (typeof response == 'object') {
                      setAlertOpen(true);
                      setError(false);
                      setAlertMessage('RSO successfully created!');
                      clearModal();
                      props.toggleModal(false);
                    } else {
                      setError(true);
                      setAlertOpen(true);
                      setAlertMessage(response.data.error);
                    }
                  });
                } else {
                  setError(true);
                  setAlertOpen(true);
                  setAlertMessage(response.data.error);
                }
              });
            } else {
              setError(true);
              setAlertOpen(true);
              setAlertMessage(rsoRes.data.error);
            }
          });
        } else {
          setError(true);
          setAlertOpen(true);
          setAlertMessage(response.data.error);
        }
      });
    // else {
    //   setError(true);
    //   setAlertOpen(true);
    //   setAlertMessage("Unable to create event: User is not an RSO admin or RSO is inactive");
    // }
  }

  const clearModal = () => {
    
    setDescription("");
    
    setName("");
    setEmailDomain("");
    
    setError(false);
    setAlertOpen(false);
  }

  return (
      <Dialog open={props.modalOpen} onClose={() => {clearModal(); props.toggleModal(false)}} maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create RSO</DialogTitle>
        <DialogContent>
            {
                alertOpen &&
                <Alert severity={error ? "error" : "success"}>{alertMessage}</Alert>
            }
            <form className={classes.container} noValidate>
                <TextField
                    autoFocus
                    margin="normal"
                    id="name"
                    label="Name"
                    type="text"
                    fullWidth
                    required
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                />
                <TextField
                    margin="normal"
                    id="description"
                    label="Description"
                    type="text"
                    multiline
                    fullWidth
                    required
                    onChange={(event) => {
                      setDescription(event.target.value);
                    }}
                />
                <TextField
                    margin="normal"
                    id="domain"
                    label="Email Domain"
                    type="text"
                    fullWidth
                    required
                    helperText="The email domain is used to match your university's students"
                    onChange={(event) => {
                      setEmailDomain(event.target.value);
                    }}
                />
                <TextField
                    autoFocus
                    margin="normal"
                    id="AdminName"
                    label="Admin Name"
                    type="text"
                    fullWidth
                    required
                    disabled
                    helperText="You will be the admin of this RSO"
                    value={user.FirstName + " " + user.LastName}
                />
                
                
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.toggleModal(false)} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={createRSO} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
  );
}