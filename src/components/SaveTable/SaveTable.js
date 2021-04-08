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
          <Typography component={'span'}>{children}</Typography>
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

  const loadedName = useSelector(state => state.loadedName)

  const loadedKeys = useSelector(state => state.loadedKeys);

  const [toSaveName, setToSaveName] = React.useState(loadedName);

  const [popUpIsOpen, setPopUpIsOpen] = React.useState(false);

  const [saveAs, setSaveAs] = React.useState(false);

  const [nameIsTaken, setNameIsTaken] = React.useState(false);

  const [tableIsSaved, setTableIsSaved] = React.useState(false);

  const [isTableOverWritten, setIsTableOverWritten] = React.useState(false);


  React.useEffect(() => {
    setToSaveName(loadedName);
    setNameIsTaken(false);
    setTableIsSaved(false);
    setIsTableOverWritten(false);
  }, [popUpIsOpen])


  function removeCircularReference(data) {
    let dataToSave = {};
    console.log(data);
    Object.assign(dataToSave, data);
    const keys = loadedKeys.map((col) => {
      return col.id;
    })
    for (let i = 0; i < data.length; i++) {
      let newRow = {};
      Object.assign(newRow, data[i]);
      for (const cell of keys) {
        if ((typeof (data[i][cell] !== String) || typeof (data[i][cell] !== Number))) {
          newRow[cell] = "";
        }
      }
      dataToSave[i] = newRow
    }
    return dataToSave;
  }

  //Facciamo una funzione per salvare la tabella, dovrà inviare una post (con axios) al server */
  function handleSave() {
    axios.post(`http://localhost:3001/save/${toSaveName}`, {
      data: removeCircularReference(loadedTable),
    })
      .then((res) => {
        if (res.data.nameIsTaken) {
          setNameIsTaken(true);
        }
        else if (!res.data.nameIsTaken && res.data.success) {
          setTableIsSaved(true);
        } else {
          alert("An error occured in saving table, try again later")
        }
      })

  }

  function handleSaveForce() {
    axios.post(`http://localhost:3001/save/force/${toSaveName}`, {
      data: removeCircularReference(loadedTable),
    })
      .then((res) => {
        if (res.data.nameIsTaken && res.data.success) {
          setTableIsSaved(true);
          setIsTableOverWritten(true);
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
                <Tabs TabIndicatorProps={{style: {background:'#042650'}}} value={value} className={classes.overrides} onChange={handleChange} aria-label="simple tabs example">
                  <Tab className={style.tab} label="Save" {...a11yProps(0)} />
                  <Tab className={style.tab} label="Save as" {...a11yProps(1)} />

                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0}>
                {
                  //table is not already saved
                  !tableIsSaved && !nameIsTaken &&
                  <>

                    <p>
                      Click the button to save <b>{loadedName}</b> table: <br />
                    </p>
                    <button onClick={(e) => { handleSave(); }} className={style.saveButton}>
                      Save
                        </button>
                  </>
                }
                {// name of the table is already choosen
                  nameIsTaken && !tableIsSaved &&
                  <>
                    <p>
                      <b>{loadedName}</b> already exist. Do you want to overwrite your table?
                  </p>
                    <button className ={"secondaryButton"} onClick={(e) => { setIsTableOverWritten(false); setTableIsSaved(false); handleChange(e, 1); }}>
                      No
                  </button>

                    <button className={style.saveButton} style={{margin:0}} onClick={(e) => { handleSaveForce() }}>
                      Yes
                  </button>
                  </>
                }
                { // table is saved succ. without overwritting
                  tableIsSaved && !isTableOverWritten &&
                  <>
                    <div>
                      Table {toSaveName} saved successfully.
                  </div>
                    <button onClick={(e) => { setPopUpIsOpen(false); setIsTableOverWritten(false); setNameIsTaken(false); setTableIsSaved(false); }} className={style.saveButton}>
                      Ok
                  </button>
                  </>
                }
                { //table has been saved and overwritten
                  tableIsSaved && isTableOverWritten &&
                  <div>
                    <p>
                      Table <b>{loadedName}</b> overwritten successfully.
                    </p>
                    <button onClick={(e) => { setPopUpIsOpen(false); setIsTableOverWritten(false); setNameIsTaken(false); setTableIsSaved(false) }} className={style.saveButton}>
                      Ok
                  </button>
                  </div>

                }
                <div className={style.clear}>

                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                {
                  nameIsTaken &&
                  <p>
                    Choosen name is taken, please choose another name.
                  </p>
                }
                {
                  !tableIsSaved &&
                  <>
                    <label>
                      Choose a name to save your table: </label>
                    <input type="text" onChange={(e) => { setToSaveName(e.target.value) }} placeholder="my-table" />
                    <button className={style.saveButton} onClick={(e) => { handleSave() }}>
                      Save
                   </button>
                  </>
                }
                {
                  tableIsSaved &&
                  <>
                    <p>
                      Table {toSaveName} saved successfully.
                  </p>
                    <button onClick={(e) => { setPopUpIsOpen(false); setIsTableOverWritten(false); setNameIsTaken(false); setTableIsSaved(false) }} className={style.saveButton}>
                      Ok
                  </button>
                  </>
                }
                <div className={style.clear}>

                </div>

              </TabPanel>
            </div>
          }
        </div>
      </div>
    }

      <button onClick={(e) => { setPopUpIsOpen(!popUpIsOpen); setTableIsSaved(false) }}>Save Table</button>
    </>
  )
}

export default SaveTable;