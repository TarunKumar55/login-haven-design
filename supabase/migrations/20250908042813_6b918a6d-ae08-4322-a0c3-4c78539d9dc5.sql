-- Add owner contact details to pg_listings table
ALTER TABLE public.pg_listings 
ADD COLUMN owner_name TEXT,
ADD COLUMN owner_phone TEXT,
ADD COLUMN owner_email TEXT,
ADD COLUMN owner_address TEXT;