create or replace function company_layoff_total ( c_id uuid) 
    returns table ( 
      layoffs INTEGER, 
      yr INTEGER
    ) 
language plpgsql
as $$
declare 
begin
    return query 
          select 
               sum(number):: INTEGER as layoffs,
              EXTRACT(year FROM DATE_TRUNC('year',layoff_date)):: INTEGER yr
            from public.layoff
            where 
              layoff_date is not null
              and layoff_date <= CURRENT_DATE
              and company_id = c_id
              and type = 1
            group by DATE_TRUNC('year',layoff_date)
            order by DATE_TRUNC('year',layoff_date);
end; $$ 