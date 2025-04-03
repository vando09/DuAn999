// FormField.js
import React from "react";
import { CFormLabel } from "@coreui/react";

const FormField = ({ id, label, type, value, onChange, onBlur, error }) => {
  return (
    <div className="mb-3">
      <CFormLabel htmlFor={id}>{label}</CFormLabel>
      <input
        id={id}
        name={id}
        type={type}
        className={`form-control ${error ? "is-invalid" : ""}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormField;
