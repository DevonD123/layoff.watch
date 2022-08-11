import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import convertToHtml from "@c/Editor/convertToHtml";
// import { convertToHTML } from "draft-convert";

import AdminNavbar from "@c/Navbar/AdminNavbar";
import { EditorState } from "draft-js";
import DOMPurify from "dompurify";
import TextInput from "@c/Editor/TextInput";
import FileUpload, { FileTypes } from "@c/Editor/FileUpload";
import SearchSelect, { EntityType } from "@c/Editor/SearchSelect";
import UrlInput from "@c/Editor/UrlInput";
import { Button } from "@mui/material";

const WSIWIGDynamic = dynamic(() => import("@c/Editor/WSIWG"), {
  ssr: false,
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
const isAdmin = true;
const isDraft = true;
const Home: NextPage = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [curentContent, setCurrentContent] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [metadesc, setMetaDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [estimated, setEstimated] = useState(10);
  const { color, msg } = metaDescHelper(metadesc);

  useEffect(() => {
    setCurrentContent(convertToHtml(editorState.getCurrentContent(), isAdmin));
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

  const postTitle = isDraft ? "Approve Post" : "Create Post";

  return (
    <>
      <Head>
        <title>{postTitle}</title>
      </Head>
      <article>
        <AdminNavbar />
        <h1 style={{ textAlign: "center" }}>{postTitle}</h1>
        <div style={{ display: "flex", height: "100%" }}>
          <div
            style={{
              width: "49%",
              marginRight: "2%",
              padding: 5,
            }}
          >
            <TextInput
              id="title"
              name="title"
              value={title}
              onChange={setTitle}
              label="Title"
              placeholder="Article Title*"
            />

            <SearchSelect
              name="companies"
              search={EntityType.Company}
              searchText=""
              id="companies"
              label="Companies"
              values={[]}
              onSelect={(vals: string[]) => {}}
            />

            <SearchSelect
              name="csuit"
              search={EntityType.CSuit}
              searchText=""
              id="csuit"
              label="Csuit"
              values={[]}
              onSelect={(vals: string[]) => {}}
            />

            <SearchSelect
              name="orgs"
              search={EntityType.Org}
              searchText=""
              id="orgs"
              label="Company Orgs"
              values={[]}
              onSelect={(vals: string[]) => {}}
            />

            <SearchSelect
              name="positions"
              search={EntityType.Position}
              searchText=""
              id="positions"
              label="Positions Affected"
              values={[]}
              onSelect={(vals: string[]) => {}}
            />

            <TextInput
              id="est"
              name="est"
              value={estimated}
              onChange={setEstimated}
              label="# of employees impacted"
            />

            <WSIWIGDynamic state={editorState} onChange={setEditorState} />
            <br />
            <UrlInput
              id="sourceUrl"
              name="sourceUrl"
              value={sourceUrl}
              onChange={setSourceUrl}
              label="Information source"
              placeholder="https://hackernews.com/mysource"
            />

            {/* TODO impliment file upload */}
            <FileUpload
              id="fileUpload"
              name="fileUpload"
              value={file}
              onChange={(f: File | null) => setFile(f)}
              label={file ? "Replace attachment" : "Upload attachement"}
              accept={FileTypes.ProofDoc}
            />
            {isAdmin && (
              <fieldset
                style={{ marginRight: 0, marginLeft: 0, marginTop: "2em" }}
              >
                <legend>Admin Section</legend>

                {isDraft && (
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

                <TextInput
                  id="url"
                  name="url"
                  value={url}
                  onChange={setUrl}
                  label="Article Url (relative ie. netflix/layoffs-2021)"
                />

                <TextInput
                  id="metadesc"
                  name="metaDesc"
                  value={metadesc}
                  onChange={setMetaDesc}
                  label="meta description"
                  isTextField
                  helperText={<span style={{ color: color }}>{msg}</span>}
                />
              </fieldset>
            )}
          </div>
          <div style={{ width: "49%", padding: 5 }} className="content">
            <h1 style={{ textAlign: "center" }}>{title}</h1>
            {curentContent && (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(curentContent),
                }}
              />
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default Home;
