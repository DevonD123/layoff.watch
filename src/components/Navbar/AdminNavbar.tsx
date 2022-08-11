import React from "react";

type Props = {};

function AdminNavbar({}: Props) {
  return (
    <>
      <div
        style={{
          width: "100%",
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          height: 50,
          padding: `5px 20px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a href="/admin">Admin Section</a>
        <div>
          <a href="/admin/users">Users</a> &nbsp;
          <a href="/admin/submissions">Subs</a> &nbsp;
          <a href="/admin">Create</a> &nbsp;
        </div>
      </div>
      <div style={{ width: "100%", height: 55 }}></div>
    </>
  );
}

export default AdminNavbar;
