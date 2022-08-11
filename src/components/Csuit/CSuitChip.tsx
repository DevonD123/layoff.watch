import React from "react";
import { Avatar } from "@mui/material";
import Chip, { ChipProps } from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";
import Image from "next/image";

interface Props extends Pick<ChipProps, "onDelete" | "onClick"> {
  /**
   * Full name
   */
  label: string;
  /**
   * Currenct company
   */
  secondaryLabel?: string;
  /**
   * currently not in use - will need to store images on own iumg server
   */
  logoUrl?: string;
}
const size = 25;
function CSuitChip({ logoUrl, label, secondaryLabel, ...props }: Props) {
  return (
    <Chip
      {...props}
      variant="outlined"
      size="medium"
      style={{ height: "auto" }}
      label={
        secondaryLabel ? (
          <div style={{ display: "block" }}>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "20rem",
              }}
            >
              {label}
            </div>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "20rem",
              }}
            >
              {secondaryLabel}
            </div>
          </div>
        ) : (
          label
        )
      }
      icon={!logoUrl ? <FaceIcon /> : undefined}
      avatar={
        (logoUrl && (
          <Avatar>
            <Image
              //   loader={myLoader}
              src={`${logoUrl}?size=${size}&format=png`}
              alt={label}
              width={size}
              height={size}
              layout="fixed"
            />
          </Avatar>
        )) ||
        undefined
      }
    />
  );
}

export default CSuitChip;
