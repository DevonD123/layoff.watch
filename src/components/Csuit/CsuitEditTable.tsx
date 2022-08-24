import { useState } from "react";
import { usePagedCsuit } from "@c/Csuit/db";
import PageComponent from "@c/Admin/DataTable/PageComponent";
import { ActionIcon, Avatar, Text } from "@mantine/core";
import Image from "next/image";
import CsuitEditDialog from "./CsuitEditDialog";
import { EditableGrid, usePgData } from "@c/Admin/DataTable";
import { IconLink } from "@tabler/icons";

const CsuitEditTable = () => {
  const [edit, setEdit] = useState<null | any>(null);
  const { pg, movePg } = usePgData();
  const { data, isLoading, refetch, status } = usePagedCsuit(pg);

  function rowMapper(csuit: any) {
    return {
      elList: [
        <td key={`csuit_${csuit.id}_name`}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar style={{ height: 20, width: 20 }}>
              {csuit.img_url && (
                <Image
                  src={csuit.img_url}
                  height={20}
                  width={20}
                  alt={csuit.name}
                />
              )}
            </Avatar>
            <div style={{ marginLeft: 5 }}>
              <Text>{csuit.name}</Text>
              <Text size="xs" color="dimmed">
                {csuit.role}
              </Text>
            </div>
          </div>
        </td>,
        <td key={`csuit_${csuit.id}_bio`}>{csuit.bio}</td>,
        <td key={`csuit_${csuit.id}_link`}>
          <ActionIcon color="blue">
            <IconLink />
          </ActionIcon>
        </td>,
      ],
      el: csuit,
    };
  }

  return (
    <>
      <EditableGrid
        data={data?.rows}
        entity="company"
        headings={["Name", "Bio", ""]}
        linkUrl="/csuit/{ID}"
        refetch={refetch}
        rowmapper={rowMapper}
        onEditClicked={setEdit}
      />
      <PageComponent onMove={movePg} pg={pg} total={data?.count || 0} />
      <CsuitEditDialog
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
