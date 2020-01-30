import React from "react";
import { DragAndDropSidebar } from "./DragAndDrop";
import CanvasProvider from "./CanvasContext";
import "./styles.css";

function listener(state) {
  console.log("IN Listener ", state);
}

export default () => {
  return (
    <CanvasProvider listener={listener}>
      <DragAndDropSidebar />
    </CanvasProvider>
  );
};
