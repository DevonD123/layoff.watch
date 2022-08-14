import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import SectionTitle from "../SectionTitle";

type Props = {
  files?: { title: string; url: string }[];
};

export default function Attachments({ files }: Props) {
  const AttachmentGrid = useMemo(() => {
    if (!files || files.length <= 0) {
      return null;
    }

    return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SectionTitle id="attachments" title="Attachments" />
        </Grid>
        {files.map((f) => (
          <Grid key={f.title} item xs={4} md={2}>
            File placeholder
          </Grid>
        ))}
      </Grid>
    );
  }, [files]);
  return AttachmentGrid;
}
