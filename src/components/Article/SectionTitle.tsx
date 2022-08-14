import React from "react";
import { Divider, Typography } from "@mui/material";

function SectionTitle({ title, id }: { title: string; id: string }) {
  return (
    <div style={{ display: "flex", marginTop: 10, marginBottom: 5 }}>
      <div
        style={{
          flex: 0,
          display: "flex",
          alignItems: "center",
          paddingRight: 10,
        }}
      >
        <Divider style={{ width: 30 }} />
      </div>
      <div>
        <Typography color="primary" variant="subtitle1" id={id}>
          {title}
        </Typography>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          paddingLeft: 10,
        }}
      >
        <Divider style={{ width: "100%" }} />
      </div>
    </div>
  );
}

export default SectionTitle;
