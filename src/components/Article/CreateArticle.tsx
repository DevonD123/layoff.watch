import React, { useEffect, useMemo, useState } from "react";
import CompanySelect from "@c/Company/CompanySelect";
import PositionSelect, {
  IPositionOption,
  PositionSelectedChip,
} from "@c/Position/PositionSelect";
import CSuitSelect from "@c/Csuit/CSuitSelect";
import OrgSelect from "@c/Org/OrgSelect";
import {
  getCommaSeperatedText,
  getValueForWholeNumber,
} from "@c/Company/helper";
import SectionTitle from "./SectionTitle";
import CompanyCard from "./create/CompanyCard";
import AttachmentTag from "@c/Tag/AttachmentTag";
import { ICsuitLink } from "@c/Csuit/types";
import { IOrgOption } from "@c/Org/types";
import { ICompanyOption } from "@c/Company/types";
import {
  Container,
  Grid,
  Tooltip,
  Chip,
  TextInput,
  Textarea,
  Group,
  ActionIcon,
  FileInput,
  Divider,
  Text,
  Avatar,
  Title,
} from "@mantine/core";
import {
  IconCheck,
  IconCircleX,
  IconEditCircle,
  IconEye,
  IconUpload,
  IconLink,
  IconWritingSign,
  IconBriefcase,
  IconAffiliate,
} from "@tabler/icons";
import Link from "next/link";
import Editor from "@c/Editor/DynamicEditor";
import HtmlContent from "./HtmlContent";
import StandAloneTag from "@c/Tag/StandAloneTag";
import { useRouter } from "next/router";

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
  isOwner: boolean;
}

export interface ICompanyInfo {
  [key: string]: {
    name: string;
    csuit: ICsuitLink[];
    org: IOrgOption[];
  };
}

function CreateArticle({ isAdmin, isDraft, isOwner }: Props) {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);

  const [companies, setCompanies] = useState<ICompanyOption[]>([]);
  const [positions, setPositions] = useState<IPositionOption[]>([]);
  /**
   * companyInfo = key:company_id{...company,estimated:string, csuit: csuit[], org: org[]}
   */
  const [companyInfo, setCompanyInfo] = useState<any>({});
  const [curentContent, setCurrentContent] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [metadesc, setMetaDesc] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const { color, msg } = metaDescHelper(metadesc);

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
  const estimated = useMemo(() => {
    let total = 0;
    const keys = Object.keys(companyInfo);
    for (let i = 0; i < keys.length; i++) {
      const res = getValueForWholeNumber(companyInfo[keys[i]].estimated);
      if (res) {
        total += res;
      }
    }
    if (total <= 0) {
      return "";
    }
    return total > 999 ? getCommaSeperatedText(`${total}`) : total;
  }, [companyInfo]);

  return (
    <article style={{ display: "flex", height: "100%", position: "relative" }}>
      <Container>
        <Grid>
          <Grid.Col xs={12} md={8}>
            {isPreview ? (
              <Title order={1} align="center">
                <Text color={title ? "inherit" : "red"}>
                  {title || "Title is required"}
                </Text>
              </Title>
            ) : (
              <TextInput
                variant="unstyled"
                size="md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                styles={(theme) => ({
                  input: {
                    textAlign: "center",
                    fontSize: theme.headings.sizes.h1.fontSize,
                  },
                })}
                required
              />
            )}
          </Grid.Col>
          <Divider style={{ width: "100%" }} />
          <Grid.Col xs={12} md={4} style={{ paddingTop: 15 }}>
            <Grid style={{ paddingTop: 0 }}>
              <Grid.Col
                xs={4}
                style={{
                  paddingTop: 0,
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                }}
              >
                {Object.keys(companyInfo).map((x) => (
                  <React.Fragment key={companyInfo[x].id}>
                    <Link href={`#company_card_${x}`} passHref>
                      <Avatar
                        style={{ marginRight: 5 }}
                        size={20}
                        src={
                          companyInfo[x].logo_url &&
                          `${companyInfo[x].logo_url}?size=${20}&format=png`
                        }
                        alt={companyInfo[x].name}
                      >
                        {companyInfo[x].name.charAt(0)}
                      </Avatar>
                    </Link>
                  </React.Fragment>
                ))}
              </Grid.Col>
              <Grid.Col
                xs={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 0,
                }}
              >
                {estimated && (
                  <Text color="dimmed">{estimated} Employees Laid off.</Text>
                )}
              </Grid.Col>
              <Grid.Col xs={4} style={{ paddingTop: 0 }}></Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col xs={12}>
            {isPreview ? (
              currentContent ? (
                <HtmlContent html={curentContent} />
              ) : (
                <Text color="red" align="center">
                  Please add some content
                </Text>
              )
            ) : (
              <Editor value={curentContent} onChange={setCurrentContent} />
            )}
          </Grid.Col>
          <Grid.Col xs={12} style={{ paddingBottom: 0 }}>
            <SectionTitle title="Company/Exec Info" id="company_info" />
          </Grid.Col>
          <Grid.Col xs={12} style={{ paddingTop: 0 }}>
            {isPreview ? (
              <Group position="center">
                {positions.map((x) => (
                  <StandAloneTag
                    key={x.id}
                    label={x.name}
                    startIcon={
                      <IconBriefcase size="15" style={{ marginRight: 5 }} />
                    }
                    onClick={() => {
                      router.push(`/position/${x.id}`);
                    }}
                  />
                ))}
              </Group>
            ) : (
              <PositionSelect
                canCreate
                values={positions}
                onChange={setPositions}
              />
            )}
          </Grid.Col>
          {!isPreview && (
            <Grid.Col xs={12}>
              <CompanySelect
                canCreate
                filterIds={Object.keys(companyInfo)}
                values={companies}
                onChange={(companyList) => {
                  if (!companyList[0].id) {
                    return;
                  }
                  const info = { ...companyInfo };
                  const newCompany = companyList[0];
                  info[newCompany.id] = {
                    ...newCompany,
                    estimated: undefined,
                    org: [],
                    csuit: [],
                  };

                  setCompanyInfo(info);
                  setCompanies([]);
                }}
              />
            </Grid.Col>
          )}
          {Object.keys(companyInfo).map((company_id) => {
            return (
              <Grid.Col xs={6} md={4} key={company_id}>
                <CompanyCard
                  {...companyInfo[company_id]}
                  linkTo={`/company/${company_id}`}
                  onRemove={
                    isPreview
                      ? undefined
                      : () => {
                          const info = { ...companyInfo };
                          delete info[company_id];
                          setCompanyInfo(info);
                        }
                  }
                  isAdmin={isAdmin}
                  isDraft={isDraft}
                >
                  {isPreview ? (
                    <Group style={{ marginTop: 2 }}>
                      {companyInfo[company_id].csuit.map((x) => (
                        <StandAloneTag
                          key={x.csuit.id}
                          label={x.csuit.name}
                          subLabel={x.csuit.role}
                          onClick={() => {
                            router.push(`/exec/${x.csuit.id}`);
                          }}
                          startIcon={
                            <Avatar
                              radius="xl"
                              style={{ marginRight: 10, width: 25, height: 25 }}
                              src={x.csuit.img_url}
                              alt={x.csuit.name}
                              size={15}
                            />
                          }
                        />
                      ))}
                    </Group>
                  ) : (
                    <CSuitSelect
                      placeholder="Search Executives"
                      clearable={false}
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
                  )}
                  {isPreview ? (
                    <Group style={{ marginTop: 2 }}>
                      {companyInfo[company_id].org.map((x) => (
                        <StandAloneTag
                          key={x.id}
                          label={x.name}
                          subLabel={x.abbreviation}
                          onClick={() => {
                            router.push(`/org/${x.id}`);
                          }}
                          startIcon={
                            <IconAffiliate
                              size="12"
                              style={{ marginRight: 5 }}
                            />
                          }
                        />
                      ))}
                    </Group>
                  ) : (
                    <OrgSelect
                      placeholder="Search Internal Organizations"
                      clearable={false}
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
                  )}
                  {isPreview ? (
                    companyInfo[company_id].estimated ? (
                      <Text align="left" size="xs" color="dimmed">
                        Empoyees Laid off: {companyInfo[company_id].estimated}
                      </Text>
                    ) : null
                  ) : (
                    <TextInput
                      variant="unstyled"
                      placeholder="Estimated Layoff #"
                      id="est"
                      name="est"
                      size="xs"
                      icon={
                        <Text align="left" size="xs" color="dimmed">
                          Employees laid off:
                        </Text>
                      }
                      iconWidth={110}
                      value={companyInfo[company_id].estimated}
                      onChange={(e) => {
                        const result = getCommaSeperatedText(e.target.value);
                        if (result !== null) {
                          const res = {
                            ...companyInfo,
                          };
                          res[company_id].estimated = result;
                          setCompanyInfo(res);
                        }
                      }}
                    />
                  )}
                </CompanyCard>
              </Grid.Col>
            );
          })}
          <Grid.Col xs={12} />
          <Divider style={{ width: "100%" }} id="attachments" />
          <Grid.Col
            xs={12}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 0,
            }}
          >
            {isPreview ? (
              <Text component="span" color="dimmed" size="xs">
                {sourceUrl ? (
                  <>
                    <IconLink size="12" />{" "}
                    <Link href={sourceUrl} passHref>
                      <Text component="a">Source</Text>
                    </Link>
                  </>
                ) : (
                  "No source..."
                )}
              </Text>
            ) : (
              <TextInput
                style={{ margin: 0, padding: 0, width: "45%" }}
                variant="unstyled"
                placeholder="Fully qualified source URL..."
                size="xs"
                value={sourceUrl}
                icon={<IconLink size="12" />}
                onChange={(e) => {
                  const val = (e.target.value || "").trim();
                  if (val.length <= 0) {
                    return setSourceUrl(val);
                  }
                  return setSourceUrl(val.split(" ").join(""));
                }}
              />
            )}
            {isPreview ? (
              <Text
                component="span"
                color="dimmed"
                size="xs"
                style={{ minWidth: 100 }}
              >
                <IconWritingSign size="18" />{" "}
                {author ? (
                  <Link href={`/author/${encodeURIComponent(author)}`} passHref>
                    <Text component="a">{author}</Text>
                  </Link>
                ) : (
                  "No Author..."
                )}
              </Text>
            ) : (
              <TextInput
                style={{ margin: 0, padding: 0 }}
                variant="unstyled"
                placeholder="Author"
                size="xs"
                value={author}
                icon={<IconWritingSign size="18" />}
                onChange={(e) => setAuthor(e.target.value)}
              />
            )}
          </Grid.Col>
          <Divider my="sm" />
          {!isPreview && (
            <Grid.Col xs={12}>
              <FileInput
                variant="unstyled"
                placeholder="Attachments"
                multiple
                value={files}
                onChange={setFiles}
                icon={<IconUpload size={14} />}
              />
            </Grid.Col>
          )}
          <Grid.Col
            xs={12}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {files.map((x) => (
              <AttachmentTag
                key={x.name}
                url={x.name}
                title={x.name}
                isAdmin={isAdmin}
                isDraft={isDraft}
                onRemove={
                  isPreview
                    ? undefined
                    : () => setFiles(files.filter((f) => f.name !== x.name))
                }
              />
            ))}
          </Grid.Col>
          <Grid.Col xs={12} />
          {isAdmin && !isPreview && (
            <>
              <Grid.Col xs={12} md={8}>
                <SectionTitle title="Meta Data" id="admin" />
              </Grid.Col>
              <Grid.Col xs={12} md={4}></Grid.Col>
              <Grid.Col xs={12}>
                <TextInput
                  variant="unstyled"
                  placeholder="URL"
                  id="url"
                  name="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  label="Article Url (relative ie. netflix/layoffs-2021)"
                />
              </Grid.Col>
              <Grid.Col xs={12}>
                <Textarea
                  variant="default"
                  rows={5}
                  id="metadesc"
                  name="metaDesc"
                  value={metadesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  label="meta description"
                  description={<span style={{ color: color }}>{msg}</span>}
                  placeholder="start typeing"
                  style={{
                    marginBottom: "2em",
                    backgroundColor: "transparent",
                  }}
                />
              </Grid.Col>
            </>
          )}
        </Grid>
      </Container>
      {(isAdmin || isDraft) && (
        <Group spacing="md" style={{ position: "fixed", bottom: 5, left: 5 }}>
          {isAdmin && (
            <>
              <Tooltip label="Deny">
                <ActionIcon variant="light" color="red">
                  <IconCircleX />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Require changes">
                <ActionIcon
                  variant="light"
                  color="orange"
                  style={{ marginRight: ".5em", marginLeft: ".5em" }}
                >
                  <IconEditCircle />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Approve">
                <ActionIcon variant="light" color="green">
                  <IconCheck />
                </ActionIcon>
              </Tooltip>
            </>
          )}
          <Tooltip label={isPreview ? "Edit" : "Preview"}>
            <ActionIcon
              color="secondary"
              size="lg"
              variant="light"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? <IconEditCircle /> : <IconEye />}
            </ActionIcon>
          </Tooltip>
        </Group>
      )}
    </article>
  );
}

export default CreateArticle;
