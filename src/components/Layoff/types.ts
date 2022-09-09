export interface IReportData {
  title: string;
  source_display: string;
  source: string;
  number: number;
  percent: number;
  sub_email: string;
  layoff_date: Date | null;
  company_id: string;
  extra_info: string;
  add_to_job_board: boolean;
  csuit_ids: string[];
  position_ids: string[];
  type: ReportType | ReportTypeCompleted;
}

export enum ReportType {
  Layoff = 1,
  Pip = 5,
  Freeze = 10,
}

export enum ReportTypeCompleted {
  Pip = 6,
  Freeze = 11,
}
