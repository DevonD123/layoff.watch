import React, { useState, useEffect } from 'react';
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import showMsg from '@h/msg';

interface IBonusModalProps {
  isAdmin?: boolean;
  csuit_id?: string;
  csuit_name?: string;
  bonus_id?: string;
  open: boolean;
  onClose: () => void;
  companyOptions: any[];
}
const defaultData = {
  verified: false,
  amount: undefined,
  date: undefined,
  company_id: undefined,
  csuit_id: '',
};
const BonusModal: React.FunctionComponent<IBonusModalProps> = ({
  isAdmin,
  bonus_id,
  csuit_id,
  csuit_name,
  open,
  onClose,
  companyOptions,
}) => {
  const [data, setData] = useState<any>({ ...defaultData, csuit_id });
  const [isLoading, setISLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  useEffect(() => {
    if (companyOptions.length === 1) {
      setData((state: any) => ({ ...state, company_id: companyOptions[0].id }));
    }
  }, [companyOptions]);

  useEffect(() => {
    if (isAdmin && bonus_id) {
      const handleFetch = async (id: String) => {
        setISLoading(true);

        const { data: bonus, error } = await supabaseClient
          .from('csuit_bonus')
          .select('amount,verified,date,company_id,csuit_id')
          .eq('id', bonus_id)
          .maybeSingle();
        if (error) {
          console.error(error);
        } else {
          setData((state: any) => ({
            ...state,
            amount: bonus.amount,
            verified: bonus.verified,
            date: bonus.date,
            company_id: bonus.company_id,
            csuit_id: bonus.csuit_id,
          }));
        }
        setISLoading(true);
      };

      handleFetch(bonus_id);
    }
  }, [isAdmin, bonus_id]);

  const handleClose = () => {
    setData({ ...defaultData, csuit_id });
    setISLoading(false);
    onClose();
  };

  const handleSubit = async () => {
    setISLoading(true);
    if (isAdmin) {
      if (bonus_id || data.verified) {
        try {
          const fetched = await fetch('/api/bonus', {
            method: bonus_id ? 'PUT' : 'POST',
            body: JSON.stringify({
              ...data,
              id: bonus_id,
            }),
          });
          const isError = fetched.status !== 200;
          const json = await fetched.json();
          showMsg(json.msg, isError ? 'error' : 'success');
          if (!isError) {
            handleClose();
          }
        } catch (e) {
          console.error(e);
          showMsg('Error updating');
          setISLoading(false);
        } finally {
          return;
        }
      }
    }
    const { error: insertErr } = await supabaseClient
      .from('csuit_bonus')
      .insert({ ...data, verified: false });
    if (insertErr) {
      console.error(insertErr);
      showMsg('Error adding please try agiain later');
      setISLoading(false);
      return;
    }
    showMsg('Bonus reported', 'success');
    handleClose();
  };
  const handleDelete = async () => {
    if (isAdmin && bonus_id) {
      try {
        setDeleteOpen(false);
        setISLoading(true);
        const fetched = await fetch('/api/bonus', {
          method: 'DELETE',
          body: JSON.stringify({
            id: bonus_id,
          }),
        });
        const isError = fetched.status !== 200;
        const json = await fetched.json();
        showMsg(json.msg, isError ? 'error' : 'success');
        if (!isError) {
          handleClose();
        }
      } catch (e) {
        console.error(e);
        showMsg('Error deleting bonus');
      } finally {
        setISLoading(false);
      }
    }
  };
  return (
    <Modal
      centered
      opened={open}
      onClose={handleClose}
      title={
        bonus_id
          ? `Edit bonus awarded to ${csuit_name}`
          : `Report a bonus awarded to ${csuit_name}`
      }
    >
      <Stack>
        {companyOptions.length === 0 ? (
          <Text color="red">
            Error no companies found related to this exec, please close and try
            again
          </Text>
        ) : companyOptions.length === 1 ? (
          <Text color="dimmed">Company selected: {companyOptions[0].name}</Text>
        ) : (
          <Select
            label="Company"
            placeholder="Select a company"
            value={data.company_id}
            data={companyOptions.map((c) => ({ value: c.id, label: c.name }))}
          />
        )}
        <NumberInput
          label="Bonus awarded"
          description="Total amount converted to usd (including the value of any stock awarded)"
          defaultValue={data.amount}
          value={data.amount}
          step={1000}
          min={0}
          required
          parser={(value) =>
            (value || '')
              .replace(/\$\s?|(,*)/g, '')
              .replace('USD', '')
              .replaceAll(' ', '')
          }
          formatter={(value) =>
            !Number.isNaN(parseFloat(value || ''))
              ? `$ USD ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : '$ USD '
          }
          onChange={(amount) => setData({ ...data, amount })}
        />
        <DatePicker
          label="Date awarded"
          required
          value={data.date}
          onChange={(newDate) => setData({ ...data, date: newDate })}
          placeholder="date the bonus is awarded"
          maxDate={new Date()}
        />
        {isAdmin && (
          <Switch
            label="Verified"
            checked={data.verified}
            onChange={(e) => setData({ ...data, verified: e.target.checked })}
          />
        )}
        <Group position="right">
          <Button variant="subtle" color="dark" onClick={handleClose}>
            Cancel
          </Button>
          {isAdmin && bonus_id && (
            <Button
              color="red"
              onClick={() => setDeleteOpen(true)}
              loading={isLoading}
            >
              Delete
            </Button>
          )}
          {companyOptions.length >= 1 && (
            <Button
              color="green"
              loading={isLoading}
              onClick={handleSubit}
              disabled={
                !data.company_id || !data.amount || !data.csuit_id || !data.date
              }
            >
              {bonus_id ? 'Update' : 'Add'}
            </Button>
          )}
        </Group>
      </Stack>
      {isAdmin && bonus_id && (
        <Modal
          opened={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          centered
          title="Are you sure you want to delete this bonus"
        >
          <Group position="right">
            <Button
              color="dark"
              variant="subtle"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete} loading={isLoading}>
              Delete
            </Button>
          </Group>
        </Modal>
      )}
    </Modal>
  );
};

export default BonusModal;
