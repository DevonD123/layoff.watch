export interface IOrgOption {
  id: string;
  name: string;
  company_id: string;
  abbreviation?: string;
  description?: string;
  est_employee_count?: number | string;
  is_draft: boolean;
}
export interface IOrgInput
  extends Omit<IOrgOption, "is_draft" | "id" | "est_employee_count"> {
  est_employee_count?: string;
}
