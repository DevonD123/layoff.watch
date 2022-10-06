import React from 'react';
import Card from '@c/Card/Card';
import { Text, Grid, ActionIcon } from '@mantine/core';
import { IconLink, IconChartBar } from '@tabler/icons';
import Link from 'next/link';
import { usePipReports } from './db';
import moment from 'moment';
import getCompltedStatusIcon from '@h/getCompletedStatusIcon';
import constants from '@h/constants';

type Props = { company_id: string };

function ReportedPipCard({ company_id }: Props) {
  const { data, isLoading } = usePipReports(company_id);
  return (
    <Card
      isDark
      isSmall={!data || data.length <= 0}
      title="PIP history"
      startIcon={<IconChartBar />}
    >
      {!isLoading && (!data || data.length <= 0) ? (
        <Text color="green" align="center">
          No PIP&apos;s reported
        </Text>
      ) : (
        !isLoading &&
        data.map((report: any) => (
          <Grid
            key={report.id}
            sx={(theme) => ({
              borderBottom: `1px solid ${theme.colors.gray[8]}`,
              width: '100%',
            })}
            mb={5}
          >
            <Grid.Col span={12} pb={0}>
              <Text size="lg">
                {getCompltedStatusIcon(report.is_completed)}
                {report.title}
              </Text>
            </Grid.Col>

            <Grid.Col span={5} pt={0}>
              {!report.is_completed && (
                <Text align="left">{report.percent}% target</Text>
              )}
            </Grid.Col>
            <Grid.Col span={5} pt={0}>
              <Text color="dimmed" align={'right'}>
                {report.is_completed ? 'End ' : 'Start '}
                {moment(report.layoff_date).format(constants.DATE_FORMAT)}
              </Text>
            </Grid.Col>
            <Grid.Col span={2} pt={0}>
              <Link href={`/report/${report.id}`} passHref>
                <ActionIcon
                  component="a"
                  variant="transparent"
                  color="blue"
                  size="sm"
                  ml="auto"
                  mr={0}
                >
                  <IconLink />
                </ActionIcon>
              </Link>
            </Grid.Col>
          </Grid>
        ))
      )}
    </Card>
  );
}

export default ReportedPipCard;
