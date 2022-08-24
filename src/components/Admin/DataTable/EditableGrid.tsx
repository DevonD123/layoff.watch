import { useState, PropsWithChildren } from "react";
import DataTable from "@c/Admin/DataTable";
import { showFetchResult } from "@h/msg/msg";
import ConfirmDeleteDialog from "@c/Dialog/ConfirmDeleteDialog";

interface IProps {
  entity: "csuit" | "position" | "company" | "org";
  headings: string[];
  /* eg. exec/{ID} -> the {ID} will be string replaced with the actual id */
  linkUrl: string;
  onEditClicked?: (el: any) => void;
  /*
    elList will be array of tr's
    el must be the original data
  */
  rowmapper: (el: any, index: number) => { elList: React.ReactNode[]; el: any };
  refetch: () => void;
  data?: null | any[];
}

const TextMap = {
  deleteMsg: {
    csuit: "Are you sure you want to delete this executive?",
    position: "Are you sure you want to delete this title/position?",
    company: "Are you sure you want to delete this company?",
    org: "Are you sure you want to delete this organization?",
  },
};

const EditableGrid = ({
  entity,
  headings,
  linkUrl,
  onEditClicked,
  rowmapper,
  data,
  refetch,
}: PropsWithChildren<IProps>) => {
  const [deleteId, setDeleteId] = useState("");
  const getLink = (el: any) => linkUrl.replace("{ID}", el.id);

  const doApiRequest = async (body: any) => {
    const res = await fetch("/api/status", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    });
    await showFetchResult(res, () => refetch());
  };

  const onApproveClicked = async (el: any) => {
    await doApiRequest({ id: el.id, action: "approve", entity });
  };
  const onDenyClicked = async (el: any) => {
    await doApiRequest({ id: el.id, action: "deny", entity });
  };
  const onDeleteClicked = async (el: any) => {
    setDeleteId(el.id);
  };
  const doDelete = async () => {
    const id = deleteId;
    setDeleteId("");
    await doApiRequest({ id, action: "delete", entity });
  };

  const handleEditClicked =
    typeof onEditClicked === "function" ? onEditClicked : undefined;

  return (
    <>
      <DataTable
        onApproveClicked={onApproveClicked}
        onDenyClicked={onDenyClicked}
        onEditClicked={handleEditClicked}
        onDeleteClicked={onDeleteClicked}
        getLinkUrl={getLink}
        data={data || undefined}
        heading={headings.map((h) => (
          <th key={h}>{h}</th>
        ))}
        rowmapper={rowmapper}
      />
      <ConfirmDeleteDialog
        msg={TextMap.deleteMsg[entity]}
        onClose={() => setDeleteId("")}
        open={Boolean(deleteId)}
        onDelete={doDelete}
      />
    </>
  );
};

export default EditableGrid;
