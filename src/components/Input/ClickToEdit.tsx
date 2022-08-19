import React, { useEffect, useRef } from "react";
import { Text, Input as InputEl, ActionIcon } from "@mantine/core";
import { IconDeviceFloppy, IconCircleX } from "@tabler/icons";

export interface IEditToggleInputState {
  value: any;
  isEdit?: boolean;
  placeholder?: string;
}
export interface IClickToEditProps extends IEditToggleInputState {
  canEdit?: boolean;
  onChange?: (newValue: any) => void;
  textElement: "xs" | "sm" | "md" | "lg" | "xl";
  setEdit?: (val: boolean) => void;
  showPlaceholder: boolean;
}

const ClickToEdit = ({
  value,
  isEdit,
  placeholder,
  canEdit,
  onChange,
  setEdit,
  textElement,
  showPlaceholder,
}: IClickToEditProps) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current && isEdit && canEdit) {
      ref.current.focus();
    }
  }, [isEdit, canEdit]);
  if (!showPlaceholder && !value) {
    return null;
  }
  if (isEdit && canEdit) {
    return (
      <InputEl
        ref={ref}
        size={textElement}
        rightSection={
          <div style={{ display: "flex" }}>
            <ActionIcon
              variant="transparent"
              onClick={() =>
                typeof onChange === "function" ? onChange("") : null
              }
            >
              <IconCircleX size={16} color="red" />
            </ActionIcon>
            <ActionIcon
              variant="transparent"
              onClick={() =>
                typeof setEdit === "function" ? setEdit(false) : null
              }
            >
              <IconDeviceFloppy size={16} color="green" />
            </ActionIcon>
          </div>
        }
        multiline
        variant="unstyled"
        value={value}
        onKeyDown={(e: any) => {
          if (e.key === "Enter" && !e.shiftKey) {
            return typeof setEdit === "function" ? setEdit(false) : null;
          }
        }}
        onChange={(e: any) => {
          if (typeof onChange === "function") {
            onChange(e.target.value);
          }
        }}
        onBlur={() => (typeof setEdit === "function" ? setEdit(false) : null)}
        type="text"
        placeholder={placeholder}
      />
    );
  }
  if (!value) {
    return (
      <Text
        style={{ cursor: "pointer", whiteSpace: "unset" }}
        size={textElement}
        color="dimmed"
        onClick={() => {
          return canEdit && typeof setEdit === "function"
            ? setEdit(true)
            : null;
        }}
      >
        {placeholder}
      </Text>
    );
  }
  return (
    <Text
      style={{ cursor: canEdit ? "pointer" : "default", whiteSpace: "unset" }}
      color="text.secondary"
      size={textElement}
      onClick={() => {
        return canEdit && typeof setEdit === "function" ? setEdit(true) : null;
      }}
    >
      {value}
    </Text>
  );
};

export default ClickToEdit;
