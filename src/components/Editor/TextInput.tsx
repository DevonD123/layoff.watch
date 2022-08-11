import React from "react";
import { TextField } from "@mui/material";

type Props = {
  id: string;
  name: string;
  value: string | number;
  onChange: (val: any) => void;
  label?: string | React.ReactElement;
  placeholder?: string;
  isTextField?: boolean;
  helperText?: React.ReactElement | string;
  onBlur?: () => void;
  error?: boolean;
  type?: "text" | "number";
};

function TextInput({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  isTextField,
  helperText,
  onBlur,
  error,
  type,
}: Props) {
  return (
    <TextField
      style={{ marginBottom: "1em" }}
      fullWidth
      multiline={isTextField}
      rows={isTextField ? 5 : 1}
      label={label}
      id={id}
      name={name}
      type={type || typeof value === "string" ? "text" : "number"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      helperText={helperText}
      onBlur={onBlur}
      error={error}
    />
  );
}

export default TextInput;
