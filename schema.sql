-- Supabase Schema for McElroy Asynchronous Appraisal App
-- This drops the old schema entirely and recreates it for the new architecture.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop old tables if they exist
drop table if exists responses cascade;
drop table if exists participants cascade;
drop table if exists journal_sessions cascade;

-- Table: participant_progress
-- Tracks where a user is in the self-paced module
create table if not exists public.participant_progress (
    user_id uuid primary key references auth.users(id) on delete cascade,
    article_id text not null default 'mcelroy-2023',
    current_section text not null default 'intro',
    percentage_complete integer not null default 0,
    updated_at timestamptz not null default now()
);

-- Table: responses
-- Tracks individual answers to SBU domains or interactive questions
create table if not exists public.responses (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    question_id text not null,
    answer text not null,
    comment text,
    updated_at timestamptz not null default now(),
    unique(user_id, question_id)
);

-- Table: overall_appraisal
-- Tracks the final SBU methodological judgment
create table if not exists public.overall_appraisal (
    user_id uuid primary key references auth.users(id) on delete cascade,
    article_id text not null default 'mcelroy-2023',
    assessment text not null,
    updated_at timestamptz not null default now()
);

-- Row Level Security (RLS) setup

-- Enable RLS
alter table public.participant_progress enable row level security;
alter table public.responses enable row level security;
alter table public.overall_appraisal enable row level security;

-- Policies for participant_progress
-- Users can only read and update their own progress
create policy "Users can view own progress" 
on public.participant_progress for select 
using (auth.uid() = user_id);

create policy "Users can insert own progress" 
on public.participant_progress for insert 
with check (auth.uid() = user_id);

create policy "Users can update own progress" 
on public.participant_progress for update 
using (auth.uid() = user_id);

-- Policies for responses
-- Users can read their own responses, but also we need aggregate reads.
-- For aggregate reads, we can allow everyone to read all responses.
create policy "Anyone can read responses for aggregates" 
on public.responses for select 
using (true);

create policy "Users can insert own responses" 
on public.responses for insert 
with check (auth.uid() = user_id);

create policy "Users can update own responses" 
on public.responses for update 
using (auth.uid() = user_id);

-- Policies for overall_appraisal
-- Anyone can read for aggregates
create policy "Anyone can read overall appraisals for aggregates" 
on public.overall_appraisal for select 
using (true);

create policy "Users can insert own appraisal" 
on public.overall_appraisal for insert 
with check (auth.uid() = user_id);

create policy "Users can update own appraisal" 
on public.overall_appraisal for update 
using (auth.uid() = user_id);

-- Setup Realtime publications so aggregate counts can be updated live if needed
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.responses;
alter publication supabase_realtime add table public.overall_appraisal;

-- Optional: Triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at_participant_progress
  before update on public.participant_progress
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_responses
  before update on public.responses
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_overall_appraisal
  before update on public.overall_appraisal
  for each row execute procedure public.handle_updated_at();
