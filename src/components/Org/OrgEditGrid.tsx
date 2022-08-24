import { useState } from "react";
import { usePagedOrgs } from "./db";
import PageComponent from "@c/Admin/DataTable/PageComponent";
import { Text } from "@mantine/core";
import OrgAddEditDialog from "./OrgAddEditDialog";
import { EditableGrid, usePgData } from "@c/Admin/DataTable";
import Link from "next/link";

const CsuitEditTable = () => {
  const [edit, setEdit] = useState<null | any>(null);
  const { pg, movePg } = usePgData();
  const { data, isLoading, refetch, status } = usePagedOrgs(pg);

  function rowMapper(org: any) {
    return {
      elList: [
        <td key={`org_${org.id}_name`}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ marginLeft: 5 }}>
              <Text>{org.name}</Text>
              <Text size="xs" color="dimmed">
                {org.abbreviation}
              </Text>
            </div>
          </div>
        </td>,
        <td key={`org_${org.id}description`}>{org.description}</td>,
        <td key={`org_${org.id}_count`}>{org.est_employee_count}</td>,
        <td key={`org_${org.id}_company`}>
          <Link passHref href={`/admin/company/${org.company_id}`}>
            <a target="__blank">{org.company?.name || org.company_id}</a>
          </Link>
        </td>,
      ],
      el: org,
    };
  }

  return (
    <>
      <EditableGrid
        data={data?.rows}
        entity="company"
        headings={["Name", "Description", "Employee #", "Company"]}
        linkUrl="/org/{ID}"
        refetch={refetch}
        rowmapper={rowMapper}
        onEditClicked={setEdit}
      />
      <PageComponent onMove={movePg} pg={pg} total={data?.count || 0} />
      <OrgAddEditDialog
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
};

export default CsuitEditTable;
