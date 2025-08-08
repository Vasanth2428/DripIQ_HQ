# Database Setup Guide

## Prerequisites
1. Make sure you have the Supabase CLI installed
2. You should be logged into your Supabase account

## Step 1: Install Supabase CLI (if not already installed)
```bash
npm install -g supabase
```

## Step 2: Login to Supabase
```bash
supabase login
```

## Step 3: Link your project
```bash
supabase link --project-ref cwuaxzahsbgzqobqbeph
```

## Step 4: Run the migration
```bash
supabase db push
```

## Step 5: Seed the database with sample data
```bash
supabase db reset --linked
```

## Alternative: Manual SQL Execution
If you prefer to run the SQL manually through the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Execute the SQL
5. Copy and paste the contents of `supabase/seed.sql`
6. Execute the SQL

## Step 6: Generate TypeScript types
After the database is set up, regenerate the TypeScript types:

```bash
supabase gen types typescript --project-id cwuaxzahsbgzqobqbeph > src/integrations/supabase/types.ts
```

## Step 7: Start the development server
```bash
npm run dev
```

## Verification
After setup, you should see:
- 10 fountains in the database
- Sample sensor readings for each fountain
- Maintenance schedules
- Alerts (some resolved, some unresolved)
- 5 sample users

The dashboard should now display real data from Supabase instead of mock data.
