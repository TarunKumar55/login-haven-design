-- Add policy to allow anyone to view approved listings through the public view
CREATE POLICY "Anyone can view approved active listings"
ON pg_listings FOR SELECT
USING (status = 'approved' AND is_active = true);