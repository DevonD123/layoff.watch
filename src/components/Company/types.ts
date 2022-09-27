export interface ICompanyOption {
  id: string;
  name: string;
  logo_url?: string;
  ticker?: string;
  description?: string;
  est_employee_count?: number | string;
  files?: File[];
  is_draft: boolean;
}
export interface ICompanyInput {
  name: string;
  logo_url?: string;
  ticker?: string;
  description?: string;
  est_employee_count?: string;
  file?: File;
}
