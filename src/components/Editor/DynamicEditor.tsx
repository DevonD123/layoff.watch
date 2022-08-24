// RichText.tsx in your components folder
import dynamic from "next/dynamic";
import { Skeleton } from "@mantine/core";

const Res = dynamic(() => import("@mantine/rte"), {
  // Disable during server side rendering
  ssr: false,

  // Render anything as fallback on server, e.g. loader or html content without editor
  loading: () => <Skeleton height="115px" width="100%" animate />,
}) as any;

export default Res;
