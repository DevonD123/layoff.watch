import React from "react";
import Card from "@c/Card/Card";
import { IconBackhoe, IconAffiliate } from "@tabler/icons";

type Props = {
  company_id: string;
};

function SubCard({ company_id }: Props) {
  return (
    <Card
      isSmall
      isDark
      title="Subsidiaries"
      startIcon={<IconAffiliate size={18} />}
    >
      We are working on it <IconBackhoe />
    </Card>
  );
}

export default SubCard;
