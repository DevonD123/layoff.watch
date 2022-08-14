import React, { useState, useEffect } from "react";
import SearchSelect from "@c/Editor/SearchSelect";
import { usePositions, addPositionAsDraft } from "@h/db";
import CreateEntityDialog from "@c/Dialog/CreateEntityDialog";
import { Grid, Chip } from "@mui/material";
import { Work } from "@mui/icons-material";
import TextInput from "@c/Editor/TextInput";
import showMsg from "@h/msg";

type Props = {
  canCreate?: boolean;
  multiple?: boolean;
  showAbbrvWhenSelected?: boolean;
  onChange: (arr: any) => void;
  values: any[];
};
export interface IPositionOption {
  name: string;
  abbreviation?: string;
  is_draft: boolean;
}
const defaultNewPosition = {
  name: "",
  abbreviation: "",
  is_draft: true,
};

function PositionSelect({
  canCreate,
  multiple = true,
  showAbbrvWhenSelected,
  onChange,
  values,
}: Props) {
  const { data, status } = usePositions();
  const isLoading = status === "loading";
  const [localPositions, setLocalPositions] = useState<IPositionOption[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [newPosition, setNewPosition] =
    useState<IPositionOption>(defaultNewPosition);

  const [errors, setErrors] = useState<
    { msg: string; sev?: "error" | "warning" }[]
  >([]);
  async function acceptCreate() {
    if (!canCreate) return setCreateOpen(false);

    const errors = [];
    if (!newPosition.name) {
      errors.push({ msg: "Company name is required" });
    }

    setErrors(errors);

    if (errors.length <= 0) {
      const res = await addPositionAsDraft({
        name: newPosition.name,
        abbreviation: newPosition.abbreviation,
      });

      if (res) {
        const allLocalPositions = [...localPositions, res];
        const allSelected = [...values, res];
        setLocalPositions(allLocalPositions);
        onChange(allSelected);
        setCreateOpen(false);
        localStorage.setItem(
          "local_draft_position",
          JSON.stringify(allLocalPositions)
        );
        if (res.is_draft) {
          showMsg(`You have added ${res.name} to our database!`, "success");
        }
      }
    }
  }
  useEffect(() => {
    if (createOpen) {
      setNewPosition(defaultNewPosition);
      setErrors([]);
    }
  }, [createOpen]);

  useEffect(() => {
    const lsPositions = localStorage.getItem("local_draft_position");
    if (lsPositions) {
      try {
        // need to de dupe so when approved it is cleared
        setLocalPositions(JSON.parse(lsPositions) || []);
      } catch {
        console.error("error parsing ls positions");
      }
    }
  }, []);

  return (
    <>
      <SearchSelect
        loadingValues={isLoading}
        id="positonSelect"
        name="positonSelect"
        values={values}
        onSelect={(allSelected: IPositionOption[]) =>
          onChange(allSelected || [])
        }
        label="Affected Positions"
        placeholder="Software Engineer"
        multiple={multiple}
        createClicked={
          canCreate
            ? () => {
                setCreateOpen(true);
              }
            : undefined
        }
        options={(data || []).concat(localPositions)}
        renderTags={(value: IPositionOption[], getTagProps) =>
          value.map((option: IPositionOption, index: number) => (
            // eslint-disable-next-line react/jsx-key
            <Chip
              size="medium"
              variant="outlined"
              icon={<Work />}
              label={
                showAbbrvWhenSelected && option.abbreviation
                  ? option.abbreviation
                  : option.name
              }
              {...getTagProps({ index })}
            />
          ))
        }
        getOptionLabel={(opt) =>
          opt.abbreviation ? `${opt.abbreviation} | ${opt.name}` : opt.name
        }
      />
      {canCreate && createOpen && (
        <CreateEntityDialog
          onAccept={acceptCreate}
          onClose={() => setCreateOpen(false)}
          open={createOpen}
          title="Add a position to our database"
          body=""
          isLoading={false}
          errorList={errors}
        >
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <TextInput
                id="newName"
                name="newName"
                value={newPosition.name}
                onChange={(name) => {
                  setNewPosition({ ...newPosition, name });
                }}
                label="Title"
                placeholder="Software Engineer"
              />
            </Grid>
            <Grid item xs={4}>
              <TextInput
                id="newAbbreviation"
                name="newAbbreviation"
                value={newPosition.abbreviation || ""}
                onChange={(abbreviation) => {
                  setNewPosition({
                    ...newPosition,
                    abbreviation,
                  });
                }}
                label="Abreviation"
                placeholder="SWE"
              />
            </Grid>
          </Grid>
        </CreateEntityDialog>
      )}
    </>
  );
}

export default PositionSelect;
