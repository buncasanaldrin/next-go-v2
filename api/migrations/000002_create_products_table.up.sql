CREATE TABLE IF NOT EXISTS products (
  id bigserial PRIMARY KEY,
  created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  name text NOT NULL,
  code citext UNIQUE NOT NULL,
  version integer NOT NULL DEFAULT 1
);
