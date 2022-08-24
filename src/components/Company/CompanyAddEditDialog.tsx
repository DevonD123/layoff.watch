import React, { useState } from "react";
import { Avatar, Grid, Text, Textarea } from "@mantine/core";
import TextInput from "@c/Editor/TextInput";
import CreateEntityDialog from "@c/Dialog/CreateEntityDialog";
import { getCommaSeperatedText } from "./helper";
import Image from "next/image";
import showMsg from "@h/msg";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  data: any;
  onChange: (val: any, field: string) => void;
  isCreateMode?: boolean;
};

function CompanyAddEditDialog({
  onAccept,
  onClose,
  isOpen,
  data,
  onChange,
  isCreateMode,
}: Props) {
  const [previewUrl, setPreviewUrl] = useState("");
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
        <Grid.Col xs={12}>
          <TextInput
            id="newName"
            name="newName"
            value={data.name}
            onChange={(name) => {
              if (name.length >= 1) {
                const char1 = name[0].toUpperCase();
                onChange(char1 + name.substring(1), "name");
              } else {
                onChange(name, "name");
              }
            }}
            label="Company Name"
            placeholder="Microsoft"
          />
        </Grid.Col>
        <Grid.Col xs={6}>
          <TextInput
            id="newTicker"
            name="newTicker"
            value={data.ticker || ""}
            onChange={(ticker) => {
              if (ticker[0] && !/[a-zA-Z1-9]/.test(ticker[0])) {
                return;
              }
              onChange(ticker.toUpperCase(), "ticker");
            }}
            label="Stock Symbol"
            placeholder="MSFT"
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
            placeholder="221,000"
          />
        </Grid.Col>
        {isCreateMode && (
          <Grid.Col xs={8}>
            <TextInput
              id="newLogoUrl"
              name="newLogoUrl"
              value={data.logo_url || ""}
              onChange={(logo_url) =>
                onChange(logo_url.split(" ").join("").trim(), "logo_url")
              }
              label="Domain Name"
              helperText="eg. company.com | preview shows once you click away"
              placeholder="microsoft.com"
              onBlur={() => {
                if (
                  data.logo_url &&
                  data.logo_url.includes(".") &&
                  data.logo_url.length >= 3 &&
                  !data.logo_url.includes("/")
                ) {
                  setPreviewUrl(`https://logo.clearbit.com/${data.logo_url}`);
                } else {
                  setPreviewUrl("");
                  onChange("", "logo_url");
                  showMsg(
                    'Invalid domain make sure it does not have any special characters and has a single "." with atleast 3 characters'
                  );
                }
              }}
            />
          </Grid.Col>
        )}
        {isCreateMode && (
          <Grid.Col
            xs={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            {previewUrl && (
              <Image
                src={`${previewUrl}?size=50&format=png`}
                width={50}
                height={50}
                alt={"company logo"}
              />
            )}
            {!previewUrl && (
              <div
                style={{
                  height: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Logo Preview...</Text>
              </div>
            )}
          </Grid.Col>
        )}
        <Grid.Col xs={12}>
          <Textarea
            id="newDescription"
            name="newDescription"
            value={data.description || ""}
            onChange={(e) => onChange(e.target.value, "description")}
            label="Description"
            placeholder="Global diversified tech company."
            minRows={3}
            autosize
          />
        </Grid.Col>
      </Grid>
    </CreateEntityDialog>
  );
}

export default CompanyAddEditDialog;
