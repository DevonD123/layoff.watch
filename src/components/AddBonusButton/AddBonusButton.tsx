import React from 'react';
import { Button } from '@mantine/core';
import BonusModal from './BonusModal';
import { useInternalUser } from '@h/context/userContext';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import showMsg from '@h/msg';
import Link from 'next/link';
import QSP from '@h/qsp';

interface IAddBonusButtonProps {
  id: string;
  name: string;
}

const AddBonusButton: React.FunctionComponent<IAddBonusButtonProps> = ({
  id,
  name,
}) => {
  const { user, isLoading: usrLoading } = useInternalUser();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [companies, setCompanies] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!open) {
      setCompanies([]);
    }
  }, [open]);

  const handleOpen = async () => {
    setIsLoading(true);
    const { data, error } = await supabaseClient
      .from('csuit_role')
      .select('company(id,name)')
      .eq('csuit_id', id);
    if (data && !error) {
      setCompanies(data.map((x) => ({ ...x.company })));
    }
    setIsLoading(false);
    if (error) {
      console.error(error);
      showMsg('Could not find companies please refresh and try again');
    } else {
      setOpen(true);
    }
  };
  if (!usrLoading && !user) {
    return (
      <Link href={`/auth?${QSP.page}=login`} passHref>
        <Button size="xs">Login to report a bonus</Button>
      </Link>
    );
  }
  return (
    <>
      <Button onClick={handleOpen} loading={isLoading} size="xs">
        Report a bonus
      </Button>
      <BonusModal
        open={open}
        onClose={() => setOpen(false)}
        companyOptions={companies}
        csuit_id={id}
        csuit_name={name}
        isAdmin={user && user.isAdmin}
      />
    </>
  );
};

export default AddBonusButton;
