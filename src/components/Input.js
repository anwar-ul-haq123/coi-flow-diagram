import React from "react";

export const TextField = ({label, name, onChange, value,isRequired, ...rest }) => {
  return (
    <div className="form-group" style={{marginBottom:"1.6rem"}}>
      <input
        style={{marginLeft:"10px"}}
        id={name}
        className="material-input"
        type="text"
        placeholder="Placeholder"
        name={name}
        onChange={onChange}
        type="text"
        value={value ? value : ""}
        required={isRequired}
        {...rest}
        
      />
      <label htmlFor={name} className="material-label">
        {label}
      </label>
    </div>
  );
}
