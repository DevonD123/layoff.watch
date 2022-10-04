import { Select } from '@mantine/core';
import * as React from 'react';

interface IRoleSelectProps {
  role: string | null;
  setRole: (newRole: string | null) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
}

const selectOpt = [
  {
    value: 'CEO',
    label: 'CEO',
  },
  {
    value: 'CTO',
    label: 'CTO',
  },
  {
    value: 'CFO',
    label: 'CFO',
  },
  {
    value: 'CMO',
    label: 'CMO',
  },
];

const RoleSelect: React.FunctionComponent<IRoleSelectProps> = (props) => {
  return (
    <Select
      required={props.required}
      name="role"
      value={props.role}
      onChange={(newVal) => props.setRole(newVal)}
      label={props.label || 'Role'}
      description={props.label || 'Current position'}
      data={selectOpt}
      placeholder={props.placeholder || 'CEO'}
    />
  );
};

export default RoleSelect;
