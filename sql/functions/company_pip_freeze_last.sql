
create or replace function company_pip_freeze_last ( c_id uuid) 
    returns setof layoff
language plpgsql
as $$
declare 
begin
    return query 
          (select 
      *
    from 
      layoff 
    where 
      company_id = c_id 
      and layoff_date is not null
      and type = 5
    order by layoff_date desc
    limit 1) union (select 
      *
    from 
      layoff 
    where 
      company_id = c_id 
      and layoff_date is not null
      and type = 10
    order by layoff_date desc
    limit 1);
end; $$ 


   