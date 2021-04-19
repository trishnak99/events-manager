import React, { useState, useEffect} from 'react';
import Link from '@material-ui/core/Link';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Chip from '@material-ui/core/Chip';

let axiosConfig = {
    headers: {
        "Access-Control-Allow-Origin": "*",
    }
  }

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function RSOs(props) {
    const classes = useStyles();

    const user = props.user;
    const rsos = props.rsos;
    const [studentRso, setStudentRSO] = useState("");
    // } else {
    //     studentRsos.push(props.studentRSOs);
    // }
    // const [rsos, setRsos] = useState([]);
    // const [studentRsos, setStudentRsos] = useState([]);
    // if (props.studentRSOs && Array.isArray(props.studentRSOs)) {
    //     setStudentRSO(props.studentRSOs.find(value => value.ID == user.ID).RSO);
    // }

    useEffect(() => {
        // const myRSOs = studentRsos.filter(value => value.ID == user.ID);
        if (props.studentRSOs && Array.isArray(props.studentRSOs)) {
            setStudentRSO(props.studentRSOs.find(value => value.ID == user.ID).RSO);
        }
    
        // axios.post("/api/SearchRSO.php", {
        //   ID: "",
        //   Name: ""
        // },axiosConfig).catch(e => {
    
        // }).then((response) => {
        //   if (!response.data.error) {
        //     setRsos(response.data);
        //   }
        // });

        // axios.post("/api/SearchStudentRSO.php", {
        //     ID: user.ID,
        //     FirstName: user.FirstName,
        //     LastName: user.LastName
        //   },axiosConfig).catch(e => {
      
        //   }).then((response) => {
        //     if (!response.data.error) {
        //         const rsoList = processRsos(response.data);
        //         setStudentRsos(response.data);
        //     }
        //   });
      }, [props]);

      const joinRSO = (rsoName) => {
          const newRSO = {
            ID: user.ID,
            RSOName: rsoName
          }
        axios.post("/api/JoinRSO.php", newRSO,axiosConfig).catch(e => {
      
          }).then((response) => {
              setStudentRSO(rsoName);
            // if (!response.data.error) {
            //     const newArray = studentRsos;
            //     newArray.push(newRSO);
            //     setStudentRSOs(newArray);
            // }
          });
      }

      const leaveRSO = (rsoName) => {
        axios.post("/api/LeaveRSO.php", {
            ID: user.ID,
            RSOName: rsoName
        },axiosConfig).catch(e => {
      
        }).then((response) => {
            if (response.data && !response.data.error) {
                setStudentRSO("");
            }
        });
      }
      
      const formatDescription = (row) => {
        return (row.Description ? row.Description : "(No Description Found)");
      }

    return (
        <Dialog open={props.modalOpen} onClose={() => {props.toggleModal(false)}} maxWidth="md" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">View All RSOs</DialogTitle>
        <DialogContent>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>RSO Name</TableCell>
                        <TableCell size="medium">Description</TableCell>
                        {/* <TableCell>Status</TableCell> */}
                        <TableCell size="medium">Join/Leave</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {rsos.map((row) => (
                    <TableRow key={row.ID}>
                        <TableCell>{row.Name}</TableCell>
                        <TableCell
                            size="medium"
                        >{formatDescription(row)}</TableCell>
                        {/* <TableCell>
                            <Chip
                                label={comment.status == activeStatus ? "Active" : "Inactive"}
                                color={comment.status == activeStatus ? "success" : "error"}
                            />
                        </TableCell> */}
                        <TableCell size="medium">
                            {console.log(studentRso)}
                            {
                                (studentRso == row.Name) ?
                                <Button variant="contained" color="default" onClick={() => leaveRSO(row.Name)}>
                                    Leave
                                </Button>
                                :
                                <Button variant="contained" color="secondary" onClick={() => joinRSO(row.Name)}>
                                    Join
                                </Button>
                            }
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.toggleModal(false)} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
}