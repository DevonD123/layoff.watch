create or replace function position_filtered_feed (p_id uuid, f text) 
    returns table ( 
        id UUID,
        title TEXT,
        number INTEGER,
        type INTEGER,
        percent INTEGER,
        layoff_date DATE,
        is_completed BOOLEAN,
        company_name TEXT,
        company_logo_url TEXT,
        company_ticker TEXT
    ) 
language plpgsql
as $$
declare 
begin
    return query 
            select
                l.id as id,
                l.title as title,
                l.number::INTEGER as number,
                l.type::INTEGER as type,
                l.percent::INTEGER as percent,
                l.layoff_date as layoff_date,
                l.is_completed as is_completed,
                c.name as company_name,
                c.logo_url as company_logo_url,
                c.ticker as company_ticker
            from position as p
                join position_layoff pl on pl.position_id = p.id
                join layoff l on l.id = pl.layoff_id
                join company c on c.id = l.company_id
            where 
                p.id = p_id
            and (
                f = '' or 
                c.name ilike concat('%',f,'%') or
                c.ticker ilike concat('%',f,'%') or
                l.title ilike concat('%',f,'%') 
            )
            order by layoff_date desc;
end; $$ 