import React, { useState } from "react";
import {
  Grid,
  Autocomplete,
  TextField,
  Chip,
  Button,
  AutocompleteRenderGetTagProps,
} from "@mui/material";

export enum EntityType {
  CSuit = "CSuit",
  Company = "Company",
  Org = "Org",
  Position = "Position",
}

type Props = {
  values: any[];
  onSelect: (allSelected: any[]) => void;
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
  loadingValues = false,
  defaultValues = [],
  multiple = true,
}: Props) {
  return (
    <Grid container spacing={1} style={{ marginBottom: "1em" }}>
      <Grid item xs>
        <Autocomplete
          loading={loadingValues}
          multiple={multiple}
          options={options}
          getOptionLabel={getOptionLabel}
          defaultValue={defaultValues}
          renderTags={renderTags}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              id={id}
              name={name}
              label={label}
              placeholder={placeholder}
            />
          )}
        />
      </Grid>
      {typeof createClicked === "function" && (
        <Grid
          item
          xs={4}
          md={2}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button color="info" variant="contained" onClick={createClicked}>
            Create
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

export default SearchSelect;
/*
{isCreateOpen && (
             <CreateEntityDialog
               open={isCreateOpen}
               onAccept={() => setIsCreateOpen(false)}
               onClose={() => setIsCreateOpen(false)}
             />
          )}
*/

/*
(value: IResult[], getTagProps) =>
            value.map((option: IResult, index: number) => (
              // eslint-disable-next-line react/jsx-key
              <Chip
                variant="outlined"
                label={option.title}
                {...getTagProps({ index })}
              />
            ))
*/
