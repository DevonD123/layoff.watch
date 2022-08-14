import React, { useState, useEffect } from "react";
import SearchSelect from "@c/Editor/SearchSelect";
import { useCompanies, addCompanyAsDraft } from "./db";
import CompanyChip from "./CompanyChip";
import CreateEntityDialog from "@c/Dialog/CreateEntityDialog";
import { Grid, Typography } from "@mui/material";
import TextInput from "@c/Editor/TextInput";
import Image from "next/image";
import showMsg from "@h/msg";
import { ICompanyOption } from "./types";
import { getCommaSeperatedText } from "./helper";

type Props = {
  canCreate?: boolean;
  multiple?: boolean;
  showAbbrvWhenSelected?: boolean;
  onChange: (arr: any) => void;
  values: any[];
};

const defaultNewCompany = {
  id: "__",
  name: "",
  logo_url: "",
  ticker: "",
  description: "",
  est_employee_count: "",
  is_draft: true,
};

function CompanySelect({
  canCreate,
  multiple = true,
  onChange,
  values,
  showAbbrvWhenSelected = false,
}: Props) {
  const { data, status } = useCompanies();
  const isLoading = status === "loading";
  // const [selectedCompany, setSelectedCompany] = useState<ICompanyOption[]>([]);
  const [localCompanies, setLocalCompanies] = useState<ICompanyOption[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [newCompany, setNewCompany] =
    useState<ICompanyOption>(defaultNewCompany);

  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState<
    { msg: string; sev?: "error" | "warning" }[]
  >([]);
  async function acceptCreate() {
    if (!canCreate) return setCreateOpen(false);

    const errors = [];
    if (!newCompany.name) {
      errors.push({ msg: "Company name is required" });
    }

    setErrors(errors);

    if (errors.length <= 0) {
      const res = await addCompanyAsDraft({
        name: newCompany.name,
        logo_url: newCompany.logo_url,
        ticker: newCompany.ticker,
        description: newCompany.description,
        est_employee_count: newCompany.est_employee_count as string,
      });

      if (res) {
        const allLocalCompanies = [...localCompanies, res];
        setLocalCompanies(allLocalCompanies);
        // setSelectedCompany([...selectedCompany, res]);
        onChange([...values, res]);
        setCreateOpen(false);
        localStorage.setItem(
          "local_draft_companies",
          JSON.stringify(allLocalCompanies)
        );
        if (res.is_draft) {
          showMsg(`You have added ${res.name} to our database!`, "success");
        }
      }
    }
  }
  useEffect(() => {
    if (createOpen) {
      setNewCompany(defaultNewCompany);
      setErrors([]);
    }
  }, [createOpen]);

  useEffect(() => {
    const lsCompanies = localStorage.getItem("local_draft_companies");
    if (lsCompanies) {
      try {
        // need to de dupe so when approved it is cleared
        setLocalCompanies(JSON.parse(lsCompanies) || []);
      } catch {
        console.error("error parsing lc companies");
      }
    }
  }, []);

  return (
    <>
      <SearchSelect
        loadingValues={isLoading}
        id="companySelect"
        name="companySelect"
        // values={selectedCompany}
        values={values}
        onSelect={(allSelected: ICompanyOption[]) =>
          // setSelectedCompany(allSelected || [])
          onChange(allSelected || [])
        }
        label="Companies"
        placeholder="Microsoft"
        multiple={multiple}
        createClicked={
          canCreate
            ? () => {
                setCreateOpen(true);
              }
            : undefined
        }
        options={(data || []).concat(localCompanies)}
        renderTags={(value: ICompanyOption[], getTagProps) =>
          value.map((option: ICompanyOption, index: number) => (
            // eslint-disable-next-line react/jsx-key
            <CompanyChip
              logoUrl={option.logo_url}
              label={
                showAbbrvWhenSelected && option.ticker
                  ? option.ticker
                  : option.name
              }
              {...getTagProps({ index })}
            />
          ))
        }
        getOptionLabel={(opt) =>
          opt.ticker ? `${opt.ticker} | ${opt.name}` : opt.name
        }
      />
      {canCreate && createOpen && (
        <CreateEntityDialog
          onAccept={acceptCreate}
          onClose={() => setCreateOpen(false)}
          open={createOpen}
          title="Add a company to our database"
          body=""
          isLoading={false}
          errorList={errors}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextInput
                id="newName"
                name="newName"
                value={newCompany.name}
                onChange={(name) => {
                  if (name.length >= 1) {
                    const char1 = name[0].toUpperCase();
                    setNewCompany({
                      ...newCompany,
                      name: char1 + name.substring(1),
                    });
                  } else {
                    setNewCompany({ ...newCompany, name });
                  }
                }}
                label="Company Name"
                placeholder="Microsoft"
              />
            </Grid>
            <Grid item xs={6}>
              <TextInput
                id="newTicker"
                name="newTicker"
                value={newCompany.ticker || ""}
                onChange={(ticker) => {
                  if (ticker[0] && !/[a-zA-Z1-9]/.test(ticker[0])) {
                    return;
                  }
                  setNewCompany({
                    ...newCompany,
                    ticker: ticker.toUpperCase(),
                  });
                }}
                label="Stock Symbol"
                placeholder="MSFT"
              />
            </Grid>
            <Grid item xs={6}>
              <TextInput
                id="newEstEmployeeCount"
                name="newEstEmployeeCount"
                value={newCompany.est_employee_count || ""}
                onChange={(est_employee_count) => {
                  const result = getCommaSeperatedText(est_employee_count);
                  if (result !== null) {
                    setNewCompany({
                      ...newCompany,
                      est_employee_count: result,
                    });
                  }
                }}
                label="Estimated Employees"
                placeholder="221,000"
              />
            </Grid>
            <Grid item xs={8}>
              <TextInput
                id="newLogoUrl"
                name="newLogoUrl"
                value={newCompany.logo_url || ""}
                onChange={(logo_url) =>
                  setNewCompany({
                    ...newCompany,
                    logo_url: logo_url.split(" ").join("").trim(),
                  })
                }
                label="Domain Name"
                helperText="eg. company.com | preview shows once you click away"
                placeholder="microsoft.com"
                onBlur={() => {
                  if (
                    newCompany.logo_url &&
                    newCompany.logo_url.includes(".") &&
                    newCompany.logo_url.length >= 3 &&
                    !newCompany.logo_url.includes("/")
                  ) {
                    setPreviewUrl(
                      `https://logo.clearbit.com/${newCompany.logo_url}`
                    );
                  } else {
                    setPreviewUrl("");
                    setNewCompany({
                      ...newCompany,
                      logo_url: "",
                    });
                    showMsg(
                      'Invalid domain make sure it does not have any special characters and has a single "." with atleast 3 characters'
                    );
                  }
                }}
              />
            </Grid>
            <Grid
              item
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
                  <Typography>Logo Preview...</Typography>
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextInput
                id="newDescription"
                name="newDescription"
                value={newCompany.description || ""}
                onChange={(description) =>
                  setNewCompany({ ...newCompany, description })
                }
                label="Description"
                placeholder="Global diversified tech company."
                isTextField
              />
            </Grid>
          </Grid>
        </CreateEntityDialog>
      )}
    </>
  );
}

export default CompanySelect;
