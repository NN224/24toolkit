-- Create comparisons_dynamic table for user-submitted comparisons
create table if not exists public.comparisons_dynamic (
  id uuid primary key default gen_random_uuid(),
  product_a text not null,
  product_b text not null,
  category text not null,
  comparison_data jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_by uuid references auth.users(id) on delete set null,
  reviewed_by uuid references auth.users(id) on delete set null,
  rejection_reason text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  approved_at timestamp with time zone
);

-- Create admin_users table for admin roles
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.comparisons_dynamic enable row level security;
alter table public.admin_users enable row level security;

-- RLS Policies for comparisons_dynamic
create policy "Anyone can view approved comparisons"
  on public.comparisons_dynamic for select
  using (status = 'approved');

create policy "Authenticated users can submit comparisons"
  on public.comparisons_dynamic for insert
  with check (auth.uid() = submitted_by);

create policy "Users can view their own submissions"
  on public.comparisons_dynamic for select
  using (auth.uid() = submitted_by);

create policy "Admins can view all comparisons"
  on public.comparisons_dynamic for select
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

create policy "Admins can update comparisons"
  on public.comparisons_dynamic for update
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

create policy "Admins can delete comparisons"
  on public.comparisons_dynamic for delete
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- RLS Policies for admin_users
create policy "Admins can view all admin users"
  on public.admin_users for select
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

create policy "Super admins can manage admin users"
  on public.admin_users for all
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid() and role = 'super_admin'
    )
  );

-- Create indexes for better performance
create index if not exists idx_comparisons_status on public.comparisons_dynamic(status);
create index if not exists idx_comparisons_submitted_by on public.comparisons_dynamic(submitted_by);
create index if not exists idx_comparisons_created_at on public.comparisons_dynamic(created_at desc);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.comparisons_dynamic
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at_admin
  before update on public.admin_users
  for each row
  execute function public.handle_updated_at();
