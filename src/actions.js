import { v4 } from "uuid";
import { rotate } from "./utils/rotate";
import _ from 'lodash';

/**
 * This file contains actions for updating state after each of the required callbacks
 */

export const onDragNode = ({ config, event, data, id }) => chart => {
  const nodechart = chart.nodes[id];

  if (nodechart) {
    chart.nodes[id] = {
      ...nodechart,
      position:
        config && config.snapToGrid
          ? { x: Math.round(data.x / 20) * 20, y: Math.round(data.y / 20) * 20 }
          : { x: data.x, y: data.y }
    };
  }

  return chart;
};

export const onDragCanvas = ({ config, event, data }) => chart => {
  chart.offset =
    config && config.snapToGrid
      ? { x: Math.round(data.x / 20) * 20, y: Math.round(data.y / 20) * 20 }
      : { x: data.x, y: data.y };
  return chart;
};

export const onLinkStart = ({ linkId, fromNodeId, fromPortId }) => chart => {
  chart.links[linkId] = {
    id: linkId,
    from: {
      nodeId: fromNodeId,
      portId: fromPortId
    },
    to: {}
  };
  return chart;
};

export const onLinkMove = ({ linkId, toPosition }) => chart => {
  const link = chart.links[linkId];
  link.to.position = toPosition;
  chart.links[linkId] = { ...link };
  return chart;
};

export const onLinkComplete = props => {
  const {
    linkId,
    fromNodeId,
    fromPortId,
    toNodeId,
    toPortId,
    config = {}
  } = props;
  return chart => {
    if (
      !config.readonly &&
      (config.validateLink ? config.validateLink({ ...props, chart }) : true) &&
      [fromNodeId, fromPortId].join() !== [toNodeId, toPortId].join()
    ) {
      chart.links[linkId].to = {
        nodeId: toNodeId,
        portId: toPortId
      };
    } else {
      delete chart.links[linkId];
    }
    return chart;
  };
};

export const onLinkCancel = ({ linkId }) => chart => {
  console.log("ON Link Cancel");
  delete chart.links[linkId];
  console.log({chart})
  return chart;
};

export const onLinkMouseEnter = ({ linkId }) => chart => {
  // Set the link to hover
  const link = chart.links[linkId];
  // Set the connected ports to hover
  if (link.to.nodeId && link.to.portId) {
    if (chart.hovered.type !== "link" || chart.hovered.id !== linkId) {
      chart.hovered = {
        type: "link",
        id: linkId
      };
    }
  }
  return chart;
};

export const onLinkMouseLeave = ({ linkId }) => chart => {
  const link = chart.links[linkId];
  // Set the connected ports to hover
  if (link.to.nodeId && link.to.portId) {
    chart.hovered = {};
  }
  return chart;
};

export const onLinkClick = ({ linkId }) => chart => {
  if (chart.selected.id !== linkId || chart.selected.type !== "link") {
    chart.selected = {
      type: "link",
      id: linkId
    };
  }
  return chart;
};

export const onCanvasClick = () => chart => {
  if (chart.selected.id) {
    chart.selected = {};
  }
  return chart;
};

export const onDeleteKey = () => chart => {
  console.log("on Delete Key");
  if (chart.selected.type === "node" && chart.selected.id) {
    const node = chart.nodes[chart.selected.id];
    // Delete the connected links
    Object.keys(chart.links).forEach(linkId => {
      const link = chart.links[linkId];
      if (link.from.nodeId === node.id || link.to.nodeId === node.id) {
        delete chart.links[link.id];
      }
    });
    // Delete the node
    delete chart.nodes[chart.selected.id];
  } else if (chart.selected.type === "link" && chart.selected.id) {
    console.log("Delete The Link")
    delete chart.links[chart.selected.id];
  }
  if (chart.selected) {
    chart.selected = {};
  }
  return chart;
};

export const onNodeClick = ({ nodeId }) => chart => {
  if (chart.selected.id !== nodeId || chart.selected.type !== "node") {
    let newFields = {
      condition:{},
      flow:{}
    };

    const node = chart.nodes[nodeId];
    const stateFields = _.clone(chart.fields);
    const nodeFields = _.clone(node.fields);

    if(!(_.isEqual(stateFields ,nodeFields)) &&  node.type === 'flow'){
      newFields.flow = node.fields ? node.fields : {}
    }else{
      newFields.condition = node.condition ? node.condition : {} 
    }
    chart.fields = {...newFields};
    chart.selected = {
      type: "node",
      id: nodeId
    };
    console.log({chart})
  }
  return chart;
};

export const onNodeSizeChange = ({ nodeId, size }) => chart => {
  chart.nodes[nodeId] = {
    ...chart.nodes[nodeId],
    size
  };
  return chart;
};

export const onPortPositionChange = ({
  node: nodeToUpdate,
  port,
  el,
  nodesEl
}) => chart => {
  if (nodeToUpdate.size) {
    // rotate the port's position based on the node's orientation prop (angle)
    const center = {
      x: nodeToUpdate.size.width / 2,
      y: nodeToUpdate.size.height / 2
    };
    const current = {
      x: el.offsetLeft + nodesEl.offsetLeft + el.offsetWidth / 2,
      y: el.offsetTop + nodesEl.offsetTop + el.offsetHeight / 2
    };
    const angle = nodeToUpdate.orientation || 0;
    const position = rotate(center, current, angle);

    const node = chart.nodes[nodeToUpdate.id];
    node.ports[port.id].position = {
      x: position.x,
      y: position.y
    };

    chart.nodes[nodeToUpdate.id] = { ...node };
  }

  return chart;
};

export const onCanvasDrop = ({ config, data, position }) => chart => {
  const id = v4();
  chart.nodes[id] = {
    id,
    position:
      config && config.snapToGrid
        ? {
            x: Math.round(position.x / 20) * 20,
            y: Math.round(position.y / 20) * 20
          }
        : { x: position.x, y: position.y },
    orientation: data.orientation || 0,
    type: data.type,
    ports: data.ports,
    properties: data.properties
  };
  return chart;
};
