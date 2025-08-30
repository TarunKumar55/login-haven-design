-- Create sample profiles for different roles if they don't exist
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  gen_random_uuid(),
  'sample.pgowner@example.com',
  'Sample PG Owner',
  'pg_owner'::user_role
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'pg_owner');

INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  gen_random_uuid(),
  'sample.admin@example.com', 
  'Sample Admin',
  'admin'::user_role
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin');

-- Now insert sample PG listings
INSERT INTO public.pg_listings (
  title,
  description,
  address,
  city,
  state,
  pincode,
  num_beds,
  has_ac,
  has_wifi,
  has_washing_machine,
  food_type,
  rent_per_month,
  security_deposit,
  owner_id,
  status,
  is_active,
  approved_at,
  approved_by
) VALUES
(
  'Luxury PG Near IT Park',
  'Premium accommodation with modern amenities, located in the heart of the IT district. Fully furnished rooms with AC, high-speed WiFi, and excellent food.',
  '123 Tech Street, IT Park Road',
  'Bangalore',
  'Karnataka',
  '560001',
  1,
  true,
  true,
  true,
  'both',
  15000,
  30000,
  (SELECT id FROM profiles WHERE role = 'pg_owner' LIMIT 1),
  'approved',
  true,
  NOW(),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Comfort Stay for Students',
  'Affordable and comfortable PG accommodation perfect for students and working professionals. Clean rooms with basic amenities.',
  '456 College Road, University Area',
  'Pune',
  'Maharashtra', 
  '411001',
  2,
  false,
  true,
  false,
  'veg',
  8000,
  16000,
  (SELECT id FROM profiles WHERE role = 'pg_owner' LIMIT 1),
  'approved',
  true,
  NOW(),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Modern Living PG',
  'Contemporary PG with all modern facilities including AC, washing machine, and 24/7 security. Located in a prime area with easy transport connectivity.',
  '789 Metro Station Road, Business District',
  'Delhi',
  'Delhi',
  '110001',
  1,
  true,
  true,
  true,
  'non_veg',
  12000,
  24000,
  (SELECT id FROM profiles WHERE role = 'pg_owner' LIMIT 1),
  'approved',
  true,
  NOW(),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
);