import React, { useMemo } from "react";
import { Container } from "@mui/material";
import SectionTitle from "./SectionTitle";
import { IPositionOption } from "@c/Position/PositionSelect";
import { ICompanyOption } from "@c/Company/types";
import { ICompanyInfo } from "./CreateArticle";
import PositionChipGroup from "@c/Position/PositionChipGroup";
import CompanyFullInfoTag from "@c/Company/CompanyFullInfoTag";
import ArticleTitle from "./view/Title";
import ArticleBody from "./view/Body";
import ArticleFooter from "./view/Footer";
import ArticleAttachment from "./view/Attachments";

interface Props {
  isDialog?: boolean;
  title: string;
  employeeCount?: number;
  body?: string;
  source?: string;
  author?: string;
  files?: {
    title: string;
    url: string;
  }[];
  info: ICompanyInfo[];
  companies: ICompanyOption[];
  positions: IPositionOption[];
}

function ShowArticle({
  isDialog,
  title,
  body,
  source,
  files,
  author,
  employeeCount,
  companies,
  positions,
  info,
}: Props) {
  const Positions = useMemo(() => {
    if (!positions || positions.length <= 0) {
      return null;
    }
    return <PositionChipGroup items={positions} allowLink />;
  }, [positions]);

  const CompanyList = useMemo(() => {
    if (!companies || companies.length <= 0) {
      return null;
    }
    const compList: any = companies;
    const ids = Object.keys(info);
    for (let i = 0; i < ids.length; i++) {
      const cIndex = compList.findIndex((x) => x.id === ids[i]);
      if (cIndex) {
        compList[cIndex].orgs = info[ids[i]].org;
        compList[cIndex].csuits = info[ids[i]].csuit;
      }
    }

    return <CompanyFullInfoTag items={compList} allowLink />;
  }, [companies, info]);

  return (
    <Container
      className="content"
      style={isDialog ? { marginTop: "none" } : {}}
    >
      <ArticleTitle title={title} layoffCount={employeeCount} />
      <SectionTitle title="Summary" id="summary" />
      <ArticleBody content={body} />
      <SectionTitle title="Extended Info" id="ext_info" />
      {Positions}
      {CompanyList}
      <ArticleAttachment files={files} />
      <ArticleFooter source={source} author={author} />
    </Container>
  );
}

export default ShowArticle;
