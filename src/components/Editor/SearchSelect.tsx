import React, { useState } from "react";
import { Grid, Autocomplete, TextField, Chip, Button } from "@mui/material";
import CreateEntityDialog from "@c/Dialog/CreateEntityDialog";

export enum EntityType {
  CSuit = "CSuit",
  Company = "Company",
  Org = "Org",
  Position = "Position",
}
type Props = {
  /**
   * determines what api we look at
   */
  search: EntityType;
  searchText?: string;
  /**
   * ids
   */
  values: string[];
  /**
   * returns the new list of all user ids
   */
  onSelect: (allIds: string[]) => void;
  label?: string;
  id: string;
  name: string;
  placeholder?: string;
  disableCreate?: boolean;
  multiple?: boolean;
};

function SearchSelect({
  search,
  searchText,
  values,
  onSelect,
  label,
  id,
  name,
  placeholder,
  disableCreate,
  multiple = true,
}: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <Grid container spacing={1} style={{ marginBottom: "1em" }}>
      <Grid item xs>
        <Autocomplete
          multiple={multiple}
          options={top100Films}
          getOptionLabel={(option) => option.title}
          defaultValue={[top100Films[0]]}
          renderTags={(value: IResult[], getTagProps) =>
            value.map((option: IResult, index: number) => (
              // eslint-disable-next-line react/jsx-key
              <Chip
                variant="outlined"
                label={option.title}
                {...getTagProps({ index })}
              />
            ))
          }
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
      {!disableCreate && (
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
          <Button
            color="info"
            variant="contained"
            onClick={() => setIsCreateOpen(true)}
          >
            Create
          </Button>
          {isCreateOpen && (
            <CreateEntityDialog
              open={isCreateOpen}
              type={search}
              onAccept={() => setIsCreateOpen(false)}
              onClose={() => setIsCreateOpen(false)}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
}
interface IResult {
  title: string;
  year: number;
}
const top100Films: IResult[] = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
];

export default SearchSelect;
