import React, { useState, useEffect, useMemo } from "react";
import SearchSelect from "@c/Editor/SearchSelect";
import { useOrg, addOrgAsDraft } from "./db";
import CreateEntityDialog from "@c/Dialog/CreateEntityDialog";
import { Grid, Chip } from "@mui/material";
import { AccountTree } from "@mui/icons-material";
import TextInput from "@c/Editor/TextInput";
import showMsg from "@h/msg";
import { getCommaSeperatedText } from "@c/Company/helper";
import { IOrgOption } from "./types";

type Props = {
  canCreate?: boolean;
  multiple?: boolean;
  company_id?: string;
  companyName?: string;
  onChange: (arr: any) => void;
  values: any[];
};

const defaultNewPosition = {
  id: "__",
  company_id: "__",
  name: "",
  abbreviation: "",
  description: "",
  est_employee_count: "",
  is_draft: true,
};

function OrgSelect({
  canCreate,
  companyName,
  company_id,
  multiple = true,
  values,
  onChange,
}: Props) {
  const { data, status } = useOrg(company_id);
  const isLoading = status === "loading";
  const [localPositions, setLocalPositions] = useState<IOrgOption[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [newPosition, setNewPosition] =
    useState<IOrgOption>(defaultNewPosition);

  const [errors, setErrors] = useState<
    { msg: string; sev?: "error" | "warning" }[]
  >([]);
  async function acceptCreate() {
    if (!canCreate) return setCreateOpen(false);

    if (!company_id) return console.error("No company id");

    const errors = [];
    if (!newPosition.name) {
      errors.push({ msg: "Org name is required" });
    }

    setErrors(errors);

    if (errors.length <= 0) {
      const res = await addOrgAsDraft({
        name: newPosition.name,
        abbreviation: newPosition.abbreviation,
        description: newPosition.description,
        company_id: company_id,
        est_employee_count: newPosition.est_employee_count as string,
      });

      if (res) {
        const allLocalPositions = [...localPositions, res];
        setLocalPositions(allLocalPositions);
        onChange([...values, res]);
        setCreateOpen(false);
        localStorage.setItem(
          "local_draft_orgs",
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
    const lsPositions = localStorage.getItem("local_draft_orgs");
    if (lsPositions) {
      try {
        // need to de dupe so when approved it is cleared
        setLocalPositions(JSON.parse(lsPositions) || []);
      } catch {
        console.error("error parsing ls orgs");
      }
    }
  }, []);

  const dataList = useMemo(() => {
    const arr: IOrgOption[] = data || [];
    if (localPositions && localPositions.length >= 1) {
      if (!data) {
        return localPositions;
      }
      for (let i = 0; i < localPositions.length; i++) {
        // show if company matches & the csuit is not approved (would be in both lists)
        // don't show if draft and not draft version
        if (localPositions[i].company_id === company_id) {
          if (
            data.findIndex((x: IOrgOption) => x.id === localPositions[i].id) ===
            -1
          ) {
            arr.push(localPositions[i]);
          }
        }
      }
    }
    return arr;
  }, [data, localPositions, company_id]);

  return (
    <>
      <SearchSelect
        loadingValues={isLoading}
        id="orgSelect"
        name="orgSelect"
        values={values}
        onSelect={(allSelected: IOrgOption[]) => onChange(allSelected || [])}
        label="Organizations"
        placeholder="Azure"
        multiple={multiple}
        createClicked={
          canCreate
            ? () => {
                setCreateOpen(true);
              }
            : undefined
        }
        options={dataList}
        renderTags={(value: IOrgOption[], getTagProps) =>
          value.map((option: IOrgOption, index: number) => (
            // eslint-disable-next-line react/jsx-key
            <Chip
              size="medium"
              variant="outlined"
              icon={<AccountTree />}
              label={option.name}
              {...getTagProps({ index })}
            />
          ))
        }
        getOptionLabel={(opt) =>
          (opt.abbreviation ? `${opt.abbreviation} | ${opt.name}` : opt.name) ||
          ""
        }
      />
      {canCreate && createOpen && (
        <CreateEntityDialog
          onAccept={acceptCreate}
          onClose={() => setCreateOpen(false)}
          open={createOpen}
          title={`Add an org to ${
            companyName || "unselected company"
          } in our database`}
          body=""
          isLoading={false}
          errorList={errors}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextInput
                id="newName"
                name="newName"
                value={newPosition.name}
                onChange={(name) => {
                  setNewPosition({ ...newPosition, name });
                }}
                label="Org Name"
                placeholder="Cloud"
              />
            </Grid>
            <Grid item xs={6}>
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
                placeholder="CLD"
              />
            </Grid>
            <Grid item xs={6}>
              <TextInput
                id="newEstEmployeeCount"
                name="newEstEmployeeCount"
                value={newPosition.est_employee_count || ""}
                onChange={(est_employee_count) => {
                  const result = getCommaSeperatedText(est_employee_count);
                  if (result !== null) {
                    setNewPosition({
                      ...newPosition,
                      est_employee_count: result,
                    });
                  }
                }}
                label="Estimated Employees"
                placeholder="3,000"
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                id="newDescription"
                name="newDescription"
                value={newPosition.description || ""}
                onChange={(description) =>
                  setNewPosition({ ...newPosition, description })
                }
                label="Description"
                placeholder="Cloud computing."
                isTextField
              />
            </Grid>
          </Grid>
        </CreateEntityDialog>
      )}
    </>
  );
}

export default OrgSelect;
