create or replace function per_month_last_2y () 
    returns table ( 
      layoffs INTEGER, 
      mth INTEGER,
      yr INTEGER,
      cur_mth INTEGER
    ) 
language plpgsql
as $$
declare 
begin
    return query 
          select 
               sum(number):: INTEGER as layoffs,
              EXTRACT(month FROM DATE_TRUNC('month',layoff_date)):: INTEGER mth,
              EXTRACT(year FROM DATE_TRUNC('month',layoff_date)):: INTEGER yr,
              EXTRACT(month FROM CURRENT_DATE):: INTEGER as cur_mth
            from public.layoff
            where 
              layoff_date is not null
              and (layoff_date >= (CURRENT_DATE - interval '2 years') AND layoff_date <= CURRENT_DATE)
              and type = 1
            group by DATE_TRUNC('month',layoff_date)
            order by DATE_TRUNC('month',layoff_date);
end; $$ 