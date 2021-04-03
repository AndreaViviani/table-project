import style from "./SaveTable.module.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  }));


//This component will have function to merge table, reset table with the original and save on the server
function SaveTable() {

    const loadedTable = useSelector(state => state.loadedTable);

    const [toSaveName, setToSaveName] = React.useState("");

    const [popUpIsOpen, setPopUpIsOpen] = React.useState(false);

    const [saveAs, setSaveAs] = React.useState(false);


    //Facciamo una funzione per salvare la tabella, dovrà inviare una post (con axios) al server */
    function handleSave() {
        console.log('ciao');
        axios.post(`http://localhost:3001/save/${toSaveName}`, {
            data: loadedTable,
        })
            .then((res) => {
                if (res.data.nameIsTaken) {
                    alert("This name has already been taken, choose a different name");
                }
                else if (!res.data.nameIsTaken && res.data.success) {
                    alert(`${toSaveName} table saved successfully`)
                } else {
                    alert("An error occured in saving table, try again later")
                }
            })

    }

    /*function handleChange(e) {
        setToSaveName(e.target.value);
    }*/

    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };



    return (
        <>{
            popUpIsOpen &&
            <div className={"overlay"} onClick={(e) => { setPopUpIsOpen(false) }}>
                <div className={`panel ${style.savePanel}`} onClick={(e) => { e.stopPropagation(); }}>
                    {!saveAs &&
                        <div className={classes.root}>
                        <AppBar position="static" className={style.appBar}>
                          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                            <Tab className={style.tab} label="Save" {...a11yProps(0)} />
                            <Tab className={style.tab} label="Save as" {...a11yProps(1)} />

                          </Tabs>
                        </AppBar>
                        <TabPanel value={value} index={0}>
                          Item One
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                          Item Two
                        </TabPanel>
                      </div>
                    }
                </div>
            </div>
        }

            <button onClick={(e) => { setPopUpIsOpen(!popUpIsOpen) }}>Save Table</button>
        </>
    )
}

export default SaveTable;