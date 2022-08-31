import React, { useState, useEffect, useMemo } from "react";
import { usePositions, addPositionAsDraft } from "@h/db";
import CreateEntityDialog from "@c/Dialog/CreateEntityDialog";
import { Grid } from "@mantine/core";
import TextInput from "@c/Editor/TextInput";
import showMsg from "@h/msg";
import Select, { IOption, ISelectedRendererProps } from "@c/Input/Select";
import RootTag from "@c/Tag/RootTag";

type Props = {
  canCreate?: boolean;
  onChange: (arr: any) => void;
  values: any[];
  dropdownPosition?: "bottom" | "top" | "flip";
};
export interface IPositionOption {
  id?: string;
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
  onChange,
  values,
  dropdownPosition = "bottom",
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
    if (!createOpen) {
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

  const labeledOptions = useMemo(() => {
    return (data || [])
      .concat(localPositions)
      .map((x: any) => ({ ...x, label: x.name, value: x.id }));
  }, [data, localPositions]);

  return (
    <>
      <Select
        dropdownPosition={dropdownPosition}
        disabled={isLoading}
        id="positonSelectMan"
        name="positonSelectMan"
        values={values.map((x: any) => x.id)}
        onSelect={(selected: string[]) => {
          const arr: any[] = [];
          for (let i = 0; i < selected.length; i++) {
            const index = labeledOptions.findIndex(
              (x: IOption) => x.value === selected[i]
            );
            if (index !== -1) {
              arr.push(labeledOptions[index]);
            }
          }
          onChange(arr || []);
        }}
        label="Affected Positions"
        placeholder={isLoading ? "Loading..." : "Software Engineer"}
        options={labeledOptions}
        renderValue={PositionSelectedChip}
        createClicked={
          canCreate
            ? (text: string) => {
                setCreateOpen(true);
                setNewPosition({ ...newPosition, name: text });
                return "";
              }
            : undefined
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
          <Grid>
            <Grid.Col xs={8}>
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
            </Grid.Col>
            <Grid.Col xs={4}>
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
            </Grid.Col>
          </Grid>
        </CreateEntityDialog>
      )}
    </>
  );
}
export const PositionSelectedChip = ({
  onRemove,
  label,
  value,
  ...props
}: ISelectedRendererProps) => {
  return (
    <div {...props}>
      <RootTag label={label} value={value} onRemove={onRemove} />
    </div>
  );
};

export default PositionSelect;
