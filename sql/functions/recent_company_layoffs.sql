
create or replace function recent_company_layoffs () 
    returns table ( 
      layoff_id uuid, 
      company_id uuid,
      amount INTEGER,
      layoff_date DATE,
      name TEXT,
      logo_url TEXT,
      uploaded_logo_key TEXT
    ) 
language plpgsql
as $$
declare 
begin
    return query 
          select 
               l.id as layoff_id,
               l.company_id,
               l.number:: INTEGER as amount,
               l.layoff_date,
               c.name,
               c.logo_url,
               c.uploaded_logo_key
            from public.layoff l
            join company c on c.id = l.company_id 
            where 
              l.layoff_date is not null and
              l.layoff_date <= CURRENT_DATE
            order by l.layoff_date desc
            limit 10;
end; $$ 