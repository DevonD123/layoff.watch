export interface ICSuitOpt {
  id: string;
  name: string;
  img_url?: string;
  linked_in_url?: string;
  bio?: string;
  role?: string;
  is_draft: boolean;
}
export interface ICSuitInput extends Omit<ICSuitOpt, "is_draft" | "id"> {
  company_id: string;
  start?: string | Date;
  end?: string | Date;
}
export interface ICsuitLink {
  company_id?: string;
  csuit_id?: string;
  csuit: ICSuitOpt;
  start?: string | Date;
  end?: string | Date;
  is_draft: boolean;
}
