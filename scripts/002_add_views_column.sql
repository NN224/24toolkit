-- Add views column to comparisons_dynamic table for tracking page views
alter table public.comparisons_dynamic
add column if not exists views integer default 0;

-- Create index for views column
create index if not exists idx_comparisons_views on public.comparisons_dynamic(views desc);

-- Add email notification column
alter table public.comparisons_dynamic
add column if not exists notification_email text;

-- Create function to increment views
create or replace function public.increment_comparison_views(comparison_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.comparisons_dynamic
  set views = views + 1
  where id = comparison_id;
end;
$$;
