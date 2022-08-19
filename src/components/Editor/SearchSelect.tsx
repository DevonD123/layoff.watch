import React, { useState } from "react";
import {
  Grid,
  Autocomplete,
  TextField,
  Button,
  AutocompleteRenderGetTagProps,
} from "@mui/material";
import { AddBox } from "@mui/icons-material";

export enum EntityType {
  CSuit = "CSuit",
  Company = "Company",
  Org = "Org",
  Position = "Position",
}
export interface ISearchSelectItem {
  label: string;
  value: string;
}

type Props = {
  values: any[] | any;
  onSelect: (allSelected: any[] | any) => void;
  label?: string;
  id: string;
  name: string;
  placeholder?: string;
  multiple?: boolean;
  defaultValues?: [];
  loadingValues?: boolean;
  createClicked?: () => void;
  options: any[];
  getOptionLabel: (opt: any) => string;
  renderTags: (
    option: any,
    getTagProps: AutocompleteRenderGetTagProps
  ) => React.ReactNode;
  disabled?: boolean;
};

function SearchSelect({
  options,
  getOptionLabel,
  renderTags,
  label,
  id,
  name,
  placeholder,
  createClicked,
  disabled,
  loadingValues = false,
  values,
  onSelect,
  defaultValues = [],
  multiple = true,
}: Props) {
  const canCreate = typeof createClicked === "function";
  return (
    <Grid container spacing={1} style={{ marginBottom: "1em" }}>
      <Grid item xs>
        <Autocomplete
          value={values}
          onChange={(_, newValue: any) => onSelect(newValue)}
          disabled={disabled}
          loading={loadingValues}
          multiple={multiple}
          options={options}
          getOptionLabel={getOptionLabel}
          defaultValue={defaultValues}
          renderTags={renderTags}
          isOptionEqualToValue={(opt: any, val: any) => {
            if (typeof opt.id !== "undefined") {
              return opt.id === val.id;
            }
            if (
              typeof opt.company_id !== "undefined" &&
              typeof opt.csuit !== "undefined"
            ) {
              return (
                opt.company_id === val.company_id && opt.csuit === val.csuit
              );
            }
            if (typeof opt === "string") {
              return opt === val;
            }
            return false;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              id={id}
              name={name}
              label={label}
              placeholder={placeholder}
              disabled={disabled}
            />
          )}
        />
      </Grid>
      {typeof createClicked === "function" && (
        <Grid
          item
          // xs={4}
          // md={2}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: 0,
          }}
        >
          <Button
            color="info"
            variant="outlined"
            onClick={createClicked}
            disabled={disabled}
            style={{
              height: "100%",
              borderLeft: "none",
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 0,
            }}
            startIcon={<AddBox />}
          >
            New
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

export default SearchSelect;
