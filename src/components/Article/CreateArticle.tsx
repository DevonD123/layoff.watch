import { useEffect, useState } from "react";
import {
  Button,
  Container,
  useMediaQuery,
  Grid,
  Skeleton,
} from "@mui/material";
import { EditorState } from "draft-js";
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import convertToHtml from "@c/Editor/convertToHtml";
import TextInput from "@c/Editor/TextInput";
import UrlInput from "@c/Editor/UrlInput";
import FileUpload, { FileTypes } from "@c/Editor/FileUpload";
import CompanySelect from "@c/Company/CompanySelect";
import PositionSelect from "@c/Position/PositionSelect";
import CSuitSelect from "@c/Csuit/CSuitSelect";
import OrgSelect from "@c/Org/OrgSelect";
import {
  getCommaSeperatedText,
  getValueForWholeNumber,
} from "@c/Company/helper";
import PreviewDialog from "@c/Dialog/PreviewDialog";
import ShowArticle from "./ShowArticle";
import SectionTitle from "./SectionTitle";
import CompanyCard from "./create/CompanyCard";

import { ICsuitLink } from "@c/Csuit/types";
import { IOrgOption } from "@c/Org/types";
import { ICompanyOption } from "@c/Company/types";
import { IPositionOption } from "@c/Position/PositionSelect";

const WSIWIGDynamic = dynamic(() => import("@c/Editor/WSIWG"), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" width="100%" height="250px" />,
}) as any;

const metaDescHelper = (desc: string) => {
  if (!desc) {
    return { color: "inherit", msg: "Please add a meta description" };
  }
  if (desc.length < 100) {
    return {
      color: "red",
      msg: `Meta description is too short aim for 150-160 characters (currently: ${desc.length})`,
    };
  }
  if (desc.length > 160) {
    return {
      color: "red",
      msg: `Meta description is too long aim for 150-160 characters (currently: ${desc.length})`,
    };
  }
  return {
    color: desc.length >= 150 && desc.length <= 160 ? "green" : "yellow",
    msg: `Aim for 150-160 characters (currently: ${desc.length})`,
  };
};

interface Props {
  isAdmin: boolean;
  isDraft: boolean;
}

export interface ICompanyInfo {
  [key: string]: {
    name: string;
    csuit: ICsuitLink[];
    org: IOrgOption[];
  };
}

function CreateArticle({ isAdmin, isDraft }: Props) {
  const [openPreview, setOpenPreview] = useState(false);

  const [companies, setCompanies] = useState<ICompanyOption[]>([]);
  const [positions, setPositions] = useState<IPositionOption[]>([]);
  /**
   * companyInfo = key:company_id{name: company_name, csuit: csuit[], org: org[]}
   */
  const [companyInfo, setCompanyInfo] = useState<Partial<ICompanyInfo>>({});
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [curentContent, setCurrentContent] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [metadesc, setMetaDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [estimated, setEstimated] = useState("");
  const { color, msg } = metaDescHelper(metadesc);

  useEffect(() => {
    setCurrentContent(convertToHtml(editorState.getCurrentContent(), isAdmin));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  useEffect(() => {
    if (title) {
      const previos = title
        .substring(0, title.length - 1)
        .replace(/[^a-zA-Z0-9]/g, "-");
      if (!url || url === previos) {
        setUrl(title.replace(/[^a-zA-Z0-9\/]/g, "-"));
      }
    }
  }, [title, url]);

  useEffect(() => {
    if (url) {
      setUrl(url.replace(/[^a-zA-Z0-9\/\-]/g, ""));
    }
  }, [url]);

  function getPreviewProps() {
    return {
      title,
      companies,
      positions,
      info: companyInfo,
      body: curentContent,
      source: sourceUrl,
      employeeCount: getValueForWholeNumber(estimated),
      files: file
        ? [
            {
              title: file.name,
              url: `fileUploaded?type=${file.type}`,
            },
            {
              title: "file2_" + file.name,
              url: `fileUploaded?type=${file.type}`,
            },
          ]
        : [],
    };
  }

  return (
    <article style={{ display: "flex", height: "100%" }}>
      <Container style={{ width: "100%", paddingTop: 50 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={8}>
            <TextInput
              id="title"
              name="title"
              value={title}
              onChange={setTitle}
              label="Title"
              placeholder="Article Title*"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextInput
              id="est"
              name="est"
              value={estimated}
              onChange={(val) => {
                const result = getCommaSeperatedText(val);
                if (result !== null) {
                  setEstimated(result);
                }
              }}
              label="# of employees impacted"
            />
          </Grid>
          <Grid item xs={12}>
            <WSIWIGDynamic state={editorState} onChange={setEditorState} />
          </Grid>

          <Grid item xs={12}>
            <SectionTitle title="Company/Exec Info" id="company_info" />
          </Grid>
          <Grid item xs={12} md={6}>
            <CompanySelect
              canCreate
              values={companies}
              onChange={(companyList) => {
                const info = companyInfo;
                const res: ICompanyInfo = {};
                if (companyList && companyList.length >= 1) {
                  for (let i = 0; i < companyList.length; i++) {
                    if (info[companyList[i].id]) {
                      res[companyList[i].id] = info[companyList[i].id];
                    } else {
                      res[companyList[i].id] = {
                        name: companyList[i].name,
                        org: [],
                        csuit: [],
                      };
                    }
                  }
                }
                setCompanyInfo(res);
                setCompanies(companyList);
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PositionSelect
              canCreate
              showAbbrvWhenSelected
              values={positions}
              onChange={setPositions}
            />
          </Grid>
          {Object.keys(companyInfo).map((company_id) => {
            return (
              <Grid item xs={6} md={4} key={company_id}>
                <CompanyCard
                  id={`ext_info_${company_id}`}
                  title={companyInfo[company_id].name}
                >
                  <CSuitSelect
                    values={companyInfo[company_id].csuit}
                    onChange={(newArr) => {
                      const res = {
                        ...companyInfo,
                      };
                      res[company_id].csuit = newArr;
                      setCompanyInfo(res);
                    }}
                    canCreate
                    company_id={company_id}
                    companyName={companyInfo[company_id].name}
                  />
                  <OrgSelect
                    values={companyInfo[company_id].org}
                    onChange={(newArr) => {
                      const res = {
                        ...companyInfo,
                      };
                      res[company_id].org = newArr;
                      setCompanyInfo(res);
                    }}
                    canCreate
                    company_id={company_id}
                    companyName={companyInfo[company_id].name}
                  />
                </CompanyCard>
              </Grid>
            );
          })}
          <Grid item xs={12} />
          <Grid item xs={12} md={4}>
            <UrlInput
              id="sourceUrl"
              name="sourceUrl"
              value={sourceUrl}
              onChange={setSourceUrl}
              label="Information source url"
              placeholder="https://hackernews.com/mysource"
              helperText="Please include the full url (https://thewebsite.com)"
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <FileUpload
              id="fileUpload"
              name="fileUpload"
              value={file}
              onChange={(f: File | null) => setFile(f)}
              label={file ? "Replace attachment" : "Upload attachement"}
              accept={FileTypes.ProofDoc}
            />
          </Grid>
          <Grid item xs={12} style={{ textAlign: "right" }}>
            <Button
              color="secondary"
              variant="contained"
              style={{ marginRight: "2.5em" }}
              onClick={() => setOpenPreview(true)}
            >
              Preview Article
            </Button>
            {isAdmin && isDraft && (
              <>
                <Button variant="contained" color="error">
                  Deny
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  style={{ marginRight: ".5em", marginLeft: ".5em" }}
                >
                  Needs Work
                </Button>
                <Button variant="contained" color="info">
                  Approve
                </Button>
                <br />
                <br />
              </>
            )}
          </Grid>
          {isAdmin && (
            <>
              <Grid item xs={12}>
                <SectionTitle title="Meta Data" id="admin" />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  id="url"
                  name="url"
                  value={url}
                  onChange={setUrl}
                  label="Article Url (relative ie. netflix/layoffs-2021)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  id="metadesc"
                  name="metaDesc"
                  value={metadesc}
                  onChange={setMetaDesc}
                  label="meta description"
                  isTextField
                  helperText={<span style={{ color: color }}>{msg}</span>}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Container>
      {openPreview && (
        <PreviewDialog open={openPreview} onClose={() => setOpenPreview(false)}>
          <ShowArticle isDialog {...getPreviewProps()} />
        </PreviewDialog>
      )}
    </article>
  );
}

export default CreateArticle;
