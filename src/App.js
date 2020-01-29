import React from "react";
import { DragAndDropSidebar } from "./DragAndDrop";
import CanvasProvider from './CanvasContext'
import './styles.css';

const operatorOptions = [
  { label: "equal", value: "EQUAL" },
  { label: "not equal", value: "NOTEQUAL" }
];

const conditionField = {
  URL: [
    {
      type: "select",
      validations: [],
      options: operatorOptions
    },
    {
      type: "input",
      validations: []
    }
  ],
  XPATH: [{}]
};

export default function App() {
  return (
    <CanvasProvider>
      <DragAndDropSidebar conditionField={conditionField} />
  </CanvasProvider>
  )
}
