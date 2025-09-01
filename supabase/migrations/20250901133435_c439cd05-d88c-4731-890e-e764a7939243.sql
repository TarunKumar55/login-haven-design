-- Add sample images for the PG listings
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
FROM pg_listings pl WHERE pl.title = 'Modern Living PG'
UNION ALL
SELECT 
  pl.id,
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
  1
FROM pg_listings pl WHERE pl.title = 'Budget Friendly PG'
UNION ALL
SELECT 
  pl.id,
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
  1
FROM pg_listings pl WHERE pl.title = 'Premium Executive PG';