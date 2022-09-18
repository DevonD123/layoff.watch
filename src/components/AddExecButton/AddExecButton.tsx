import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Grid,
  TextInput,
  Select,
  Text,
  Group,
} from "@mantine/core";
import CompanySelect from "@c/Company/CompanySelect";
import { IconPlus } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";
import DropZone from "@c/DropZone/DropZone";

const defaultState = {
  name: "",
  img_url: "",
  bio: "",
  company: [],
  role: "",
  start: null,
  end: null,
};
const selectOpt = [
  {
    value: "CEO",
    label: "CEO",
  },
  {
    value: "CTO",
    label: "CTO",
  },
  {
    value: "CFO",
    label: "CFO",
  },
  {
    value: "CMO",
    label: "CMO",
  },
];

function AddExecButton() {
  const [open, setOpen] = useState(false);
  const [csuit, setCsuit] = useState(defaultState);
  useEffect(() => {
    if (open) {
      setCsuit(defaultState);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    doChange(e.target.value, e.target.name);
  };
  const doChange = (value: any, name: string) => {
    setCsuit({ ...csuit, [name]: value });
  };
  const handleCreate = () => {};
  return (
    <>
      <Button
        variant="outline"
        color="dark"
        leftIcon={<IconPlus size={10} />}
        onClick={() => setOpen(true)}
      >
        Add an exec
      </Button>
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title="Add an executive"
      >
        <Grid>
          <Grid.Col span={12}>
            <CompanySelect
              required
              canCreate
              isSingleSelect
              dropdownPosition="bottom"
              values={csuit.company}
              onChange={(newCompany) => doChange(newCompany, "company")}
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <TextInput
              required
              name="name"
              value={csuit.name}
              onChange={handleChange}
              label="Executive"
              description="First & Last"
              placeholder="John Doe"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              required
              name="role"
              value={csuit.role}
              onChange={(newVal) => doChange(newVal, "role")}
              label="Role"
              description="Current position"
              data={selectOpt}
              placeholder="CEO"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DatePicker
              label="Start"
              disabled={!csuit.company[0]}
              required
              value={csuit.start}
              onChange={(newDate: Date) => doChange(newDate, "start")}
              placeholder="First day"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DatePicker
              label="End"
              disabled={!csuit.company[0] || !csuit.start}
              value={csuit.end}
              onChange={(newDate: Date) => doChange(newDate, "end")}
              placeholder="Last day"
              excludeDate={(date) =>
                date.getTime() <= (csuit.start! as Date).getTime()
              }
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <DropZone maxFiles={1} />
          </Grid.Col>
          <Grid.Col span={12}>
            <Group position="right">
              <Button variant="subtle" onClick={() => setOpen(false)} size="sm">
                Cancel
              </Button>
              <Button
                ml={20}
                onClick={handleCreate}
                disabled={
                  csuit.company.length <= 0 ||
                  csuit.name.length <= 0 ||
                  !csuit.name.includes(" ") ||
                  !csuit.role ||
                  !csuit.start ||
                  (csuit.end &&
                    (csuit.end as Date).getTime() <=
                      (csuit.start as Date).getTime())
                }
                size="md"
              >
                Create
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
}

export default AddExecButton;
