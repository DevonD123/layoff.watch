import React, { PropsWithChildren } from "react";
import Link from "next/link";
import {
  styled,
  Card,
  Chip,
  Typography,
  CardHeader,
  CardContent,
} from "@mui/material";
import CompanyChip from "./CompanyChip";
import SectionTitle from "@c/Article/SectionTitle";

const CardConatainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 5px;
  padding-bottom: 0px;
`;
const ChipContainer = styled(CardConatainer)`
  padding-top: 0px;
`;
const StyledChip = styled(Chip)`
  margin: 1px;
`;
interface Props {
  allowLink?: boolean;
  items: any;
}

function CompanyFullInfoTag({ allowLink, items }: Props) {
  return (
    <CardConatainer>
      {items.map((itm: any) => (
        <CompanyCard key={itm.id} allowLink={allowLink} item={itm} />
      ))}
    </CardConatainer>
  );
}

const CompanyCard = ({
  item,
  allowLink,
}: {
  item: any;
  allowLink?: boolean;
}) => {
  let nameCutOff = item.name;
  if (nameCutOff.length >= 15) {
    nameCutOff = nameCutOff.substring(0, 12) + "...";
  }

  return (
    <Card
      variant="outlined"
      style={{ backgroundColor: "transparent", margin: 5 }}
    >
      <CardHeader
        style={{ paddingBottom: 1 }}
        title={
          <LinkWrapper link={!allowLink ? undefined : `/company?id=${item.id}`}>
            <CompanyChip
              title={item.name}
              label={nameCutOff}
              logoUrl={item.logo_url}
            />
          </LinkWrapper>
        }
        subheader={
          <Typography
            variant="caption"
            color="text.secondary"
            component="span"
            style={{ marginLeft: 5 }}
          >
            {item.ticker}
          </Typography>
        }
      />
      <CardContent style={{ paddingTop: 1 }}>
        {item.orgs && item.orgs.length >= 1 && (
          <>
            <SectionTitle title="Orgs" id={item.id + "_orgs"} />
            <ChipContainer>
              {item.orgs.map((org: any) => (
                <LinkWrapper
                  key={org.id}
                  link={
                    !allowLink
                      ? undefined
                      : `/org?id=${encodeURIComponent(org.name)}`
                  }
                >
                  <StyledChip
                    variant="outlined"
                    size="small"
                    label={org.name}
                  />
                </LinkWrapper>
              ))}
            </ChipContainer>
          </>
        )}
        {item.csuits && (
          <>
            <SectionTitle title="Execs" id={item.id + "_execs"} />
            <ChipContainer>
              {item.csuits.map((c: any) => (
                <LinkWrapper
                  key={c.csuit.id}
                  link={!allowLink ? undefined : `/org?id=${c.csuit.id}`}
                >
                  <StyledChip
                    variant="outlined"
                    size="small"
                    label={c.csuit.name}
                  />
                </LinkWrapper>
              ))}
            </ChipContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const LinkWrapper = ({
  link,
  children,
}: PropsWithChildren<{ link?: string }>) => {
  if (!link) {
    return <>{children}</>;
  }
  return (
    <Link href={link} passHref>
      {children}
    </Link>
  );
};

export default CompanyFullInfoTag;
