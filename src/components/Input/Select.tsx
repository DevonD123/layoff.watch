import React from "react";
import { MultiSelect as MSelect, MultiSelectValueProps } from "@mantine/core";

export interface IProps {
  values: any[] | any;
  onSelect: (selected: string[]) => void;
  label?: string;
  id: string;
  name: string;
  placeholder?: string;
  /*
   return item after creation (as IOption format)
  */
  createClicked?: (text: string) => any;
  options: IOption[];
  disabled?: boolean;
  renderValue?: (
    props: MultiSelectValueProps & { value: string }
  ) => React.ReactElement;
  clearable?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}
export interface IOption {
  label: string;
  value: string;
  [key: string | number | symbol]: any;
}
export type ISelectedRendererProps = Omit<MultiSelectValueProps, "onRemove"> & {
  value: string;
  onRemove?: () => void;
};

function Select({
  options,
  label,
  id,
  name,
  placeholder,
  createClicked,
  disabled,
  values,
  onSelect,
  renderValue,
  clearable = true,
  size,
}: IProps) {
  const canCreate = typeof createClicked === "function";
  return (
    <MSelect
      size={size}
      clearable={clearable}
      variant="unstyled"
      id={id}
      name={name}
      disabled={disabled}
      label={label}
      placeholder={placeholder}
      maxDropdownHeight={400}
      data={options.concat([
        {
          label: `Select ${canCreate ? "or type to create" : ""}`,
          value: "Select",
          disabled: true,
        },
      ])}
      nothingFound="Nothing found"
      searchable
      creatable={canCreate}
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={createClicked}
      onChange={onSelect}
      value={values}
      valueComponent={renderValue}
    />
  );
}

export default Select;
