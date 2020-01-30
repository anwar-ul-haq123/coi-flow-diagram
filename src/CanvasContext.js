import React from "react";
import * as actions from "./actions";
import mapValues from "./utils/mapValues";
import uuid from "uuid";
import _ from "lodash";

class ConvasProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: {
        x: 0,
        y: 0
      },
      nodes: {},
      links: {},
      selected: {},
      hovered: {},
      fields: {
        flow: {},
        condition: {}
      }
    };
    this.config = {};
    this.validatePortData = this.validatePortData.bind(this);
    this.onPortSelect = this.onPortSelect.bind(this);
    this.createPort = this.createPort.bind(this);
    this.onPortSave = this.onPortSave.bind(this);
    this.onConditionFieldChange = this.onConditionFieldChange.bind(this);
    this.saveRecordToNode = this.saveRecordToNode.bind(this);
    this.getPortsOfSelectedNode = this.getPortsOfSelectedNode.bind(this);
    this.onFlowFieldsChange = this.onFlowFieldsChange.bind(this);
    this.deletePort = this.deletePort.bind(this);
    this.stateActions = mapValues(actions, func => (...args) =>
      this.setState(func(...args))
    );
  }

  getPortsOfSelectedNode() {
    const store = _.cloneDeep(this.state);
    console.log(store)
    if (store.selected.id && store.selected.type === 'node') {
      const nodes = store.nodes[store.selected.id];
      const ports = nodes.ports;
      const portKeys = Object.keys(ports);
      if (portKeys.length === 0) return <span />;
      return (
        <ul
          style={{
            listStyle:
              "square outside url(https://cdn.bitdegree.org/learn/list-style-image-marker-1.png?426d93cd) "
          }}
        >
          {portKeys.map(portId => (
            <React.Fragment key={portId}>
              <div style={{ display: "inline-block" }}>
                <li value={portId}>{ports[portId].field}</li>
              </div>
              <div
                className="dot"
                style={{ float: "right", backgroundColor: "red" }}
                onClick={() => this.deletePort(portId, store.selected.id)}
              ></div>
            </React.Fragment>
          ))}
        </ul>
      );
    }
      return ""
  }

  //@TODO delete the link if there is link between two ports
  deletePort(portId, nodeId) {
    this.setState(pState => {
      const nodes = _.cloneDeep(pState.nodes);
      const links = _.cloneDeep(pState.links);
      const node = nodes[nodeId];
      Object.keys(links).map(linkId => {
        const link = links[linkId];
        if (link.from.nodeId === node.id || link.to.nodeId === node.id) {
          delete links[linkId];
        }
      });
      delete node.ports[portId];
      nodes[nodeId] = node;
      return { nodes, links };
    });
  }

  saveRecordToNode() {
    this.setState(
      pState => {
        const state = _.cloneDeep(pState);
        const { fields, selected, nodes } = state;
        if (!selected.id) return;
        const node = nodes[selected.id];
        const { newPort, condition, flow } = fields;
        if (
          newPort &&
          Object.entries(newPort).length > 0 &&
          this.validatePortData()
        ) {
          this.createPort(newPort, selected.id);
        }
        // if node is condition
        if (node.type === "condition") {
          node.condition = { ...condition };
        } else {
          node.fields = { ...flow };
        }
        nodes[selected.id] = node;
        return { nodes };
      },
      () => {
        console.log("State Updated ", this.state);
      }
    );
  }

  validatePortData() {
    const {
      fields: { newPort }
    } = this.state;
    if (!newPort || !newPort.field) {
      return false;
    }
    return true;
  }

  createPort(newPort, selectedId) {
    this.setState(pState => {
      const nodes = _.cloneDeep(pState.nodes);
      const node = nodes[selectedId];
      node.size.height += 1; // @TODO figure out best possible solution
      const portId = uuid.v4();
      const port = {};
      port.id = portId;
      port.field = newPort.field;
      if (newPort.field === "input") {
        port.type = "top";
      } else if (
        newPort.field === "output" &&
        newPort.properties &&
        newPort.properties.value === "no"
      ) {
        port.type = "left";
      } else {
        port.type = "bottom";
      }
      port.properties = newPort.properties;
      node.ports[portId] = port;
      nodes[selectedId] = node;
      return { nodes };
    });
  }

  onPortSave() {
    // validate the data
    if (this.validatePortData()) {
      this.createPort();
    }
  }

  onPortSelect({ name, value, field }) {
    this.setState(pState => {
      const fields = _.cloneDeep(pState.fields);
      if (!fields.hasOwnProperty("newPort")) {
        fields.newPort = {};
      }
      if (name === "properties") {
        if (!fields.newPort.hasOwnProperty(name)) {
          fields.newPort[name] = {};
        }
        fields.newPort[name][field] = value;
      } else {
        fields.newPort[name] = value;
      }
      return { fields };
    });
  }

  onFlowFieldsChange(value, name) {
    this.setState(pState => {
      const fields = _.cloneDeep(pState.fields);
      fields.flow[name] = value;
      return { fields };
    });
  }

  onConditionFieldChange(value, name) {
    this.setState(pState => {
      const fields = _.cloneDeep(pState.fields);
      fields.condition[name] = value;
      if (name === "field") {
        delete fields.condition.operator;
      }
      return { fields };
    });
  }

  render() {
    const {listener} = this.props;
    if(listener instanceof Function){
      listener(this.state) // pass the state to the listener
    }
    return (
      <CanvasContext.Provider
        value={{
          store: this.state,
          onPortSelect: this.onPortSelect,
          onPortSave: this.onPortSave,
          createPort: this.createPort,
          validatePortData: this.validatePortData,
          stateActions: this.stateActions,
          getPortsOfSelectedNode: this.getPortsOfSelectedNode,
          saveRecordToNode: this.saveRecordToNode,
          onFlowFieldsChange: this.onFlowFieldsChange,
          onConditionFieldChange: this.onConditionFieldChange
        }}
      >
        {this.props.children}
      </CanvasContext.Provider>
    );
  }
}

export const CanvasContext = React.createContext();

export default ConvasProvider;
