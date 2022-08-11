import React from "react";
import { TextField } from "@mui/material";

type Props = {
  id: string;
  name: string;
  value: string | number;
  onChange: (val: any) => void;
  label?: string | React.ReactElement;
  placeholder?: string;
  helperText?: React.ReactElement;
};

function UrlInput({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  helperText,
}: Props) {
  return (
    <TextField
      style={{ marginBottom: "1em" }}
      fullWidth
      label={label}
      id={id}
      name={name}
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      helperText={helperText}
    />
  );
}

export default UrlInput;
