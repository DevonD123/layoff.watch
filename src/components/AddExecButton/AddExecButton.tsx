import React, { useState, useEffect } from 'react';
import { Button, Modal, Grid, TextInput, Select, Group } from '@mantine/core';
import CompanySelect from '@c/Company/CompanySelect';
import { IconPlus } from '@tabler/icons';
import { DatePicker } from '@mantine/dates';
import DropZone from '@c/DropZone/DropZone';
import { addCSuitAsDraft } from '../Csuit/db';
import showMsg from '@h/msg';
import RoleSelect from '@c/Csuit/RoleSelect';

interface CsuitValues {
  name: string;
  bio: string;
  role: string;
  start: null | Date;
  end: null | Date;
  company: any[];
}

const defaultState: CsuitValues = {
  name: '',
  bio: '',
  company: [],
  role: '',
  start: null,
  end: null,
};

function AddExecButton() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [csuit, setCsuit] = useState<CsuitValues>(defaultState);
  const [files, setFiles] = useState<File[]>([]);
  useEffect(() => {
    if (open) {
      setCsuit(defaultState);
      setFiles([]);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    doChange(e.target.value, e.target.name);
  };
  const doChange = (value: any, name: string) => {
    setCsuit({ ...csuit, [name]: value });
  };
  const handleCreate = async () => {
    try {
      setIsLoading(true);
      const result = await addCSuitAsDraft({
        name: csuit.name,
        company_id: csuit.company[0].id,
        bio: csuit.bio,
        end: csuit.end || undefined,
        start: csuit.start!,
        role: csuit.role,
        file: files.length >= 1 ? files[0] : undefined,
      });
      if (result) {
        setOpen(false);
        showMsg('Thank you for adding an exec!', 'success');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
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
              onChange={(newCompany) => doChange(newCompany, 'company')}
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
            <RoleSelect
              required
              role={csuit.role}
              setRole={(newVal: string | null) => doChange(newVal, 'role')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DatePicker
              label="Start"
              disabled={!csuit.company[0]}
              required
              value={csuit.start}
              onChange={(newDate: Date) => doChange(newDate, 'start')}
              placeholder="First day"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DatePicker
              label="End"
              disabled={!csuit.company[0] || !csuit.start}
              value={csuit.end}
              onChange={(newDate: Date) => doChange(newDate, 'end')}
              placeholder="Last day"
              excludeDate={(date) =>
                date.getTime() <= (csuit.start! as Date).getTime()
              }
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <DropZone
              files={files}
              onChange={setFiles}
              maxWidth={200}
              maxHeight={200}
              maxFiles={1}
            />
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
                  isLoading ||
                  !csuit.company ||
                  csuit.company.length <= 0 ||
                  csuit.name.length <= 0 ||
                  !csuit.name.includes(' ') ||
                  !csuit.role ||
                  !csuit.start
                  // ||  (csuit.end &&
                  //     (csuit.end as Date).getTime() <=
                  //      (csuit.start as Date).getTime())
                }
                loading={isLoading}
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
