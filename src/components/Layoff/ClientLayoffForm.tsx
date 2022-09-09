import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Grid,
  TextInput,
  Textarea,
  Checkbox,
  Chip,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import CompanySelect from "@c/Company/CompanySelect";
import PositionSelect from "@c/Position/PositionSelect";
import CsuitSelect from "@c/Csuit/CSuitSelect";
import { IReportData, ReportType, ReportTypeCompleted } from "./types";
import { addLayoffAsDraft } from "./db";
import { User } from "@supabase/supabase-js";

type Props = {
  open: boolean;
  onClose: () => void;
  user?: User;
};

const defaultState: IReportData = {
  title: "",
  source_display: "",
  source: "",
  number: 0,
  percent: 0,
  sub_email: "",
  layoff_date: null,
  extra_info: "",
  company_id: "",
  csuit_ids: [],
  position_ids: [],
  add_to_job_board: false,
  type: ReportType.Layoff,
};

export default function ClientLayoffForm({ onClose, open, user }: Props) {
  const [data, setData] = useState<IReportData>(defaultState);
  const [addToList, setAddToList] = useState(true);
  const [company, setCompany] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [csuit, setCSuit] = useState<any[]>([]);

  const titleRef = useRef<HTMLInputElement>(null),
    source_displayRef = useRef<HTMLInputElement>(null),
    sourceRef = useRef<HTMLInputElement>(null),
    numberRef = useRef<HTMLInputElement>(null),
    percentRef = useRef<HTMLInputElement>(null),
    sub_emailRef = useRef<HTMLInputElement>(null),
    extra_infoRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit() {
    const reportData = data;
    if (company && company.length >= 1) {
      reportData.company_id = company[0].id;
    }

    if (csuit && csuit.length >= 1) {
      reportData.csuit_ids = csuit.map((x) => x.csuit.id);
    }
    if (positions && positions.length >= 1) {
      reportData.position_ids = positions.map((x) => x.id);
    }
    reportData.add_to_job_board = addToList;
    const res = await addLayoffAsDraft(reportData);
    if (res !== null) {
      if (typeof onClose === "function") {
        onClose();
      }
      setData(defaultState);
    }
  }
  function handleFocus(e: any) {
    if (e.target?.select) {
      e.target.select();
    }
  }
  function handleChange(
    e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = e.target as HTMLInputElement;
    setData({ ...data, [target.name]: target.value });
  }
  function handleChangeDate(newDate: Date | null) {
    setData({ ...data, layoff_date: newDate });
  }
  function handleCheck(e: React.SyntheticEvent<HTMLInputElement>) {
    setAddToList(e.currentTarget.checked);
  }
  function stopNonNumbers(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      return handleEnterClicked(e);
    }
    if (!/^[0-9]$/i.test(e.key)) {
      e.preventDefault();
      return false;
    }
  }
  function handleEnterClicked(e: React.KeyboardEvent) {
    const name = (e.target as HTMLInputElement | HTMLTextAreaElement).name;
    if (
      e.key !== "Enter" ||
      (name === "extra_info" && e.shiftKey && e.key === "Enter")
    ) {
      return;
    }
    e.preventDefault();
    switch (name) {
      case "title":
        numberRef.current?.focus();
        break;
      case "number":
        percentRef.current?.focus();
        break;
      case "percent":
        sourceRef.current?.focus();
        break;
      case "source":
        source_displayRef.current?.focus();
        break;
      case "source_display":
        !!user && sub_emailRef.current?.focus();
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (user && user.email) {
      setData((data) => ({ ...data, sub_email: user.email as string }));
    }
  }, [user]);

  return (
    <Grid style={{ height: "100%", overflowY: "auto", paddingBottom: "2em" }}>
      <Grid.Col span={12}>
        <Chip.Group
          position="center"
          value={data.type.toString()}
          onChange={(val) =>
            setData({ ...data, type: parseInt((val || "1") as string) })
          }
        >
          <Chip value={ReportType.Layoff.toString()}>Layoff</Chip>
          <Chip value={ReportType.Pip.toString()}>PIP</Chip>
          <Chip value={ReportTypeCompleted.Pip.toString()}>PIP Cancelled</Chip>
          <Chip value={ReportType.Freeze.toString()}>Hiring Freeze</Chip>
          <Chip value={ReportTypeCompleted.Freeze.toString()}>
            Hiring Freeze Cancelled
          </Chip>
        </Chip.Group>
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput
          required
          placeholder="title"
          name="title"
          label="Title"
          value={data.title}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleEnterClicked}
          ref={titleRef}
        />
      </Grid.Col>
      {data.type === ReportType.Layoff && (
        <Grid.Col span={8}>
          <TextInput
            type="number"
            placeholder="1,235"
            name="number"
            label="Estimated layoff count"
            value={data.number}
            onKeyPress={stopNonNumbers}
            onChange={handleChange}
            onFocus={handleFocus}
            ref={numberRef}
          />
        </Grid.Col>
      )}
      {![
        ReportType.Freeze,
        ReportTypeCompleted.Freeze,
        ReportTypeCompleted.Pip,
      ].includes(data.type) && (
        <Grid.Col span={data.type === ReportType.Layoff ? 4 : 12}>
          <TextInput
            type="number"
            placeholder="50"
            name="percent"
            label={
              data.type === ReportType.Layoff
                ? "est. %"
                : "Targeted % of employees"
            }
            required={data.type === ReportType.Pip}
            onKeyPress={stopNonNumbers}
            value={data.percent}
            onChange={handleChange}
            onFocus={handleFocus}
            ref={percentRef}
            error={
              isNaN(data.percent)
                ? "Invalid input"
                : data.percent > 99 || data.percent < 0
                ? "Must be 0-99%"
                : ""
            }
          />
        </Grid.Col>
      )}
      <Grid.Col span={8}>
        <TextInput
          type="text"
          placeholder="https://news.com/article"
          name="source"
          label="Source link"
          value={data.source}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleEnterClicked}
          ref={sourceRef}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <TextInput
          type="text"
          placeholder="news.com"
          name="source_display"
          label="display"
          value={data.source_display}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleEnterClicked}
          ref={source_displayRef}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput
          required
          type="email"
          placeholder="me@microsoft.com"
          name="sub_email"
          label="Verification Email"
          description="The article will only be posted when you approve it via this email"
          value={data.sub_email}
          onChange={handleChange}
          onKeyDown={handleEnterClicked}
          onFocus={handleFocus}
          ref={sub_emailRef}
          disabled={!!user}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <CompanySelect
          required
          canCreate
          isSingleSelect
          dropdownPosition="top"
          values={company}
          onChange={setCompany}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <CsuitSelect
          label="Execs"
          placeholder="Search execs"
          company_id={company[0]?.id}
          canCreate
          dropdownPosition="top"
          values={csuit}
          onChange={setCSuit}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <PositionSelect
          dropdownPosition="top"
          canCreate
          onChange={setPositions}
          values={positions}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Textarea
          label="Extra Info"
          name="extra_info"
          value={data.extra_info}
          onChange={handleChange}
          onFocus={handleFocus}
          minRows={2}
          ref={extra_infoRef}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <DatePicker
          value={data.layoff_date}
          onChange={handleChangeDate}
          onKeyDown={handleEnterClicked}
          label="Expected Date"
          placeholder={"August 25, 2022"}
          required
        />
      </Grid.Col>
      {false && (
        <Grid.Col span={12}>
          <Checkbox
            onChange={handleCheck}
            checked={addToList}
            label="Add me to the available for work list (you will only be contacted through an email from us)"
          />
        </Grid.Col>
      )}
      <Grid.Col span={12} style={{ textAlign: "right" }}>
        <Button
          disabled={
            !company ||
            !company[0] ||
            !data.title ||
            !data.sub_email ||
            !data.layoff_date ||
            (data.type === ReportType.Pip && !data.percent)
          }
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Grid.Col>
    </Grid>
  );
}
