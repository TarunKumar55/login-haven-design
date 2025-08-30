-- Temporarily disable the role escalation trigger for sample data creation
ALTER TABLE public.profiles DISABLE TRIGGER prevent_role_escalation_trigger;

-- Create sample profiles for different roles
INSERT INTO public.profiles (id, email, full_name, role)
VALUES 
(gen_random_uuid(), 'sample.pgowner@example.com', 'Sample PG Owner', 'pg_owner'::user_role),
(gen_random_uuid(), 'sample.admin@example.com', 'Sample Admin', 'admin'::user_role);

-- Re-enable the trigger
ALTER TABLE public.profiles ENABLE TRIGGER prevent_role_escalation_trigger;

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

-- Add sample images
INSERT INTO public.pg_images (pg_listing_id, image_url, image_order)
SELECT 
  pl.id,
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  1
FROM pg_listings pl WHERE pl.title = 'Luxury PG Near IT Park'
UNION ALL
SELECT 
  pl.id,
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  1
FROM pg_listings pl WHERE pl.title = 'Comfort Stay for Students'
UNION ALL
SELECT 
  pl.id,
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  1
FROM pg_listings pl WHERE pl.title = 'Modern Living PG';