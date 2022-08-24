import React, { useState, useEffect, useMemo } from "react";
import { useCompanies, addCompanyAsDraft } from "./db";
import CreateEntityDialog from "@c/Dialog/CreateEntityDialog";
import TextInput from "@c/Editor/TextInput";
import Image from "next/image";
import showMsg from "@h/msg";
import { ICompanyOption } from "./types";
import { getCommaSeperatedText } from "./helper";
import Select, { IOption, ISelectedRendererProps } from "@c/Input/Select";
import { Avatar, Grid, Text } from "@mantine/core";
import RootTag from "@c/Tag/RootTag";
import CompanyAddEditDialog from "./CompanyAddEditDialog";

type Props = {
  canCreate?: boolean;
  onChange: (arr: any) => void;
  values: any[];
  filterIds?: string[];
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

function CompanySelect({ canCreate, onChange, values, filterIds }: Props) {
  const { data, status } = useCompanies();
  const isLoading = status === "loading";
  // const [selectedCompany, setSelectedCompany] = useState<ICompanyOption[]>([]);
  const [localCompanies, setLocalCompanies] = useState<ICompanyOption[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [newCompany, setNewCompany] =
    useState<ICompanyOption>(defaultNewCompany);

  async function acceptCreate() {
    if (!canCreate) return setCreateOpen(false);

    const errors = [];
    if (!newCompany.name) {
      errors.push("Company name is required");
    }

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
    } else {
      for (let i = 0; i < errors.length; i++) {
        showMsg(errors[i]);
      }
    }
  }
  useEffect(() => {
    if (!createOpen) {
      setNewCompany(defaultNewCompany);
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
  const labledOptions = useMemo(() => {
    const res: any[] = (data || []).concat(localCompanies);

    if (filterIds && filterIds.length >= 1) {
      return res
        .filter((x) => !filterIds.includes(x.id))
        .map((x: any) => ({ ...x, value: x.id, label: x.name }));
    }

    return res.map((x: any) => ({ ...x, value: x.id, label: x.name }));
  }, [data, localCompanies, filterIds]);

  const valuesMemo = useMemo(() => {
    return values.map((x) => x.id);
  }, [values]);
  return (
    <>
      <Select
        label="Companies"
        disabled={isLoading}
        id="companySelectMan"
        name="companySelectMan"
        placeholder={isLoading ? "Loading..." : "Search Companies"}
        options={labledOptions}
        values={valuesMemo}
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
                setNewCompany({
                  ...newCompany,
                  name: name[0].toUpperCase() + name.substring(1),
                });
                setCreateOpen(true);
                return "";
              }
            : undefined
        }
        renderValue={CompanySelectTag}
      />
      {canCreate && createOpen && (
        <CompanyAddEditDialog
          data={newCompany}
          onAccept={acceptCreate}
          onClose={() => {
            setCreateOpen(false);
            setNewCompany(defaultNewCompany);
          }}
          isOpen={createOpen}
          onChange={(val, field) =>
            setNewCompany({ ...newCompany, [field]: val })
          }
          isCreateMode
        />
      )}
    </>
  );
}

const CompanySelectTag = ({
  label,
  value,
  onRemove,
  ticker,
  logo_url,
  ...props
}: ISelectedRendererProps & { ticker?: string; logo_url?: string }) => {
  const icon = logo_url ? (
    <Avatar
      style={{ marginRight: 10 }}
      src={`${logo_url}?size=${15}&format=png`}
      alt={label}
      size={15}
    />
  ) : (
    <></>
  );
  return (
    <div {...props}>
      <RootTag
        label={label}
        value={value}
        onRemove={onRemove}
        subLabel={ticker}
        startIcon={icon}
      />
    </div>
  );
};

export default CompanySelect;
