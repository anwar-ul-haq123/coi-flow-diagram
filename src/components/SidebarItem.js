import * as React from "react";
import styled from "styled-components";
import { REACT_FLOW_CHART } from "@mrblenny/react-flow-chart";

const Outer = styled.div`
  padding: 20px 30px;
  font-size: 14px;
  background: white;
  cursor: move;
  text-transform:capitalize;
  border:none;
  font-weight:550;
  margin-top:1px;
  &:hover {
    background:#555;
    transition: all 0.5s ease-in-out;
    transition-property: transform, background;
    border-radius:8px;
    border:none;
    color:white;
  }
`;

export const SidebarItem = ({ type, ports, properties }) => {
  return (
    <Outer
      draggable={true}
      onDragStart={event => {
        event.dataTransfer.setData(
          REACT_FLOW_CHART,
          JSON.stringify({ type, ports, properties })
        );
      }}
    >
      {type}
    </Outer>
  );
};
