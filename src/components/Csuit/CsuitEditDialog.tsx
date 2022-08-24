import React from "react";
import { Avatar, Grid, Select, Text, Textarea, TextInput } from "@mantine/core";
import CreateEntityDialog from "@c/Dialog/CreateEntityDialog";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  data: any;
  onChange: (val: any, field: string) => void;
  isCreateMode?: boolean;
};

function CsuitEditDialog({
  onAccept,
  onClose,
  isOpen,
  data,
  onChange,
  isCreateMode,
}: Props) {
  if (!isOpen) {
    return <></>;
  }
  return (
    <CreateEntityDialog
      onAccept={onAccept}
      onClose={onClose}
      open={isOpen}
      title={
        isCreateMode ? (
          "Add a company to our database"
        ) : (
          <div style={{ display: "flex" }}>
            <Avatar style={{ width: 20, height: 20 }}>
              {data.logo_url ? (
                <Image
                  src={`${data.logo_url}?size=50&format=png`}
                  width={20}
                  height={20}
                  alt={"company logo"}
                />
              ) : (
                data.name.charAt(0)
              )}
            </Avatar>
            Edit company
          </div>
        )
      }
      body=""
      isLoading={false}
    >
      <Grid>
        <Grid.Col sm={8}>
          <TextInput
            id="newName"
            name="newName"
            value={data.name}
            onChange={(e) => {
              let nameUsed = e.target.value;
              if (nameUsed.length >= 1) {
                nameUsed = nameUsed[0].toUpperCase() + nameUsed.substring(1);
              }
              onChange(nameUsed, "name");
            }}
            label="Name"
            placeholder="John Doe"
            description={"First & Last"}
          />
        </Grid.Col>
        <Grid.Col sm={4} style={{ display: "flex", alignItems: "flex-end" }}>
          <Select
            label="Role"
            searchable
            clearable
            value={data.role || null}
            data={["CEO", "CMO", "CTO"]}
            onChange={(selected: string) => {
              onChange(selected, "role");
            }}
          />
        </Grid.Col>

        <Grid.Col xs={12}>
          <Textarea
            id="newBio"
            name="newBio"
            value={data.bio || ""}
            onChange={(e) => onChange(e.target.value, "bio")}
            label="Bio"
            placeholder="Former SWE previosuly manager of the on prem server org."
          />
        </Grid.Col>
      </Grid>
    </CreateEntityDialog>
  );
}

export default CsuitEditDialog;
