
create or replace function company_list_minimal() 
    returns table ( 
      company_id uuid, 
      name text,
      ticker text,
      logo_url text,
      amount bigint,
      layoff_date date
    ) 
language plpgsql
as $$
declare 
begin
    return query 
          select 
            company.id,
            company.name,
            company.ticker,
            company.logo_url,
            l.number,
            l.layoff_date
          from 
            company
            left JOIN LATERAL (
              SELECT 
                li.* 
              FROM 
                layoff li
              where 
                li.company_id = company.id and 
                li.layoff_date is not null and
                li.type = 1
              ORDER BY 
                li.layoff_date 
              DESC LIMIT 1
          ) l ON true;
end; $$ 