


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;




ALTER SCHEMA "public" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."archive_expired_jobs"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
begin
  update public.jobs set status = 'archived'
    where expires_at < now() and status = 'published';
  delete from public.jobs
    where status = 'archived' and expires_at < now() - interval '7 days';
end;
$$;


ALTER FUNCTION "public"."archive_expired_jobs"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."expire_stale_jobs"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE public.jobs
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'active' AND expires_at <= NOW();
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;


ALTER FUNCTION "public"."expire_stale_jobs"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_job_stats"("p_job_id" "uuid") RETURNS TABLE("views" bigint, "clicks" bigint)
    LANGUAGE "sql" STABLE
    AS $$
  select count(*) filter (where event_type = 'view'),
         count(*) filter (where event_type = 'click')
  from public.job_events where job_id = p_job_id;
$$;


ALTER FUNCTION "public"."get_job_stats"("p_job_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_jobs_stats"("p_job_ids" "uuid"[]) RETURNS TABLE("job_id" "uuid", "views" bigint, "clicks" bigint)
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  select job_id,
         count(*) filter (where event_type = 'view'),
         count(*) filter (where event_type = 'click')
  from public.job_events where job_id = any(p_job_ids) group by job_id;
$$;


ALTER FUNCTION "public"."get_jobs_stats"("p_job_ids" "uuid"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."job_events_daily"("p_start" timestamp with time zone, "p_end" timestamp with time zone) RETURNS TABLE("day" "date", "views" bigint, "clicks" bigint)
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  select d.day::date,
    coalesce(sum(case when je.event_type = 'view'  then 1 else 0 end), 0)::bigint,
    coalesce(sum(case when je.event_type = 'click' then 1 else 0 end), 0)::bigint
  from generate_series(p_start::date, (p_end - interval '1 microsecond')::date, interval '1 day') as d(day)
  left join public.job_events je
    on je.created_at >= greatest(d.day::timestamptz, p_start)
   and je.created_at <  least((d.day + interval '1 day')::timestamptz, p_end)
   and je.event_type in ('view','click')
  group by d.day order by d.day;
$$;


ALTER FUNCTION "public"."job_events_daily"("p_start" timestamp with time zone, "p_end" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."monthly_blog_posts"() RETURNS TABLE("year" integer, "month" integer, "total" integer)
    LANGUAGE "sql"
    AS $$
  select extract(year from created_at)::int, extract(month from created_at)::int, count(*)::int
  from public.blogs where status = 'published' group by 1,2 order by 1,2;
$$;


ALTER FUNCTION "public"."monthly_blog_posts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."monthly_published_jobs"() RETURNS TABLE("year" integer, "month" integer, "total" integer)
    LANGUAGE "sql"
    AS $$
  select extract(year from created_at)::int, extract(month from created_at)::int, count(*)::int
  from public.jobs where status = 'published' group by 1,2 order by 1,2;
$$;


ALTER FUNCTION "public"."monthly_published_jobs"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."monthly_registered_companies"() RETURNS TABLE("year" integer, "month" integer, "total" integer)
    LANGUAGE "sql"
    AS $$
  select extract(year from created_at)::int, extract(month from created_at)::int, count(*)::int
  from public.companies group by 1,2 order by 1,2;
$$;


ALTER FUNCTION "public"."monthly_registered_companies"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_job_expiry"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.expires_at := case
    when new.is_featured = true then now() + interval '60 days'
    else now() + interval '30 days'
  end;
  return new;
end;
$$;


ALTER FUNCTION "public"."set_job_expiry"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."top_jobs_by_event"("p_event_type" "text", "p_limit" integer DEFAULT 5) RETURNS TABLE("job_id" "uuid", "event_count" bigint)
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  select je.job_id, count(*) from public.job_events je
  where je.event_type = p_event_type and je.job_id is not null
  group by je.job_id order by count(*) desc limit p_limit;
$$;


ALTER FUNCTION "public"."top_jobs_by_event"("p_event_type" "text", "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."top_jobs_by_event_windowed"("p_event_type" "text", "p_start" timestamp with time zone, "p_end" timestamp with time zone, "p_limit" integer DEFAULT 6) RETURNS TABLE("job_id" "uuid", "event_count" bigint)
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  select je.job_id, count(*) from public.job_events je
  where je.event_type = p_event_type and je.job_id is not null
    and je.created_at >= p_start and je.created_at < p_end
  group by je.job_id order by count(*) desc limit p_limit;
$$;


ALTER FUNCTION "public"."top_jobs_by_event_windowed"("p_event_type" "text", "p_start" timestamp with time zone, "p_end" timestamp with time zone, "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."authors" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text",
    "bio" "text",
    "avatar_url" "text",
    "linkedin" "text",
    "twitter" "text",
    "website" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."authors" OWNER TO "postgres";


ALTER TABLE "public"."authors" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."authors_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."blogs" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "content" "text" NOT NULL,
    "category" "text" NOT NULL,
    "date" "date" NOT NULL,
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "author" "text",
    "author_id" bigint,
    "featured_image" "text",
    "featured_image_alt" "text",
    "seo_title" "text",
    "seo_description" "text",
    "meta_description" "text",
    "canonical_url" "text",
    "og_image" "text",
    "schema_type" "text",
    "last_saved_at" timestamp without time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "excerpt" "text",
    CONSTRAINT "blogs_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text"])))
);


ALTER TABLE "public"."blogs" OWNER TO "postgres";


ALTER TABLE "public"."blogs" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."blogs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."companies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "logo_url" "text",
    "website" "text",
    "linkedin" "text",
    "twitter" "text",
    "facebook" "text",
    "tagline" "text",
    "contact_email" "text",
    "description" "text",
    "industry" "text",
    "company_size" "text",
    "hq_location" "text",
    "remote_policy" "text",
    "year_founded" "text",
    "careers_url" "text",
    "glassdoor_url" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."companies" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."companies_with_job_count" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::"text" AS "name",
    NULL::"text" AS "slug",
    NULL::"text" AS "logo_url",
    NULL::bigint AS "job_count";


ALTER VIEW "public"."companies_with_job_count" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."comparisons" (
    "role_slug" "text" NOT NULL,
    "verdict" "text" NOT NULL,
    "cost_of_living_note" "text",
    "visa_note" "text",
    "is_published" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."comparisons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guides" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "tldr" "text" NOT NULL,
    "content" "text" NOT NULL,
    "excerpt" "text",
    "cover_image" "text",
    "author_id" "uuid",
    "country" "text",
    "faq" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "is_published" boolean DEFAULT false NOT NULL,
    "published_at" timestamp with time zone,
    "seo_title" "text",
    "seo_description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    CONSTRAINT "guides_country_check" CHECK (("country" = ANY (ARRAY['MY'::"text", 'SG'::"text", 'ID'::"text", 'BOTH'::"text"])))
);


ALTER TABLE "public"."guides" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid",
    "event_type" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "job_events_event_type_check" CHECK (("event_type" = ANY (ARRAY['view'::"text", 'click'::"text"])))
);


ALTER TABLE "public"."job_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_ingestion" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "source_url" "text" NOT NULL,
    "source_name" "text",
    "country" "text",
    "city" "text",
    "raw_title" "text",
    "raw_company" "text",
    "raw_location" "text",
    "extracted" "jsonb",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "job_id" "uuid",
    "error" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "job_ingestion_country_check" CHECK (("country" = ANY (ARRAY['MY'::"text", 'SG'::"text"]))),
    CONSTRAINT "job_ingestion_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'imported'::"text", 'rejected'::"text", 'duplicate'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."job_ingestion" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid",
    "stripe_session_id" "text" NOT NULL,
    "payment_status" "text" DEFAULT 'paid'::"text" NOT NULL,
    "amount" integer NOT NULL,
    "currency" "text" NOT NULL,
    "country" "text",
    "email" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "job_payments_amount_check" CHECK (("amount" >= 0)),
    CONSTRAINT "job_payments_currency_check" CHECK (("char_length"("currency") = 3)),
    CONSTRAINT "job_payments_payment_status_check" CHECK (("payment_status" = ANY (ARRAY['paid'::"text", 'unpaid'::"text", 'refunded'::"text", 'disputed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."job_payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "job_type" "text"[] NOT NULL,
    "job_category" "text"[] NOT NULL,
    "job_location" "text"[] NOT NULL,
    "min_salary" numeric,
    "max_salary" numeric,
    "currency" "text" DEFAULT 'MYR'::"text" NOT NULL,
    "apply_url" "text" NOT NULL,
    "tags" "text"[],
    "is_featured" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "company_id" "uuid",
    "status" "text" DEFAULT 'pending'::"text",
    "remote_type" "text" DEFAULT '100% Remote'::"text" NOT NULL,
    "billing_plan" "text" DEFAULT 'free'::"text" NOT NULL,
    "visibility_plan" "text" DEFAULT 'public'::"text" NOT NULL,
    "seo_title" "text",
    "seo_description" "text",
    "goes_public_at" timestamp with time zone DEFAULT ("now"() + '12:00:00'::interval),
    "expires_at" "date",
    "valid_through" "date",
    "stripe_session_id" "text",
    "featured_addon_paid" boolean DEFAULT false NOT NULL,
    "paid_amount_total" integer,
    "paid_currency" "text",
    "paid_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "jobs_billing_plan_check" CHECK (("billing_plan" = ANY (ARRAY['free'::"text", 'paid'::"text"]))),
    CONSTRAINT "jobs_remote_type_check" CHECK (("remote_type" = ANY (ARRAY['100% Remote'::"text", 'Hybrid'::"text", 'Onsite'::"text"]))),
    CONSTRAINT "jobs_visibility_plan_check" CHECK (("visibility_plan" = ANY (ARRAY['public'::"text", 'private_early_access'::"text"])))
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."jobs_with_payment" AS
 SELECT "j"."id",
    "j"."title",
    "j"."slug",
    "j"."description",
    "j"."apply_url",
    "j"."company_id",
    "j"."job_type",
    "j"."job_category",
    "j"."job_location",
    "j"."min_salary",
    "j"."max_salary",
    "j"."currency",
    "j"."tags",
    "j"."status",
    "j"."is_featured",
    "j"."is_active",
    "j"."billing_plan",
    "j"."visibility_plan",
    "j"."seo_title",
    "j"."seo_description",
    "j"."goes_public_at",
    "j"."expires_at",
    "j"."valid_through",
    "j"."created_at",
    "j"."updated_at",
    "p"."email" AS "paid_email",
    "p"."amount" AS "paid_amount",
    "p"."currency" AS "paid_currency",
    "p"."country" AS "paid_country",
    "p"."payment_status" AS "paid_payment_status",
    "p"."stripe_session_id",
    "p"."created_at" AS "paid_created_at"
   FROM ("public"."jobs" "j"
     LEFT JOIN "public"."job_payments" "p" ON (("p"."job_id" = "j"."id")));


ALTER VIEW "public"."jobs_with_payment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."newsletter_subscribers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "name" "text",
    "country" "text",
    "source" "text" DEFAULT 'website'::"text",
    "subscribed_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."newsletter_subscribers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "plural" "text" NOT NULL,
    "summary" "text" NOT NULL,
    "skills" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "sort_order" integer DEFAULT 100 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."salaries" (
    "role_slug" "text" NOT NULL,
    "country" "text" NOT NULL,
    "basis" "text" DEFAULT 'official_wage_survey'::"text" NOT NULL,
    "p25" numeric NOT NULL,
    "p50" numeric,
    "p75" numeric NOT NULL,
    "currency" "text" NOT NULL,
    "sample_size" integer,
    "sources" "text"[] NOT NULL,
    "source_period" "text",
    "methodology" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "salaries_basis_check" CHECK (("basis" = ANY (ARRAY['official_wage_survey'::"text", 'kerja_ai_listings'::"text", 'job_ad_aggregation'::"text", 'published_range'::"text", 'self_reported'::"text"]))),
    CONSTRAINT "salaries_country_check" CHECK (("country" = ANY (ARRAY['MY'::"text", 'SG'::"text", 'ID'::"text"]))),
    CONSTRAINT "salaries_currency_check" CHECK (("currency" = ANY (ARRAY['MYR'::"text", 'SGD'::"text", 'IDR'::"text"]))),
    CONSTRAINT "salaries_currency_matches_country" CHECK (((("country" = 'MY'::"text") AND ("currency" = 'MYR'::"text")) OR (("country" = 'SG'::"text") AND ("currency" = 'SGD'::"text")) OR (("country" = 'ID'::"text") AND ("currency" = 'IDR'::"text")))),
    CONSTRAINT "salaries_percentiles_ordered" CHECK ((("p25" <= "p75") AND (("p50" IS NULL) OR (("p25" <= "p50") AND ("p50" <= "p75"))))),
    CONSTRAINT "salaries_sample_size_check" CHECK ((("sample_size" IS NULL) OR ("sample_size" > 0))),
    CONSTRAINT "salaries_sources_check" CHECK (("cardinality"("sources") > 0)),
    CONSTRAINT "salaries_survey_has_median" CHECK ((("basis" <> 'official_wage_survey'::"text") OR ("p50" IS NOT NULL)))
);


ALTER TABLE "public"."salaries" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."sorted_companies" AS
 SELECT "id",
    "name",
    "lower"("name") AS "name_lower",
    "slug",
    "website",
    "tagline",
    "logo_url",
    "created_at"
   FROM "public"."companies";


ALTER VIEW "public"."sorted_companies" OWNER TO "postgres";


ALTER TABLE ONLY "public"."authors"
    ADD CONSTRAINT "authors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."authors"
    ADD CONSTRAINT "authors_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."blogs"
    ADD CONSTRAINT "blogs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blogs"
    ADD CONSTRAINT "blogs_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."comparisons"
    ADD CONSTRAINT "comparisons_pkey" PRIMARY KEY ("role_slug");



ALTER TABLE ONLY "public"."guides"
    ADD CONSTRAINT "guides_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guides"
    ADD CONSTRAINT "guides_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."job_events"
    ADD CONSTRAINT "job_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_ingestion"
    ADD CONSTRAINT "job_ingestion_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_ingestion"
    ADD CONSTRAINT "job_ingestion_source_url_key" UNIQUE ("source_url");



ALTER TABLE ONLY "public"."job_payments"
    ADD CONSTRAINT "job_payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."newsletter_subscribers"
    ADD CONSTRAINT "newsletter_subscribers_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."newsletter_subscribers"
    ADD CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("slug");



ALTER TABLE ONLY "public"."salaries"
    ADD CONSTRAINT "salaries_pkey" PRIMARY KEY ("role_slug", "country");



CREATE INDEX "idx_blogs_status" ON "public"."blogs" USING "btree" ("status");



CREATE INDEX "idx_guides_published" ON "public"."guides" USING "btree" ("is_published", "published_at" DESC);



CREATE INDEX "idx_guides_slug" ON "public"."guides" USING "btree" ("slug");



CREATE INDEX "idx_job_events_type_job" ON "public"."job_events" USING "btree" ("event_type", "job_id");



CREATE INDEX "idx_job_ingestion_status" ON "public"."job_ingestion" USING "btree" ("status");



CREATE INDEX "idx_jobs_company" ON "public"."jobs" USING "btree" ("company_id");



CREATE INDEX "idx_jobs_status" ON "public"."jobs" USING "btree" ("status");



CREATE INDEX "idx_salaries_role_country" ON "public"."salaries" USING "btree" ("role_slug", "country");



CREATE OR REPLACE VIEW "public"."companies_with_job_count" AS
 SELECT "c"."id",
    "c"."name",
    "c"."slug",
    "c"."logo_url",
    "count"("j"."id") AS "job_count"
   FROM ("public"."companies" "c"
     LEFT JOIN "public"."jobs" "j" ON ((("j"."company_id" = "c"."id") AND ("j"."status" = 'published'::"text"))))
  GROUP BY "c"."id";



CREATE OR REPLACE TRIGGER "set_guides_updated_at" BEFORE UPDATE ON "public"."guides" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."blogs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."companies" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."job_ingestion" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."jobs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trigger_set_job_expiry" BEFORE INSERT ON "public"."jobs" FOR EACH ROW EXECUTE FUNCTION "public"."set_job_expiry"();



ALTER TABLE ONLY "public"."blogs"
    ADD CONSTRAINT "blogs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."comparisons"
    ADD CONSTRAINT "comparisons_role_slug_fkey" FOREIGN KEY ("role_slug") REFERENCES "public"."roles"("slug") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."job_events"
    ADD CONSTRAINT "job_events_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."job_ingestion"
    ADD CONSTRAINT "job_ingestion_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."job_payments"
    ADD CONSTRAINT "job_payments_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."salaries"
    ADD CONSTRAINT "salaries_role_slug_fkey" FOREIGN KEY ("role_slug") REFERENCES "public"."roles"("slug") ON UPDATE CASCADE;



CREATE POLICY "anon insert job events" ON "public"."job_events" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "anon read authors" ON "public"."authors" FOR SELECT TO "anon" USING (true);



CREATE POLICY "anon read categories" ON "public"."categories" FOR SELECT TO "anon" USING (true);



CREATE POLICY "anon read companies" ON "public"."companies" FOR SELECT TO "anon" USING (true);



CREATE POLICY "anon read published blogs" ON "public"."blogs" FOR SELECT TO "anon" USING (("status" = 'published'::"text"));



CREATE POLICY "anon read published jobs" ON "public"."jobs" FOR SELECT TO "anon" USING ((("status" = 'published'::"text") AND ("goes_public_at" <= "now"())));



CREATE POLICY "auth full authors" ON "public"."authors" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "auth full blogs" ON "public"."blogs" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "auth full categories" ON "public"."categories" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "auth full companies" ON "public"."companies" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "auth full events" ON "public"."job_events" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "auth full ingestion" ON "public"."job_ingestion" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "auth full jobs" ON "public"."jobs" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "auth full payments" ON "public"."job_payments" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "auth full subscribers" ON "public"."newsletter_subscribers" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "auth read events" ON "public"."job_events" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."authors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blogs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."companies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."comparisons" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "comparisons public read" ON "public"."comparisons" FOR SELECT USING (("is_published" = true));



CREATE POLICY "comparisons service write" ON "public"."comparisons" USING (("auth"."role"() = 'service_role'::"text"));



ALTER TABLE "public"."guides" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "guides public read" ON "public"."guides" FOR SELECT USING (("is_published" = true));



CREATE POLICY "guides service write" ON "public"."guides" USING (("auth"."role"() = 'service_role'::"text"));



ALTER TABLE "public"."job_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_ingestion" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."newsletter_subscribers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "roles public read" ON "public"."roles" FOR SELECT USING (true);



CREATE POLICY "roles service write" ON "public"."roles" USING (("auth"."role"() = 'service_role'::"text"));



ALTER TABLE "public"."salaries" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "salaries public read" ON "public"."salaries" FOR SELECT USING (true);



CREATE POLICY "salaries service write" ON "public"."salaries" USING (("auth"."role"() = 'service_role'::"text"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































REVOKE ALL ON FUNCTION "public"."expire_stale_jobs"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."expire_stale_jobs"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_jobs_stats"("p_job_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."get_jobs_stats"("p_job_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_jobs_stats"("p_job_ids" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."job_events_daily"("p_start" timestamp with time zone, "p_end" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."job_events_daily"("p_start" timestamp with time zone, "p_end" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."job_events_daily"("p_start" timestamp with time zone, "p_end" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."top_jobs_by_event"("p_event_type" "text", "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."top_jobs_by_event"("p_event_type" "text", "p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."top_jobs_by_event"("p_event_type" "text", "p_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."top_jobs_by_event_windowed"("p_event_type" "text", "p_start" timestamp with time zone, "p_end" timestamp with time zone, "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."top_jobs_by_event_windowed"("p_event_type" "text", "p_start" timestamp with time zone, "p_end" timestamp with time zone, "p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."top_jobs_by_event_windowed"("p_event_type" "text", "p_start" timestamp with time zone, "p_end" timestamp with time zone, "p_limit" integer) TO "service_role";


















GRANT SELECT ON TABLE "public"."authors" TO "anon";
GRANT ALL ON TABLE "public"."authors" TO "authenticated";
GRANT ALL ON TABLE "public"."authors" TO "service_role";



GRANT SELECT ON TABLE "public"."blogs" TO "anon";
GRANT ALL ON TABLE "public"."blogs" TO "authenticated";
GRANT ALL ON TABLE "public"."blogs" TO "service_role";



GRANT SELECT ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT SELECT ON TABLE "public"."companies" TO "anon";
GRANT ALL ON TABLE "public"."companies" TO "authenticated";
GRANT ALL ON TABLE "public"."companies" TO "service_role";



GRANT SELECT ON TABLE "public"."companies_with_job_count" TO "anon";
GRANT SELECT ON TABLE "public"."companies_with_job_count" TO "authenticated";
GRANT SELECT ON TABLE "public"."companies_with_job_count" TO "service_role";



GRANT SELECT ON TABLE "public"."comparisons" TO "anon";
GRANT SELECT ON TABLE "public"."comparisons" TO "authenticated";
GRANT ALL ON TABLE "public"."comparisons" TO "service_role";



GRANT SELECT ON TABLE "public"."guides" TO "anon";
GRANT SELECT ON TABLE "public"."guides" TO "authenticated";
GRANT ALL ON TABLE "public"."guides" TO "service_role";



GRANT INSERT ON TABLE "public"."job_events" TO "anon";
GRANT ALL ON TABLE "public"."job_events" TO "authenticated";
GRANT ALL ON TABLE "public"."job_events" TO "service_role";



GRANT ALL ON TABLE "public"."job_ingestion" TO "authenticated";
GRANT ALL ON TABLE "public"."job_ingestion" TO "service_role";



GRANT ALL ON TABLE "public"."job_payments" TO "authenticated";
GRANT ALL ON TABLE "public"."job_payments" TO "service_role";



GRANT SELECT ON TABLE "public"."jobs" TO "anon";
GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";



GRANT SELECT ON TABLE "public"."jobs_with_payment" TO "anon";
GRANT SELECT ON TABLE "public"."jobs_with_payment" TO "authenticated";
GRANT SELECT ON TABLE "public"."jobs_with_payment" TO "service_role";



GRANT ALL ON TABLE "public"."newsletter_subscribers" TO "authenticated";
GRANT ALL ON TABLE "public"."newsletter_subscribers" TO "service_role";



GRANT SELECT ON TABLE "public"."roles" TO "anon";
GRANT SELECT ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT SELECT ON TABLE "public"."salaries" TO "anon";
GRANT SELECT ON TABLE "public"."salaries" TO "authenticated";
GRANT ALL ON TABLE "public"."salaries" TO "service_role";



GRANT SELECT ON TABLE "public"."sorted_companies" TO "anon";
GRANT SELECT ON TABLE "public"."sorted_companies" TO "authenticated";
GRANT SELECT ON TABLE "public"."sorted_companies" TO "service_role";


































