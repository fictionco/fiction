import { Knex } from "knex"

/**
 * Extend DB functionality
 */
export const extendDb = async (db: Knex): Promise<void> => {
  // make sure crypto exists
  await db.raw(`CREATE EXTENSION IF NOT EXISTS pgcrypto`)
  /**
   * 24 Digit ObjectIds
   */
  const createObjectId =
    db.raw(`CREATE OR REPLACE FUNCTION generate_object_id(prefix text default '') RETURNS varchar AS $$
  DECLARE
      time_component bigint;
      machine_id bigint := FLOOR(random() * 16777215);
      process_id bigint;
      seq_id bigint := FLOOR(random() * 16777215);
      result varchar:= prefix;
  BEGIN
      SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp())) INTO time_component;
      SELECT pg_backend_pid() INTO process_id;

      result := result || lpad(to_hex(time_component), 8, '0');
      result := result || lpad(to_hex(machine_id), 6, '0');
      result := result || lpad(to_hex(process_id), 4, '0');
      result := result || lpad(to_hex(seq_id), 6, '0');
      RETURN result;
  END;
$$ LANGUAGE PLPGSQL;`)

  /**
   * Any length UID "short_id"
   * https://stackoverflow.com/a/41988979/1858322
   */
  const createShortId =
    await db.raw<string>(`CREATE OR REPLACE FUNCTION short_id(size INT) RETURNS TEXT AS $$
  DECLARE
    characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    bytes BYTEA := gen_random_bytes(size);
    l INT := length(characters);
    i INT := 0;
    output TEXT := '';
  BEGIN
    WHILE i < size LOOP
      output := output || substr(characters, get_byte(bytes, i) % l + 1, 1);
      i := i + 1;
    END LOOP;
    RETURN output;
  END;
  $$ LANGUAGE plpgsql VOLATILE;`)

  const createRandomBetween = await db.raw<string>(
    `CREATE OR REPLACE FUNCTION random_between(low BIGINT, high BIGINT) RETURNS BIGINT AS $$
      BEGIN
        RETURN floor(random()* (high-low + 1) + low);
      END;
      $$ language plpgsql VOLATILE;`,
  )
  /**
   * Utility that allows deep setting in JSON objects
   * https://stackoverflow.com/a/64024397/1858322
   */
  const deepJsonSet = await db.raw<string>(
    `CREATE OR REPLACE FUNCTION jsonb_set_deep(current_json jsonb, global_path text[], new_value jsonb) RETURNS jsonb AS $$
      BEGIN
        IF current_json is null THEN
          current_json := '{}'::jsonb;
        END IF;
        FOR index IN 1..ARRAY_LENGTH(global_path, 1) LOOP
          IF current_json #> global_path[1:index] is null THEN
            current_json := jsonb_set(current_json, global_path[1:index], '{}');
          END IF;
        END LOOP;
        current_json := jsonb_set(current_json, global_path, new_value);
        RETURN current_json;
      END;
    $$ LANGUAGE 'plpgsql';`,
  )
  /**
   * Adds merge patch functionality to in place JSONB
   * https://stackoverflow.com/a/65093455/1858322
   * https://tools.ietf.org/html/rfc7396
   *
   */
  const jsonMergePatch = await db.raw<string>(
    `CREATE OR REPLACE FUNCTION jsonb_merge_patch("target" jsonb, "patch" jsonb) RETURNS jsonb AS $$
      BEGIN
          RETURN COALESCE(jsonb_object_agg(
              COALESCE("tkey", "pkey"),
              CASE
                  WHEN "tval" ISNULL THEN "pval"
                  WHEN "pval" ISNULL THEN "tval"
                  WHEN jsonb_typeof("tval") != 'object' OR jsonb_typeof("pval") != 'object' THEN "pval"
                  ELSE jsonb_merge_patch("tval", "pval")
              END
          ), '{}'::jsonb)
          FROM jsonb_each("target") e1("tkey", "tval")
          FULL JOIN jsonb_each("patch") e2("pkey", "pval")
            ON "tkey" = "pkey"
          WHERE jsonb_typeof("pval") != 'null'
            OR "pval" ISNULL;
      END;
    $$ LANGUAGE plpgsql;`,
  )

  await Promise.all([
    createObjectId,
    createShortId,
    createRandomBetween,
    deepJsonSet,
    jsonMergePatch,
  ])
}
