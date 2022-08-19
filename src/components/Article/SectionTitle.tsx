import React from "react";
import { Divider } from "@mantine/core";

function SectionTitle({ title, id }: { title: string; id: string }) {
  return <Divider my="xs" label={title} id={id} labelPosition="center" />;
}

export default SectionTitle;
