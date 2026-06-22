-- ============================================================
-- ShopNest - Database Seed File
-- Run AFTER Spring Boot has started at least once.
-- Usage:  
--   docker exec -i shopnest-db psql -U postgres -d sb_ecom < seed_data.sql
-- ============================================================

-- ─── CATEGORIES ───────────────────────────────────────────────────────
INSERT INTO categories (category_name) VALUES ('Electronics')            ON CONFLICT DO NOTHING;
INSERT INTO categories (category_name) VALUES ('Fashion')                ON CONFLICT DO NOTHING;
INSERT INTO categories (category_name) VALUES ('Home & Kitchen')         ON CONFLICT DO NOTHING;
INSERT INTO categories (category_name) VALUES ('Books')                  ON CONFLICT DO NOTHING;
INSERT INTO categories (category_name) VALUES ('Sports & Fitness')       ON CONFLICT DO NOTHING;
INSERT INTO categories (category_name) VALUES ('Beauty & Personal Care') ON CONFLICT DO NOTHING;
INSERT INTO categories (category_name) VALUES ('Toys & Games')           ON CONFLICT DO NOTHING;
INSERT INTO categories (category_name) VALUES ('Grocery & Food')         ON CONFLICT DO NOTHING;

-- ─── PRODUCTS ─────────────────────────────────────────────────────────
DO $$
DECLARE
  cat_electronics   BIGINT;
  cat_fashion       BIGINT;
  cat_home          BIGINT;
  cat_books         BIGINT;
  cat_sports        BIGINT;
  cat_beauty        BIGINT;
  v_seller_id       BIGINT;
  v_seq             TEXT;
BEGIN
  SELECT category_id INTO cat_electronics FROM categories WHERE category_name = 'Electronics'            LIMIT 1;
  SELECT category_id INTO cat_fashion     FROM categories WHERE category_name = 'Fashion'                LIMIT 1;
  SELECT category_id INTO cat_home        FROM categories WHERE category_name = 'Home & Kitchen'         LIMIT 1;
  SELECT category_id INTO cat_books       FROM categories WHERE category_name = 'Books'                  LIMIT 1;
  SELECT category_id INTO cat_sports      FROM categories WHERE category_name = 'Sports & Fitness'       LIMIT 1;
  SELECT category_id INTO cat_beauty      FROM categories WHERE category_name = 'Beauty & Personal Care' LIMIT 1;
  SELECT user_id     INTO v_seller_id     FROM users WHERE username = 'seller1'                          LIMIT 1;

  SELECT sequence_name INTO v_seq
  FROM information_schema.sequences
  WHERE sequence_schema = 'public'
  ORDER BY
    CASE sequence_name
      WHEN 'hibernate_sequence' THEN 1
      WHEN 'products_seq'       THEN 2
      WHEN 'product_seq'        THEN 3
      ELSE 4
    END
  LIMIT 1;

  IF v_seq IS NULL THEN
    RAISE EXCEPTION 'No Hibernate sequence found. Make sure Spring Boot has started at least once.';
  END IF;

  RAISE NOTICE 'Using sequence: % | seller_id: %', v_seq, v_seller_id;

  -- ELECTRONICS
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Apple iPhone 15','iphone15.jpg','Latest iPhone with A16 Bionic chip, 48MP camera, Dynamic Island and all-day battery life.',45,79999,5,75999,cat_electronics,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Samsung 55" 4K Smart TV','samsung_tv.jpg','Crystal-clear 4K UHD with HDR10+, built-in Alexa and 3 HDMI ports.',20,54999,15,46749,cat_electronics,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Dell Inspiron 15 Laptop','laptop.jpg','Intel Core i5 12th Gen, 16GB RAM, 512GB SSD, Windows 11.',30,62999,10,56699,cat_electronics,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Sony WH-1000XM5 Headphones','headphones.jpg','Industry-leading noise cancellation, 30-hour battery and crystal-clear call quality.',60,29999,20,23999,cat_electronics,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Apple Watch Series 9','smartwatch.jpg','Advanced health sensors, crash detection, always-on Retina display and 18-hour battery.',35,41900,8,38548,cat_electronics,v_seller_id);

  -- FASHION
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Classic Crew Neck T-Shirt','tshirt.jpg','Premium 100% cotton, pre-shrunk. Available in 10 colors.',200,799,25,599,cat_fashion,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Slim Fit Denim Jeans','jeans.jpg','Stretchable denim with modern slim fit. Sizes 28-40.',150,1999,30,1399,cat_fashion,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Nike Air Max 270','sneakers.jpg','Iconic Air Max cushioning for all-day comfort. Casual and gym ready.',80,9999,15,8499,cat_fashion,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Men''s Bomber Jacket','jacket.jpg','Water-resistant polyester with warm fleece lining. Perfect for winter.',60,3499,20,2799,cat_fashion,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Floral Midi Dress','dress.jpg','Lightweight chiffon with elegant floral print. Great for all occasions.',90,1799,35,1169,cat_fashion,v_seller_id);

  -- HOME & KITCHEN
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Prestige Smart Blender','blender.jpg','1000W motor, 6-blade stainless steel, BPA-free 1.5L jar.',40,3999,20,3199,cat_home,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Wakefit 3-Seater Sofa','sofa.jpg','Premium fabric upholstery, high-density foam cushions and solid wood legs.',15,24999,18,20499,cat_home,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Wooden Floor Lamp','lamp.jpg','Minimalist Scandinavian design, adjustable arm and E27 bulb compatible.',55,2499,15,2124,cat_home,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Philips Air Fryer XXL','airfryer.jpg','Rapid Air technology, 6.2L capacity, fry with 90% less fat.',30,8999,22,7019,cat_home,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Pure Cotton Bedsheet Set','bedsheet.jpg','400 thread count 100% cotton. Includes 1 double bedsheet and 2 pillow covers.',120,1299,40,779,cat_home,v_seller_id);

  -- BOOKS
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Atomic Habits - James Clear','book1.jpg','The number 1 bestselling guide to building good habits. Over 10 million copies sold.',200,499,30,349,cat_books,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'The Alchemist - Paulo Coelho','book2.jpg','A magical story about following your dream. Translated into 80 languages.',180,349,25,261,cat_books,v_seller_id);

  -- SPORTS
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Boldfit Yoga Mat','yoga_mat.jpg','6mm thick anti-slip TPE foam, extra wide 72x24 inch. Comes with carry strap.',100,999,30,699,cat_sports,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Kore Rubber Dumbbells 10kg Pair','dumbbells.jpg','Solid cast iron with rubber coating and chrome handle for firm grip.',75,1799,20,1439,cat_sports,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'SS Ton Cricket Bat','cricket_bat.jpg','English willow Grade 3, full size. Pre-knocked and ready to use.',40,3499,10,3149,cat_sports,v_seller_id);

  -- BEAUTY
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Chanel No. 5 Perfume 100ml','perfume.jpg','The iconic floral aldehyde fragrance. Notes of ylang-ylang, rose and jasmine.',25,12999,10,11699,cat_beauty,v_seller_id);
  EXECUTE format('INSERT INTO products (product_id,product_name,image,description,quantity,price,discount,special_price,category_id,seller_id) VALUES (nextval(%L),%L,%L,%L,%s,%s,%s,%s,%s,%s)',
    v_seq,'Minimalist 10% Niacinamide Serum','skincare.jpg','Reduces blemishes and balances sebum. Fragrance-free, for all skin types.',90,699,15,594,cat_beauty,v_seller_id);

  RAISE NOTICE 'SUCCESS: 22 products inserted.';
END $$;

-- ─── VERIFY ───────────────────────────────────────────────────────────
SELECT c.category_name, COUNT(p.product_id) AS products
FROM categories c
LEFT JOIN products p ON p.category_id = c.category_id
GROUP BY c.category_name
ORDER BY products DESC, c.category_name;
