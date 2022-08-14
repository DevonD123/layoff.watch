import { PropsWithChildren } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";

function CompanyCard({
  title,
  id,
  children,
}: PropsWithChildren<{ title: string; id: string }>) {
  return (
    <Card
      variant="outlined"
      style={{
        width: "100%",
        margin: "10px auto",
        backgroundColor: "transparent",
      }}
      elevation={0}
    >
      <CardHeader subheader={title} id={id} />
      <CardContent style={{ width: "100%", padding: 5 }}>
        {children}
      </CardContent>
    </Card>
  );
}

export default CompanyCard;
