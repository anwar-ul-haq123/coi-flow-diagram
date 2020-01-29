import React from "react";

export const RadioGroup = ({ options, selected,onChange,name }) => {
  return (
    <React.Fragment>
      <div className="md-radio">
        {options &&
          options.map(option => (
            <React.Fragment key={option.value}>
              <div className="md-radio md-radio-inline">
                <input
                  id={option.value}
                  name={name}
                  type="radio"
                  checked={selected === option.value}
                  value={option.value}
                  onChange={onChange}
                />
                <label htmlFor={option.value}>{option.label}</label>
              </div>
            </React.Fragment>
          ))}
      </div>
    </React.Fragment>
  );
};