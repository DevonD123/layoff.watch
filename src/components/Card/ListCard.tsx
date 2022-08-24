import { PropsWithChildren } from "react";
import { Card, Title, Skeleton, Button } from "@mantine/core";
import Link from "next/link";

type Props = {
  header?: JSX.Element;
  title?: string;
  isLoading?: boolean;
  linkText?: string;
  linkUrl?: string;
  linkIcon?: JSX.Element;
};

function ListCard({
  title,
  header,
  children,
  isLoading,
  linkText,
  linkUrl,
  linkIcon,
}: PropsWithChildren<Props>) {
  return (
    <>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{ borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}
      >
        <Card.Section withBorder inheritPadding py="xs">
          {header ? (
            header
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title color="orange" order={4}>
                {title}
              </Title>
              {linkIcon ? (
                linkIcon
              ) : linkUrl ? (
                <Link href={linkUrl} passHref>
                  <Button size="xs" component="a">
                    {linkText || "More"}
                  </Button>
                </Link>
              ) : null}
            </div>
          )}
        </Card.Section>
      </Card>
      {isLoading ? <Skeleton height={100} width="100%" /> : children}
    </>
  );
}

export default ListCard;
