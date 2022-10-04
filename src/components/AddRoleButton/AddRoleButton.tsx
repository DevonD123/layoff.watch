import React, { useState, useEffect } from 'react';
import { Button, Modal, Grid, Text, Checkbox } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import showMsg from '@h/msg';
import CompanySelect from '@c/Company/CompanySelect';
import useMediaQueries from '@h/hooks/useMediaQueries';
import RoleSelect from '@c/Csuit/RoleSelect';
import moment from 'moment';
import { start } from 'repl';
import { addRole } from '@c/Csuit/db';

interface IAddRoleButtonProps {
  id?: string;
  name?: string;
}
interface IRoleDate {
  start: Date | null;
  end: Date | null;
}

const defaultRoleData: IRoleDate = {
  start: null,
  end: null,
};

const AddRoleButton: React.FunctionComponent<IAddRoleButtonProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>('');
  const [showEnd, setShowEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newRole, setNewRole] = useState(defaultRoleData);
  const media = useMediaQueries();

  useEffect(() => {
    if (open) {
      setIsLoading(false);
      setRole('');
      setCompany([]);
    }
  }, [open]);

  const handleAdd = async () => {
    if (
      !props.id ||
      !company ||
      !company[0] ||
      !company[0].id ||
      !newRole.start ||
      !role ||
      (showEnd && !newRole.end)
    ) {
      console.error('not enough input');
      return;
    }
    const success = await addRole({
      id: props.id,
      company_id: company[0].id,
      start: newRole.start,
      end: showEnd ? newRole.end : null,
      role,
    });

    setIsLoading(false);
    if (success) {
      showMsg('Role added', 'success');
      setOpen(false);
    }
  };
  return (
    <>
      <Button size="xs" onClick={() => setOpen(true)}>
        Add a role
      </Button>
      <Modal opened={open} onClose={() => setOpen(false)}>
        <Grid>
          <Grid.Col>
            <Text component="h2" align="center">
              Add a role for {props.name}
            </Text>
          </Grid.Col>
          <Grid.Col>
            <CompanySelect
              required
              canCreate
              isSingleSelect
              dropdownPosition="top"
              values={company}
              onChange={setCompany}
            />
          </Grid.Col>
          <Grid.Col>
            <RoleSelect required role={role} setRole={setRole} />
          </Grid.Col>
          <Grid.Col>
            <DatePicker
              required
              value={newRole.start}
              label="Start date"
              onChange={(val) => setNewRole({ ...newRole, start: val })}
            />
          </Grid.Col>
          <Grid.Col>
            <Checkbox
              label="Currently in role"
              checked={!showEnd}
              onChange={(e) => setShowEnd(!e.target.checked)}
            />
          </Grid.Col>
          <Grid.Col>
            {showEnd && (
              <DatePicker
                required
                value={newRole.end}
                label="End date"
                onChange={(val) => setNewRole({ ...newRole, end: val })}
                error={
                  showEnd &&
                  newRole.end &&
                  moment(newRole.end).isSameOrBefore(newRole.start) &&
                  'End date must be after start date'
                }
              />
            )}
          </Grid.Col>
          <Grid.Col style={{ textAlign: 'right' }}>
            <Button
              disabled={
                !newRole.start ||
                !role ||
                !company ||
                company.length <= 0 ||
                (showEnd && !newRole.end) ||
                (showEnd && moment(newRole.end).isSameOrBefore(newRole.start))
              }
              loading={isLoading}
              onClick={handleAdd}
            >
              Add role
            </Button>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
};

export default AddRoleButton;
