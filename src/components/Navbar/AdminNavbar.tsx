import React from "react";
import Link from "next/link";
import { Paper } from "@mui/material";

type Props = {};

function AdminNavbar({}: Props) {
  return (
    <>
      <Paper
        elevation={0}
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
        <Link href="/admin" passHref>
          <a>Admin Section</a>
        </Link>
        <div>
          <Link href="/admin/users" passHref>
            <a>Users</a>
          </Link>
          &nbsp;
          <Link href="/admin/submission" passHref>
            <a>Subs</a>
          </Link>
          &nbsp;
          <Link href="/admin" passHref>
            <a>Create</a>
          </Link>
        </div>
      </Paper>
      <div style={{ width: "100%", height: 55 }}></div>
    </>
  );
}

export default AdminNavbar;
