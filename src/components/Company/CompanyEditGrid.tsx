import React, { useState } from "react";
import { usePgData, EditableGrid, PageComponent } from "@c/Admin/DataTable";
import { usePagedCompanies } from "./db";
import { Avatar, Text } from "@mantine/core";
import Image from "next/image";
import CompanyAddEditDialog from "./CompanyAddEditDialog";

function CompanyEditGrid() {
  const [edit, setEdit] = useState<null | any>(null);
  const { pg, movePg } = usePgData();
  const { data, isLoading, refetch, status } = usePagedCompanies(pg);
  function rowMapper(company: any) {
    return {
      elList: [
        <td key={`company_${company.id}_name`}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar style={{ height: 20, width: 20 }}>
              {company.logo_url && (
                <Image
                  src={company.logo_url}
                  height={20}
                  width={20}
                  alt={company.name}
                />
              )}
            </Avatar>
            <div style={{ marginLeft: 5 }}>
              <Text>{company.name}</Text>
              <Text color="dimmed" size="xs">
                {company.ticker}
              </Text>
            </div>
          </div>
        </td>,
        <td key={`company_${company.id}_description`}>
          {company.description}
        </td>,
        <td key={`company_${company.id}_est_employee_count`}>
          {company.est_employee_count}
        </td>,
      ],
      el: company,
    };
  }
  return (
    <>
      <EditableGrid
        data={data?.rows}
        entity="company"
        headings={["Name", "Description", "Employees"]}
        linkUrl="/company/{ID}"
        refetch={refetch}
        rowmapper={rowMapper}
        onEditClicked={setEdit}
      />
      <PageComponent onMove={movePg} pg={pg} total={data?.count || 0} />
      <CompanyAddEditDialog
        data={edit}
        onAccept={() => {
          // save
          alert("TODO save");
          setEdit(null);
        }}
        onClose={() => setEdit(null)}
        isOpen={Boolean(edit)}
        onChange={(val, field) => setEdit({ ...edit, [field]: val })}
      />
    </>
  );
}

export default CompanyEditGrid;
