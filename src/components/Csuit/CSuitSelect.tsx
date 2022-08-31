import React, { useState, useEffect, useMemo } from "react";
import { useCSuitByCompany, addCSuitAsDraft } from "./db";
import CreateEntityDialog from "@c/Dialog/CreateEntityDialog";
import showMsg from "@h/msg";
import { ICSuitOpt, ICsuitLink } from "./types";
import Select, { IOption, ISelectedRendererProps } from "@c/Input/Select";
import RootTag from "@c/Tag/RootTag";
import {
  Select as SingleSelect,
  TextInput,
  Textarea,
  Grid,
  Avatar,
  FileInput,
} from "@mantine/core";

type Props = {
  canCreate?: boolean;
  company_id?: string;
  onChange: (arr: any) => void;
  values: any[];
  companyName?: string;
  clearable?: boolean;
  label?: string;
  placeholder?: string;
  dropdownPosition?: "bottom" | "top" | "flip";
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
  values,
  onChange,
  companyName,
  clearable,
  label,
  placeholder,
  dropdownPosition = "bottom",
}: Props) {
  const { data, status } = useCSuitByCompany(company_id);
  const isLoading = status === "loading";
  const [localCsuitLinks, setLocalCsuitLinks] = useState<ICsuitLink[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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
        file: file || undefined,
      });

      if (res) {
        const allLocalCsuitLinks = [...localCsuitLinks, res];
        const onChangeVals = [...values, res];
        setCreateOpen(false);
        setLocalCsuitLinks(allLocalCsuitLinks);
        onChange(onChangeVals);
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
    if (!createOpen) {
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

  const labledOptions = dataList.map((x: any) => ({
    ...x,
    value: x.company_id + "__" + x.csuit_id,
    label: x.csuit.name,
  }));

  return (
    <>
      <Select
        dropdownPosition={dropdownPosition}
        clearable={clearable}
        size="xs"
        id="csuitSelect"
        name="csuitSelect"
        label={label}
        placeholder={
          !company_id
            ? "Select a company first"
            : isLoading
            ? "Loading..."
            : placeholder
        }
        disabled={!company_id || isLoading}
        options={labledOptions}
        values={(values || []).map((x) => x.company_id + "__" + x.csuit_id)}
        onSelect={(selected: string[]) => {
          const arr: any[] = [];
          for (let i = 0; i < selected.length; i++) {
            const index = labledOptions.findIndex(
              (x: IOption) => x.value === selected[i]
            );
            if (index !== -1) {
              arr.push(labledOptions[index]);
            }
          }
          onChange(arr || []);
        }}
        createClicked={
          canCreate
            ? (name: string) => {
                const newData = { ...defaultCSuitLink };
                newData.csuit.name = name[0].toUpperCase() + name.substring(1);
                setNewCsuitLink(newData);
                setCreateOpen(true);
                return "";
              }
            : undefined
        }
        renderValue={CSuitSelectTag}
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
          <Grid>
            <Grid.Col sm={8}>
              <TextInput
                id="newName"
                name="newName"
                value={newCsuitLink.csuit.name}
                onChange={(e) => {
                  let nameUsed = e.target.value;
                  if (nameUsed.length >= 1) {
                    nameUsed =
                      nameUsed[0].toUpperCase() + nameUsed.substring(1);
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
                description={"First & Last"}
              />
            </Grid.Col>
            <Grid.Col
              sm={4}
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <SingleSelect
                label="Role"
                searchable
                clearable
                value={newCsuitLink.csuit.role || null}
                data={["CEO", "CMO", "CTO"]}
                onChange={(selected: string) => {
                  setNewCsuitLink({
                    ...newCsuitLink,
                    csuit: {
                      ...newCsuitLink.csuit,
                      role: selected || "",
                    },
                  });
                }}
              />
            </Grid.Col>

            <Grid.Col xs={12}>
              <Textarea
                id="newBio"
                name="newBio"
                value={newCsuitLink.csuit.bio || ""}
                onChange={(e) =>
                  setNewCsuitLink({
                    ...newCsuitLink,
                    csuit: { ...newCsuitLink.csuit, bio: e.target.value },
                  })
                }
                label="Bio"
                placeholder="Former SWE previosuly manager of the on prem server org."
              />
            </Grid.Col>

            <Grid.Col xs={12}>
              <FileInput
                label="Profile Pic"
                accept="image/png,image/jpeg"
                placeholder="Upload profile image"
                value={file}
                onChange={(files) => {
                  setFile(files ? files : null);
                }}
              />
            </Grid.Col>
          </Grid>
        </CreateEntityDialog>
      )}
    </>
  );
}

const CSuitSelectTag = ({
  label,
  value,
  onRemove,
  csuit,
  ...props
}: ISelectedRendererProps & { csuit?: any }) => {
  const icon = (
    <Avatar
      radius="xl"
      style={{ marginRight: 10, width: 25, height: 25 }}
      src={csuit.img_url}
      alt={label}
      size={15}
    />
  );
  return (
    <div {...props}>
      <RootTag
        label={label}
        value={value}
        onRemove={onRemove}
        startIcon={icon}
        subLabel={csuit.role}
      />
    </div>
  );
};

export default CSuitSelect;
