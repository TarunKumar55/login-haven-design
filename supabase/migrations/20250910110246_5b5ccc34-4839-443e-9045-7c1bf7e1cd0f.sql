-- Create RLS policy for pg_listings_public view to allow public access
CREATE POLICY "Allow public read access to approved listings"
ON pg_listings_public FOR SELECT
USING (true);