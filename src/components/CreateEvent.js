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

export default function CreateEvent(props) {
  const classes = useStyles();
  const currentDate = new Date();
  const user = props.user;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("Public");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [university, setUniversity] = useState("");
  const [rso, setRso] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  // const [locationOptions, setLocationOptions] = useState([]);
  // const [rsoOptions, setRsoOptions] = useState([]);
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

  useEffect(() => {
    // axios.post("/api/GetLocation.php", {
    //   Description: "",
    //   Longitude: "",
    //   Latitude: ""
    // },axiosConfig).catch(e => {

    // }).then((response) => {
    //   if (!response.data.error) {
    //     setLocationOptions(response.data);
    //   }
    // });

    // axios.post("/api/SearchRSO.php", {
    //   ID: "",
    //   Name: ""
    // },axiosConfig).catch(e => {

    // }).then((response) => {
    //   if (!response.data.error) {
    //     setRsoOptions(response.data);
    //   }
    // });
  }, []);

  const locationOptions = props.locations;
  const rsoOptions = props.rsos;
  const universityOptions = props.universities;

  const createEvent = () => {
    // if (type != "RSO" || (user.Rank == 1 && rso == user.RSOName)) {
      axios.post("/api/AddEvent.php", {
        EventType: type,
        Name: name,
        Category: category,
        Description: description,
        StartTime: start,
        EndTime: end,
        Date: date,
        Location: location,
        ContactPhone: phone,
        ContactEmail: email,
        UniversityName: university,
        RSOName: (type =="RSO" ? rso : ""),
        UserID: user.ID
      },axiosConfig).catch(e => {
          setError(true);
          setAlertOpen(true);
          setAlertMessage("Unable to create event.");
      }).then((response) => {
        if (!response.data.error) {
          setAlertOpen(true);
          setAlertMessage('Event successfully created!');
          clearModal();
          props.toggleModal(false);
        } else {
          setError(true);
          setAlertOpen(true);
          setAlertMessage(response.data.error);
        }
      });
    // }
    // else {
    //   setError(true);
    //   setAlertOpen(true);
    //   setAlertMessage("Unable to create event: User is not an RSO admin or RSO is inactive");
    // }
  }

  const clearModal = () => {
    setEmail("");
    setPhone("");
    setType("");
    setDescription("");
    setDate("");
    setStart("");
    setEnd("");
    setLocation("");
    setCategory("Public");
    setName("");
    setUniversity("");
    setRso("");
    setError(false);
    setAlertOpen(false);
  }

  const categoryOptions = ['Team Building','Social', 'Fundraising', 'Workshop', 'Tech Talk', 'Seminar', 'General Body Meeting'];

  return (
      <Dialog open={props.modalOpen} onClose={() => {clearModal(); props.toggleModal(false)}} maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Event</DialogTitle>
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
                  id="type"
                  select
                  label="Event Type"
                  value={type}
                  fullWidth
                  required
                  margin="normal"
                  onChange={(event) => {
                    setType(event.target.value);
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  {['Public', 'Private', 'RSO'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
                {
                  type == "RSO" &&
                  <TextField
                    id="type"
                    select
                    label="RSO"
                    margin="normal"
                    value={rso}
                    fullWidth
                    required
                    onChange={(event) => {
                      setRso(event.target.value);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option key={""} value={""}>
                          {""}
                      </option>
                    {rsoOptions.map((option) => (
                      <option key={option.Name} value={option.Name}>
                        {option.Name}
                      </option>
                    ))}
                  </TextField>
                }
                <TextField
                  id="category"
                  select
                  label="Category"
                  value={category}
                  fullWidth
                  required
                  margin="normal"
                  onChange={(event) => {
                    setCategory(event.target.value);
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option key={""} value={""}>
                          {""}
                      </option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
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
                  id="location"
                  select
                  margin="normal"
                  label="Location"
                  value={location}
                  fullWidth
                  onChange={(event) => {
                    setLocation(event.target.value);
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                    <option key={""} value={""}>
                          {""}
                      </option>
                  {locationOptions.map((option) => (
                    <option key={option.ID} value={option.Description}>
                      {option.Description}
                    </option>
                  ))}
                </TextField>
                <Grid container spacing={3}>
                  <Grid  item xs={6}>
                  <TextField
                    id="date"
                    label="Event Date"
                    type="date"
                    margin="normal"
                    fullWidth
                    defaultValue={currentDate.toISOString().split('T')[0]}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    required
                    onChange={(event) => {
                      setDate(event.target.value);
                    }}
                />
                  </Grid>
                  <Grid  item xs={3}>
                  <TextField
                    id="timeStart"
                    label="Event Start"
                    type="time"
                    margin="normal"
                    defaultValue="12:00"
                    required
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(event) => {
                      setStart(event.target.value);
                    }}
                />
                  </Grid>
                  <Grid item xs={3}>
                  <TextField
                    margin="normal"
                    id="timeEnd"
                    type="time"
                    label="Event End"
                    defaultValue="13:00"
                    required
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(event) => {
                      setEnd(event.target.value);
                    }}
                />
                  </Grid>
                </Grid>
                
                <TextField
                    margin="normal"
                    id="email"
                    label="Contact Email"
                    type="email"
                    fullWidth
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    required
                />
                <TextField
                    margin="normal"
                    id="phone"
                    label="Contact Phone"
                    type="phone"
                    fullWidth
                    helperText="ex. 4073421231"
                    onChange={(event) => {
                      setPhone(event.target.value);
                    }}
                    required
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  select
                  name="university"
                  label="University Name"
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
                      {universityOptions && universityOptions.map((option) => (
                        <option key={option.ID} value={option.Name}>
                          {option.Name}
                        </option>
                      ))}
                </TextField>
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.toggleModal(false)} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={createEvent} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
  );
}