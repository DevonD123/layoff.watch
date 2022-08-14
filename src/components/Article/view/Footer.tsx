import React, { useMemo } from "react";
import { Divider, Typography } from "@mui/material";
import Link from "next/link";
import { isValidURl, preRedirectAppend } from "@c/Editor/convertToHtml";

type Props = { author?: string; source?: string };

export default function Footer({ author, source }: Props) {
  const Source = useMemo(() => {
    if (!source) {
      return null;
    }
    let viewUrl = source || "";
    viewUrl = viewUrl.replace("http://", "");
    viewUrl = viewUrl.replace("http://www.", "");
    viewUrl = viewUrl.replace("https://", "");
    viewUrl = viewUrl.replace("https://www.", "");

    return (
      <Typography color="text.secondary" variant="caption">
        Source:{" "}
        {isValidURl(source) ? (
          <Link href={preRedirectAppend(source)} passHref>
            <a target="_blank" rel="noopener noreferrer">
              {viewUrl}
            </a>
          </Link>
        ) : (
          <span style={{ color: "red" }}>Invalid Link</span>
        )}
      </Typography>
    );
  }, [source]);
  return (
    <>
      <Divider />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 225,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {Source}
        </div>
        <div>
          <Typography color="text.secondary" variant="caption">
            {author || "Unverified author"}
          </Typography>
        </div>
      </div>
    </>
  );
}
