import React from "react";
import CreateEntityDialog from "@c/Dialog/CreateEntityDialog";
import TextInput from "@c/Editor/TextInput";
import { Grid, Textarea } from "@mantine/core";
import { getCommaSeperatedText } from "@c/Company/helper";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  data: any;
  onChange: (val: any, field: string) => void;
  isCreateMode?: boolean;
  companyName?: string;
};

function OrgAddEditDialog({
  onAccept,
  onClose,
  isOpen,
  data,
  onChange,
  isCreateMode,
  companyName,
}: Props) {
  if (!isOpen) {
    return null;
  }
  return (
    <CreateEntityDialog
      onAccept={onAccept}
      onClose={onClose}
      open={isOpen}
      title={
        isCreateMode
          ? `Add an org to ${
              companyName || "unselected company"
            } in our database`
          : "Edit org"
      }
      body=""
      isLoading={false}
    >
      <Grid>
        <Grid.Col xs={12}>
          <TextInput
            id="newName"
            name="newName"
            value={data.name}
            onChange={(name) => {
              onChange(name, "name");
            }}
            label="Org Name"
            placeholder="Cloud"
          />
        </Grid.Col>
        <Grid.Col xs={6}>
          <TextInput
            id="newAbbreviation"
            name="newAbbreviation"
            value={data.abbreviation || ""}
            onChange={(abbreviation) => {
              onChange(abbreviation, "abbreviation");
            }}
            label="Abreviation"
            placeholder="CLD"
          />
        </Grid.Col>
        <Grid.Col xs={6}>
          <TextInput
            id="newEstEmployeeCount"
            name="newEstEmployeeCount"
            value={data.est_employee_count || ""}
            onChange={(est_employee_count) => {
              const result = getCommaSeperatedText(est_employee_count);
              if (result !== null) {
                onChange(result, "est_employee_count");
              }
            }}
            label="Estimated Employees"
            placeholder="3,000"
          />
        </Grid.Col>
        <Grid.Col xs={12}>
          <Textarea
            id="newDescription"
            name="newDescription"
            value={data.description || ""}
            onChange={(e) => onChange(e.target.value, "description")}
            label="Description"
            placeholder="Cloud computing."
          />
        </Grid.Col>
      </Grid>
    </CreateEntityDialog>
  );
}

export default OrgAddEditDialog;
