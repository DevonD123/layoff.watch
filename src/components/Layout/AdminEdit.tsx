import React, { useState } from 'react';
import { NextRouter } from 'next/router';
import {
  Button,
  Modal,
  Group,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import DropZone from '@c/DropZone/DropZone';
import showMsg from '@h/msg';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import uploadFile from '@h/uploadFile';
import validate, { isInvalid } from '@h/api/validation';

interface IAdminEditProps {
  router: NextRouter;
}
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

const AdminEdit: React.FunctionComponent<IAdminEditProps> = ({ router }) => {
  const [open, setOpen] = useState(false);
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

const EditButton = ({ mapKey, id }: { mapKey: RouteName; id: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    setData({});
  };

  const handleOpen = async () => {
    setIsLoading(true);
    const { data: resData, error } = await supabaseClient
      .from(routeMap[mapKey].tbl)
      .select()
      .eq('id', id)
      .maybeSingle();
    if (!resData || error) {
      console.error('Error ', error, resData);
      showMsg('Error finding items');
      return setIsLoading(false);
    }
    setData(resData);
    setIsLoading(false);
    setOpen(true);
  };
  return (
    <>
      <Button
        color="green"
        style={{ margin: '5px auto' }}
        onClick={handleOpen}
        fullWidth
      >
        Update {routeMap[mapKey]?.name}
      </Button>
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
                    name: e.target.value.trim(),
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
                    description: e.target.value.trim(),
                  });
                }}
              />
            </>
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
            disabled={isInvalid(validate(mapKey, data))}
          >
            Update
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default AdminEdit;
