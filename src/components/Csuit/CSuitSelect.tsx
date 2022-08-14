import React, { useState, useEffect, useMemo } from "react";
import SearchSelect from "@c/Editor/SearchSelect";
import { useCSuitByCompany, addCSuitAsDraft } from "./db";
import CSuitChip from "./CSuitChip";
import CreateEntityDialog from "@c/Dialog/CreateEntityDialog";
import { Chip, Grid } from "@mui/material";
import TextInput from "@c/Editor/TextInput";
import showMsg from "@h/msg";
import { ICSuitOpt, ICsuitLink } from "./types";

type Props = {
  canCreate?: boolean;
  multiple?: boolean;
  company_id?: string;
  onChange: (arr: any) => void;
  values: any[];
  companyName?: string;
};
const defaultCsuit: ICSuitOpt = {
  id: "__",
  name: "",
  bio: "",
  img_url: "",
  linked_in_url: "",
  role: "",
  is_draft: true,
};
const defaultCSuitLink = {
  company_id: "__",
  csuit_id: "__",
  start: "",
  end: "",
  csuit: defaultCsuit,
  is_draft: true,
};

function CSuitSelect({
  canCreate,
  company_id,
  multiple = true,
  values,
  onChange,
  companyName,
}: Props) {
  const { data, status } = useCSuitByCompany(company_id);
  const isLoading = status === "loading";
  const [localCsuitLinks, setLocalCsuitLinks] = useState<ICsuitLink[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [newCsuitLink, setNewCsuitLink] =
    useState<ICsuitLink>(defaultCSuitLink);

  const [errors, setErrors] = useState<
    { msg: string; sev?: "error" | "warning" }[]
  >([]);
  async function acceptCreate() {
    if (!canCreate) return setCreateOpen(false);

    const errors = [];
    if (!newCsuitLink.csuit.name) {
      errors.push({ msg: "The executives name is required." });
    }
    if (newCsuitLink.csuit.name.split(" ").length <= 1) {
      errors.push({
        msg: "Please include the first and last name (in the name field).",
      });
    }

    setErrors(errors);

    if (errors.length <= 0 && company_id) {
      const res = await addCSuitAsDraft({
        name: newCsuitLink.csuit.name,
        bio: newCsuitLink.csuit.bio,
        role: newCsuitLink.csuit.role,
        company_id,
      });

      if (res) {
        const allLocalCsuitLinks = [...localCsuitLinks, res];
        setLocalCsuitLinks(allLocalCsuitLinks);
        onChange([...values, res]);
        setCreateOpen(false);
        localStorage.setItem(
          "local_draft_csuit",
          JSON.stringify(allLocalCsuitLinks)
        );
        if (res.is_draft) {
          showMsg(`You have added ${res.name} to our database!`, "success");
        }
      }
    }
  }
  useEffect(() => {
    if (createOpen) {
      setNewCsuitLink(defaultCSuitLink);
      setErrors([]);
    }
  }, [createOpen]);

  useEffect(() => {
    const lsCsuitLinks = localStorage.getItem("local_draft_csuit");
    if (lsCsuitLinks) {
      try {
        // need to de dupe so when approved it is cleared
        setLocalCsuitLinks(JSON.parse(lsCsuitLinks) || []);
      } catch {
        console.error("error parsing lc csuit");
      }
    }
  }, []);

  const dataList = useMemo(() => {
    const arr: ICsuitLink[] = data || [];
    if (localCsuitLinks && localCsuitLinks.length >= 1) {
      if (!data) {
        return localCsuitLinks;
      }
      for (let i = 0; i < localCsuitLinks.length; i++) {
        // show if company matches & the csuit is not approved (would be in both lists)
        // don't show if draft and not draft version
        if (localCsuitLinks[i].company_id === company_id) {
          if (
            data.findIndex(
              (x: ICsuitLink) =>
                x.company_id === localCsuitLinks[i].company_id &&
                x.csuit_id === localCsuitLinks[i].csuit_id
            ) === -1
          ) {
            arr.push(localCsuitLinks[i]);
          }
        }
      }
    }
    return arr;
  }, [data, localCsuitLinks, company_id]);

  return (
    <>
      <SearchSelect
        loadingValues={isLoading}
        id="csuitSelect"
        name="csuitSelect"
        values={values}
        onSelect={(allSelected: ICsuitLink[]) => onChange(allSelected || [])}
        label="Executives"
        placeholder="Select an exec"
        multiple={multiple}
        disabled={!company_id}
        createClicked={
          canCreate
            ? () => {
                setCreateOpen(true);
              }
            : undefined
        }
        options={dataList}
        renderTags={(value: ICsuitLink[], getTagProps) =>
          value.map((option: ICsuitLink, index: number) => (
            // eslint-disable-next-line react/jsx-key
            <CSuitChip
              secondaryLabel={option.csuit.role}
              logoUrl=""
              label={option.csuit.name}
              {...getTagProps({ index })}
            />
          ))
        }
        getOptionLabel={(opt) =>
          (opt.csuit.role
            ? `${opt.csuit.role} | ${opt.csuit.name}`
            : opt.csuit.name) || ""
        }
      />
      {canCreate && createOpen && (
        <CreateEntityDialog
          onAccept={acceptCreate}
          onClose={() => setCreateOpen(false)}
          open={createOpen}
          title={`Add an exec ${
            !companyName ? "" : `for ${companyName} `
          }to our database`}
          body=""
          isLoading={false}
          errorList={errors}
        >
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <TextInput
                id="newName"
                name="newName"
                value={newCsuitLink.csuit.name}
                onChange={(name) => {
                  let nameUsed = name;
                  if (name.length >= 1) {
                    nameUsed = name[0].toUpperCase() + name.substring(1);
                  }
                  setNewCsuitLink({
                    ...newCsuitLink,
                    csuit: {
                      ...newCsuitLink.csuit,
                      name: nameUsed,
                    },
                  });
                }}
                label="Name"
                placeholder="John Doe"
                helperText={"First & Last"}
              />
            </Grid>
            <Grid item xs={4}>
              <SearchSelect
                id="role"
                name="role"
                values={newCsuitLink.csuit.role}
                onSelect={(allSelected: string) => {
                  setNewCsuitLink({
                    ...newCsuitLink,
                    csuit: {
                      ...newCsuitLink.csuit,
                      role: allSelected || "",
                    },
                  });
                }}
                label="Role"
                placeholder="Select an exec"
                multiple={false}
                options={["CEO", "CMO", "CTO"]}
                renderTags={(value: string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    // eslint-disable-next-line react/jsx-key
                    <Chip label={option} {...getTagProps({ index })} />
                  ))
                }
                getOptionLabel={(opt: string) => opt || ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextInput
                id="newBio"
                name="newBio"
                value={newCsuitLink.csuit.bio || ""}
                onChange={(bio) =>
                  setNewCsuitLink({
                    ...newCsuitLink,
                    csuit: { ...newCsuitLink.csuit, bio },
                  })
                }
                label="Bio"
                placeholder="Former SWE previosuly manager of the on prem server org."
                isTextField
              />
            </Grid>
          </Grid>
        </CreateEntityDialog>
      )}
    </>
  );
}

export default CSuitSelect;
