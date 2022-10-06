import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Modal,
  Group,
  Stack,
  TextInput,
  Textarea,
  Switch,
  Checkbox,
} from '@mantine/core';
import DropZone from '@c/DropZone/DropZone';
import showMsg from '@h/msg';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import uploadFile from '@h/uploadFile';
import validate, { isInvalid } from '@h/api/validation';
import { getCommaSeperatedText } from '@c/Company/helper';
import { useInternalUser } from '@h/context/userContext';
import { DatePicker } from '@mantine/dates';
import RoleSelect from '@c/Csuit/RoleSelect';
import moment from 'moment';

export enum RouteName {
  Company = 'company',
  Exec = 'exec',
  Report = 'report',
  Position = 'position',
  ExecRole = 'exec_role',
}

export const routeMap = {
  [RouteName.Company]: { tbl: 'company', name: 'company' },
  [RouteName.Exec]: { tbl: 'csuit', name: 'exec' },
  [RouteName.Report]: { tbl: 'layoff', name: 'report' },
  [RouteName.Position]: { tbl: 'position', name: 'positon' },
  [RouteName.ExecRole]: { tbl: 'csuit_role', name: 'exec role' },
};

const AdminEdit: React.FunctionComponent = () => {
  const router = useRouter();
  const { selectedCsuitRoleId, setSelectedCsuitRoleId } = useInternalUser();
  const id = router.query.id as string;
  if (!id) {
    return <></>;
  }
  if (router.pathname.includes('/company')) {
    return (
      <>
        <VerifyButton mapKey={RouteName.Company} id={id} />
        <SwapPicture mapKey={RouteName.Company} id={id} />
        <EditButton mapKey={RouteName.Company} id={id} />
      </>
    );
  }
  if (router.pathname.includes('/exec')) {
    return (
      <>
        <VerifyButton mapKey={RouteName.Exec} id={id} />
        <SwapPicture mapKey={RouteName.Exec} id={id} />
        <EditButton mapKey={RouteName.Exec} id={id} />
        {selectedCsuitRoleId && (
          <EditButton
            mapKey={RouteName.ExecRole}
            id={selectedCsuitRoleId}
            idFromContext
            setCsuitRoleId={setSelectedCsuitRoleId}
          />
        )}
      </>
    );
  }
  if (router.pathname.includes('/report')) {
    return (
      <>
        <VerifyButton mapKey={RouteName.Report} id={id} />
        <EditButton mapKey={RouteName.Report} id={id} />
      </>
    );
  }
  if (router.pathname.includes('/position')) {
    return (
      <>
        <EditButton mapKey={RouteName.Position} id={id} />
      </>
    );
  }
  return <></>;
};

const VerifyButton = ({ mapKey, id }: { mapKey: RouteName; id: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVeridyMode, setIsVerifyMode] = useState(true);
  const [open, setOpen] = useState(false);

  const onVerifyClicked = async () => {
    try {
      setIsLoading(true);

      const fetched = await fetch('/api/verify', {
        method: 'PUT',
        body: JSON.stringify({
          id,
          table: mapKey,
          doUnverify: !isVeridyMode,
        }),
      });
      const isError = fetched.status !== 200;
      const json = await fetched.json();
      if (!isError) {
        setOpen(false);
      }
      showMsg(json.msg, isError ? 'error' : 'success');
    } catch (e) {
      console.error(e);
      showMsg('Error verifying');
    } finally {
      setIsLoading(false);
    }
  };
  const closeDialog = () => {
    setOpen(false);
    setIsVerifyMode(true);
  };
  return (
    <>
      <Group>
        <Button
          color="green"
          style={{ margin: '5px auto' }}
          onClick={() => setOpen(true)}
        >
          Verify {routeMap[mapKey]?.name}
        </Button>
        <Button
          color="red"
          style={{ margin: '5px auto' }}
          onClick={() => {
            setIsVerifyMode(false);
            setOpen(true);
          }}
        >
          Unverify
        </Button>
      </Group>
      <Modal
        centered
        opened={open}
        onClose={closeDialog}
        title={`Are you sure you want to ${
          isVeridyMode ? 'Verify' : 'Un-verify'
        } this ${routeMap[mapKey]?.name}?`}
      >
        <Group style={{ marginTop: 15 }} position="right">
          <Button variant="subtle" color="dark" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            color={isVeridyMode ? 'green' : 'red'}
            onClick={onVerifyClicked}
            loading={isLoading}
          >
            {isVeridyMode ? 'Verify' : 'Un-verify'}
          </Button>
        </Group>
      </Modal>
    </>
  );
};

const SwapPicture = ({ mapKey, id }: { mapKey: RouteName; id: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onUpdateImageClicked = async () => {
    setIsLoading(true);
    try {
      if (!files || files.length <= 0) {
        return showMsg('Please add an image.');
      }
      const key = await uploadFile(
        mapKey === RouteName.Company ? 'company-logo' : 'csuit-avatar',
        files[0]
      );
      if (!key) {
        throw new Error('no key value from upload');
      }
      const fetched = await fetch('/api/update-image', {
        method: 'PUT',
        body: JSON.stringify({
          id,
          table: mapKey,
          newUrl:
            key /* can add a clearbit option at some point but would prefer own files */,
        }),
      });
      const isError = fetched.status !== 200;
      const json = await fetched.json();
      if (!isError) {
        setOpen(false);
        setFiles([]);
        setIsDeleteOpen(false);
      }
      showMsg(json.msg, isError ? 'error' : 'success');
    } catch (e) {
      console.error(e);
      showMsg('Error replacing image');
    } finally {
      setIsLoading(false);
    }
  };
  const onDeleteClicked = () => {
    setIsDeleteOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };
  const doDelete = async () => {
    try {
      setIsLoading(true);

      const fetched = await fetch('/api/update-image', {
        method: 'PUT',
        body: JSON.stringify({
          id,
          table: mapKey,
          doDelete: true,
        }),
      });
      const isError = fetched.status !== 200;
      const json = await fetched.json();
      if (!isError) {
        setOpen(false);
        closeDialog();
      }
      showMsg(json.msg, isError ? 'error' : 'success');
    } catch (e) {
      console.error(e);
      showMsg('Error deleting image');
    } finally {
      setIsLoading(false);
      closeDelete();
    }
  };
  const closeDelete = () => {
    setIsDeleteOpen(false);
  };
  return (
    <>
      <Button
        color="dark"
        loading={isLoading}
        disabled={isLoading}
        style={{ margin: '5px auto' }}
        onClick={() => setOpen(true)}
        fullWidth
      >
        Update image
      </Button>
      <Modal
        centered
        opened={open}
        onClose={closeDialog}
        title={`Update image for this ${routeMap[mapKey]?.name}`}
      >
        <DropZone
          files={files}
          onChange={setFiles}
          maxWidth={200}
          maxHeight={200}
          maxFiles={1}
        />
        <Group style={{ marginTop: 15 }} position="right">
          <Button variant="subtle" color="dark" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            variant="outline"
            color="red"
            onClick={onDeleteClicked}
            loading={isLoading}
          >
            Delete
          </Button>
          <Button
            color="green"
            onClick={onUpdateImageClicked}
            loading={isLoading}
          >
            Update
          </Button>
        </Group>
      </Modal>
      <Modal
        centered
        opened={isDeleteOpen}
        onClose={closeDelete}
        title="Are you sure you want to delete the image? if you update it instead will be replaced"
      >
        <Group style={{ marginTop: 15 }} position="right">
          <Button variant="subtle" color="dark" onClick={closeDelete}>
            Cancel
          </Button>
          <Button variant="outline" color="red" onClick={doDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
};

const EditButton = ({
  mapKey,
  id,
  idFromContext,
  setCsuitRoleId,
}: {
  mapKey: RouteName;
  id: string;
  idFromContext?: boolean;
  setCsuitRoleId?: (newId?: string) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [data, setData] = useState<any>({});

  const onVerifyClicked = async () => {
    try {
      setIsLoading(true);

      const fetched = await fetch('/api/update-entity', {
        method: 'PUT',
        body: JSON.stringify({
          id,
          table: mapKey,
          data,
        }),
      });
      const isError = fetched.status !== 200;
      const json = await fetched.json();
      if (!isError) {
        setOpen(false);
        if (idFromContext && setCsuitRoleId) {
          setCsuitRoleId(undefined);
        }
      }
      showMsg(json.msg, isError ? 'error' : 'success');
    } catch (e) {
      console.error(e);
      showMsg('Error updating');
    } finally {
      setIsLoading(false);
    }
  };
  const closeDialog = () => {
    if (setCsuitRoleId && idFromContext) {
      setCsuitRoleId(undefined);
    }
    setOpen(false);
    setData({});
  };

  const handleOpen = React.useCallback(async () => {
    setIsLoading(true);
    const { data: resData, error } = await supabaseClient
      .from(routeMap[mapKey].tbl)
      .select(mapKey === RouteName.ExecRole ? '*,company(name)' : '*')
      .eq('id', id)
      .maybeSingle();
    if (!resData || error) {
      console.error('Error ', error, resData);
      showMsg('Error finding items');
      return setIsLoading(false);
    }
    if (mapKey === RouteName.Company && resData.est_employee_count) {
      setData({
        ...resData,
        est_employee_count: getCommaSeperatedText(
          '' + resData.est_employee_count
        ),
      });
    } else {
      if (mapKey === RouteName.ExecRole) {
        setShowEnd(!!resData.end);
        resData.start = moment(resData.start).toDate();
        if (resData.end) {
          resData.end = moment(resData.end).toDate();
        }
      }
      setData(resData);
    }
    setIsLoading(false);
    setOpen(true);
  }, [id, mapKey]);
  React.useEffect(() => {
    if (idFromContext && id && mapKey === RouteName.ExecRole) {
      handleOpen();
      setOpen(true);
    }
  }, [idFromContext, id, mapKey, handleOpen]);
  return (
    <>
      {!idFromContext && (
        <Button
          color="green"
          style={{ margin: '5px auto' }}
          onClick={handleOpen}
          fullWidth
        >
          Update {routeMap[mapKey]?.name}
        </Button>
      )}
      <Modal
        centered
        opened={open}
        onClose={closeDialog}
        title={`Update ${routeMap[mapKey]?.name}?`}
      >
        <Stack>
          {mapKey === RouteName.Position && (
            <>
              <TextInput
                label="Name"
                placeholder="Software Engineer"
                required
                value={data.name}
                onChange={(e) => {
                  setData({
                    ...data,
                    name: e.target.value,
                  });
                }}
              />
              <TextInput
                label="Abbreviation"
                placeholder="SWE"
                required
                value={data.abbreviation}
                onChange={(e) => {
                  setData({
                    ...data,
                    abbreviation: e.target.value.toUpperCase().trim(),
                  });
                }}
              />
              <Textarea
                label="Description"
                rows={3}
                placeholder="they do xyz."
                value={data.description}
                onChange={(e) => {
                  setData({
                    ...data,
                    description: e.target.value,
                  });
                }}
              />
            </>
          )}
          {mapKey === RouteName.Company && (
            <>
              <TextInput
                label="Name"
                placeholder="Microsoft"
                required
                value={data.name}
                onChange={(e) => {
                  const name = e.target.value
                    ? e.target.value[0].toUpperCase() + e.target.value.slice(1)
                    : null;
                  setData({
                    ...data,
                    name,
                  });
                }}
              />
              <TextInput
                label="Ticker"
                placeholder="MSFT"
                value={data.ticker}
                onChange={(e) => {
                  setData({
                    ...data,
                    ticker: e.target.value.toUpperCase().trim(),
                  });
                }}
              />
              <Textarea
                label="Description"
                rows={3}
                placeholder="they do xyz."
                value={data.description}
                onChange={(e) => {
                  setData({
                    ...data,
                    description: e.target.value,
                  });
                }}
              />
              <TextInput
                value={data.est_employee_count || ''}
                onChange={(e) => {
                  setData({
                    ...data,
                    est_employee_count: e.target.value
                      ? getCommaSeperatedText(e.target.value)
                      : '',
                  });
                }}
                label="Estimated Employees"
                placeholder="221,000"
              />
            </>
          )}
          {mapKey === RouteName.Exec && (
            <>
              <TextInput
                label="Name"
                placeholder="John Doe"
                description="first & last"
                required
                value={data.name}
                onChange={(e) => {
                  const nameChunks = (e.target.value || '').split(' ');
                  for (let i = 0; i < nameChunks.length; i++) {
                    if (nameChunks[i] && nameChunks[i].length >= 1) {
                      nameChunks[i] =
                        nameChunks[i][0].toUpperCase() + nameChunks[i].slice(1);
                    }
                  }
                  setData({
                    ...data,
                    name: nameChunks.join(' '),
                  });
                }}
              />
              <Textarea
                label="Bio"
                rows={3}
                placeholder="former exec at enron"
                value={data.bio}
                onChange={(e) => {
                  setData({
                    ...data,
                    bio: e.target.value,
                  });
                }}
              />
            </>
          )}
          {mapKey === RouteName.ExecRole && (
            <>
              <DatePicker
                label="Start"
                required
                value={data.start}
                onChange={(newDate) => setData({ ...data, start: newDate })}
              />
              <Checkbox
                label={`Currently working @ ${data?.company?.name}`}
                checked={!showEnd}
                onChange={(e) => {
                  if (!e.target.checked) {
                    const end = moment(data.start ? data.start : undefined)
                      .add(365, 'days')
                      .toDate();
                    setData({ ...data, end });
                  } else {
                    setData({ ...data, end: null });
                  }
                  setShowEnd(!e.target.checked);
                }}
              />
              {showEnd && (
                <DatePicker
                  label="End"
                  required
                  value={data.end}
                  onChange={(newDate) => setData({ ...data, end: newDate })}
                />
              )}
              <RoleSelect
                label="Role"
                role={data.role}
                required
                setRole={(role) => setData({ ...data, role })}
              />
            </>
          )}
          {mapKey !== RouteName.Position && (
            <Switch
              checked={data.verified}
              label="Verified"
              onChange={(e) => setData({ ...data, verified: e.target.checked })}
            />
          )}
        </Stack>
        <Group style={{ marginTop: 15 }} position="right">
          <Button variant="subtle" color="dark" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            color={'green'}
            onClick={onVerifyClicked}
            loading={isLoading}
            disabled={!open || !data || isInvalid(validate(mapKey, data))}
          >
            Update
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default AdminEdit;
