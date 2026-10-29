import React from 'react'

const Input = ({icon:Icon, ...props}) => {
  return (
      <div className="form-field">
          <Icon className="form-field-icon" aria-hidden="true" />
          <input
              {...props}
              className="form-input"
          />
      </div>
  );
}

export default Input
