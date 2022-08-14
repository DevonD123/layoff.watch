import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { getCommaSeperatedText } from "@c/Company/helper";

type Props = {
  title: string;
  layoffCount?: number;
};

function ArticleTitle({ title, layoffCount }: Props) {
  const LayoffCount = useMemo(() => {
    let count = "";
    if (layoffCount) {
      const stringRes = getCommaSeperatedText("" + layoffCount);
      if (stringRes) {
        count = stringRes;
      }
    }
    if (!count) {
      return null;
    }
    return (
      <Typography
        color="text.secondary"
        variant="subtitle2"
        component="h3"
        textAlign="center"
      >
        {count} Employees Layed off
      </Typography>
    );
  }, [layoffCount]);
  return (
    <>
      <Typography
        color="primary"
        variant="h1"
        component="h1"
        textAlign="center"
        gutterBottom={false}
      >
        {title}
      </Typography>
      {LayoffCount}
    </>
  );
}

export default ArticleTitle;
