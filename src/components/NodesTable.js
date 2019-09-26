import React from "react";
import { forwardRef } from "react";
import MaterialTable from "material-table";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { makeStyles } from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Attr } from "./Elements";
import { withStyles } from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { flattenObject } from "../lib/utils";
const { clipboard } = window.require("electron");

function copyToClip(text) {
  clipboard.writeText(text.toString());
}
const ExpansionPanel = withStyles({
  root: {
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    minHeight: 20,
    "&$expanded": {
      minHeight: 20
    }
  },
  content: {
    "&$expanded": {
      margin: "0"
    }
  },
  expanded: {}
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(1)
  }
}))(MuiExpansionPanelDetails);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  details: {
    padding: theme.spacing(2)
  },
  box: {
    border: "1px solid rgba(0, 0, 0, .125)",
    padding: theme.spacing(2)
  },
  box2: {
    border: "1px solid rgba(0, 0, 0, .125)",
    padding: theme.spacing(0)
  },
  grid2: {
    border: 0,
    padding: theme.spacing(0)
  }
}));

function getLast(data, loc = 1) {
  return data[data.length - loc];
}

function statusFormat(status, code) {
  if (code != null) {
    if (code === 0) {
      return (
        <span>
          {status}&nbsp;&nbsp;(
          <span style={{ color: "green" }}>
            <b>{code}</b>
          </span>
          )
        </span>
      );
    } else {
      return (
        <span>
          {status}&nbsp;&nbsp;(
          <span style={{ color: "red" }}>
            <b>{code}</b>
          </span>
          )
        </span>
      );
    }
  } else if (status === undefined) {
    return "";
  } else {
    return `${status}`;
  }
}

// Define recursive function to print nested values

function createData(property, content) {
  return { property, content };
}

function DetailsPanel(props) {
  const rowData = props.data;
  const classes = useStyles();
  function getMetadata(data) {
    var mRows = [];
    var obj = flattenObject(data);
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        mRows.push(createData(key, obj[key]));
      }
    }
    return mRows;
  }

  const rows = [
    createData("uuid", rowData.uuid),
    createData("Node Type", rowData.node_type),
    createData("Created", rowData.ctime.toString()),
    createData("Modified", rowData.mtime.toString()),
    createData("Label", rowData.label),
    createData("Description", rowData.description)
  ];
  return (
    <div className={classes.details}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box
            style={{ height: 300 }}
            component="div"
            overflow="scroll"
            className={classes.box2}
          >
            <ExpansionPanelSummary id="panel1a-header">
              <Typography className={classes.heading}>Summary</Typography>
            </ExpansionPanelSummary>
            <List dense={true}>
              <ListItem>
                <ListItemText
                  primary={
                    <span>
                      <span onClick={() => copyToClip(rowData.id)}>
                        <Attr>PK</Attr>
                      </span>{" "}
                      {rowData.id}
                    </span>
                  }
                />
                <ListItemText
                  primary={
                    <span>
                      <span onClick={() => copyToClip(rowData.user_id)}>
                        <Attr>User ID</Attr>
                      </span>{" "}
                      {rowData.user_id}
                    </span>
                  }
                />
              </ListItem>
              {rows.map(
                row =>
                  row.content !== "" && (
                    <ListItem key={"key" + row.property}>
                      <ListItemText
                        primary={
                          <span>
                            <span onClick={() => copyToClip(row.content)}>
                              <Attr>{row.property}</Attr>
                            </span>{" "}
                            {row.content}
                          </span>
                        }
                      />
                    </ListItem>
                  )
              )}

              {rowData.node_type.split(".")[0] === "process" && (
                <ListItem>
                  <ListItemText
                    primary={
                      <span>
                        <span onClick={() => copyToClip(rowData.process_type)}>
                          <Attr>Process Type</Attr>
                        </span>{" "}
                        {rowData.process_type}
                      </span>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </Grid>
        <Grid className={classes.grid2} item xs={12} sm={6}>
          <Box
            style={{ height: 300 }}
            component="div"
            overflow="scroll"
            className={classes.box2}
          >
            <div>
              <ExpansionPanel square>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>Files</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>Input Files and Output files</Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel square defaultExpanded={true}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography className={classes.heading}>Metadata</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <List dense={true}>
                    {getMetadata(rowData.attributes).map(row => (
                      <ListItem key={"key" + row.property}>
                        <ListItemText
                          primary={
                            <span>
                              <span onClick={() => copyToClip(row.content)}>
                                <Attr>{row.property}</Attr>
                              </span>{" "}
                              {row.content}
                            </span>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  ); //<div>{rowData.node_type}</div>;
}

export default function NodesTable(props) {
  var allNodes = props.data;
  var isDetailsPanel = props.detailsPanel;

  const classes = useStyles();
  return (
    <MaterialTable
      className={classes.root}
      title="Nodes"
      localization={{
        pagination: {
          previousTooltip: "",
          nextTooltip: "",
          firstTooltip: "",
          lastTooltip: ""
        },
        toolbar: {
          searchTooltip: ""
        }
      }}
      options={{
        pageSize: 15,
        pageSizeOptions: [],
        sorting: true,
        grouping: false
      }}
      icons={{
        SortArrow: forwardRef((props, ref) => (
          <ExpandLessIcon {...props} ref={ref} />
        ))
      }}
      columns={[
        { title: "PK", field: "id", type: "numeric", defaultSort: "desc" },
        { title: "Modified", field: "mtime", type: "datetime" },
        {
          title: "Node Type",
          field: "node_type",
          render: rowData => (
            <span>{getLast(rowData.node_type.split("."), 2)}</span>
          )
        },
        { title: "Label", field: "label" },
        {
          title: "Status",
          field: "attributes.process_state",
          render: rowData => (
            <span>
              {statusFormat(
                rowData.attributes.process_state,
                rowData.attributes.exit_status
              )}
            </span>
          )
        }
      ]}
      data={allNodes}
      detailPanel={[
        {
          icon: () =>
            !isDetailsPanel ? (
              <ChevronRightIcon color="secondary" fontSize="small" />
            ) : (
              ""
            ),
          render: rowData => {
            if (!isDetailsPanel) {
              return <DetailsPanel data={rowData} />;
            } else {
              return false;
            }
          }
        }
      ]}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
    />
  );
}
