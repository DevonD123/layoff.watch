import React from "react";
import { Avatar } from "@mui/material";
import Chip, { ChipProps } from "@mui/material/Chip";
import Image from "next/image";

interface Props extends Pick<ChipProps, "onDelete" | "onClick"> {
  /**
   * Stock in caps or name with first upper
   */
  label: string;
  /**
   * if no logo url we use the placeholder avatar with text
   */
  logoUrl?: string;
  title?: string;
}
const size = 25;
function CompanyChip({ logoUrl, label, ...props }: Props) {
  return (
    <Chip
      {...props}
      variant="outlined"
      size="medium"
      label={label}
      avatar={
        <Avatar>
          {logoUrl ? (
            <Image
              src={`${logoUrl}?size=${size}&format=png`}
              alt={label}
              width={size}
              height={size}
              layout="fixed"
            />
          ) : (
            label.substring(0, 1)
          )}
        </Avatar>
      }
    />
  );
}

export default CompanyChip;
