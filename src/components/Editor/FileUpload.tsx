/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Button, Grid } from "@mui/material";
export enum FileTypes {
  ProofDoc = ".pdf,.doc,.docx,image/*",
}
type Props = {
  id: string;
  name: string;
  label: string;
  value: File | null;
  onChange: (f: File | null) => void;
  accept: FileTypes;
};

/**
 * Single file only
 */
function FileUpload({ id, name, label, accept, onChange }: Props) {
  const [uploadimg, setuploadimg] = useState("");
  function handleChange(e: any) {
    const files = e.target.files;
    let upload = "";
    if (files && files.length >= 1) {
      if (files[0]["type"].split("/")[0] === "image") {
        upload = URL.createObjectURL(files[0]);
      } else {
        upload = "/docplaceholder.png";
      }
    }
    setuploadimg(upload);
    onChange(files[0] || null);
  }
  function handleClear() {
    setuploadimg("");
    onChange(null);
  }
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {uploadimg && (
        <img
          src={uploadimg}
          alt="upload image"
          style={{ maxWidth: 200, maxHeight: 200 }}
        />
      )}
      <div style={{ marginTop: uploadimg ? ".5em" : "" }}>
        <Button component="label" htmlFor={id} variant="contained" color="info">
          {label}
          <input
            type="file"
            hidden
            name={name}
            accept={accept}
            id={id}
            onChange={handleChange}
          />
        </Button>
        {uploadimg && (
          <Button
            variant="outlined"
            style={{ marginLeft: ".5em" }}
            color="error"
            onClick={handleClear}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
