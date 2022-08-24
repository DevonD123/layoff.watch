import React from "react";
import { TextInput as MTextInput } from "@mantine/core";

type Props = {
  id: string;
  name: string;
  value: string | number;
  onChange: (val: any) => void;
  label?: string | React.ReactElement;
  placeholder?: string;
  helperText?: React.ReactElement | string;
  onBlur?: () => void;
  error?: boolean;
  type?: "text" | "number";
  required?: boolean;
};

function TextInput({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  helperText,
  onBlur,
  error,
  type,
  required,
}: Props) {
  return (
    <MTextInput
      required={required}
      // style={{ marginBottom: "1em" }}
      // fullWidth
      label={label}
      id={id}
      name={name}
      type={type || typeof value === "string" ? "text" : "number"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      description={helperText}
      onBlur={onBlur}
      error={error}
    />
  );
}

export default TextInput;
