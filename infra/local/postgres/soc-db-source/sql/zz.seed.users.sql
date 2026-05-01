DO $$
DECLARE
  users_id_type text;
BEGIN
  SELECT data_type
  INTO users_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'id';

  IF users_id_type = 'uuid' THEN
    INSERT INTO users (id, name, email, password)
    VALUES
      ('11111111-1111-1111-1111-111111111111', 'Admin', 'admin@mail.com', '$2a$10$Y/5kWWaZjnAYj1c/IJpMU.JpJ.gWGKqalOPv0WM3Z7N.Fzll341Di'),
      ('22222222-2222-2222-2222-222222222222', 'User', 'user@mail.com', '$2a$10$Y/5kWWaZjnAYj1c/IJpMU.JpJ.gWGKqalOPv0WM3Z7N.Fzll341Di')
    ON CONFLICT (email) DO NOTHING;
  ELSIF users_id_type IS NOT NULL THEN
    INSERT INTO users (name, email, password)
    VALUES
      ('Admin', 'admin@mail.com', '$2a$10$Y/5kWWaZjnAYj1c/IJpMU.JpJ.gWGKqalOPv0WM3Z7N.Fzll341Di'),
      ('User', 'user@mail.com', '$2a$10$Y/5kWWaZjnAYj1c/IJpMU.JpJ.gWGKqalOPv0WM3Z7N.Fzll341Di')
    ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;

DO $$
DECLARE
  users_id_type text;
  observations_has_status boolean;
  observations_has_category boolean;
  admin_user_id_int int;
  default_user_id_int int;
  admin_user_id_uuid uuid;
  default_user_id_uuid uuid;
  patient_ana_id_int int;
  patient_carlos_id_int int;
  patient_ana_id_uuid uuid;
  patient_carlos_id_uuid uuid;
BEGIN
  INSERT INTO patients (name, birth_date, gender, address)
  SELECT 'Ana Perez', DATE '1990-04-15', 'female', 'Calle 123, Buenos Aires'
  WHERE NOT EXISTS (
    SELECT 1 FROM patients WHERE name = 'Ana Perez' AND birth_date = DATE '1990-04-15'
  );

  INSERT INTO patients (name, birth_date, gender, address)
  SELECT 'Carlos Gomez', DATE '1985-11-22', 'male', 'Av. Siempre Viva 742, Cordoba'
  WHERE NOT EXISTS (
    SELECT 1 FROM patients WHERE name = 'Carlos Gomez' AND birth_date = DATE '1985-11-22'
  );

  SELECT data_type
  INTO users_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'id';

  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'observations'
      AND column_name = 'status'
  ) INTO observations_has_status;

  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'observations'
      AND column_name = 'category'
  ) INTO observations_has_category;

  IF users_id_type = 'uuid' THEN
    SELECT id INTO admin_user_id_uuid FROM users WHERE email = 'admin@mail.com' LIMIT 1;
    SELECT id INTO default_user_id_uuid FROM users WHERE email = 'user@mail.com' LIMIT 1;
    SELECT id INTO patient_ana_id_uuid FROM patients WHERE name = 'Ana Perez' LIMIT 1;
    SELECT id INTO patient_carlos_id_uuid FROM patients WHERE name = 'Carlos Gomez' LIMIT 1;

    IF observations_has_status AND observations_has_category THEN
      INSERT INTO observations (id, code, value, date, status, category, patient_id, user_id)
      VALUES
        ('aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '8867-4', '120', NOW() - INTERVAL '3 day', 'final', 'vital-signs', patient_ana_id_uuid, admin_user_id_uuid),
        ('aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '8480-6', '78', NOW() - INTERVAL '2 day', 'final', 'vital-signs', patient_ana_id_uuid, default_user_id_uuid),
        ('bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1', '8867-4', '130', NOW() - INTERVAL '1 day', 'final', 'vital-signs', patient_carlos_id_uuid, admin_user_id_uuid),
        ('bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2', '8310-5', '37.0', NOW() - INTERVAL '8 hour', 'final', 'vital-signs', patient_carlos_id_uuid, default_user_id_uuid),
        ('bbbbbbb3-bbbb-4bbb-8bbb-bbbbbbbbbbb3', '29463-7', '81', NOW() - INTERVAL '2 hour', 'final', 'exam', patient_carlos_id_uuid, admin_user_id_uuid)
      ON CONFLICT (id) DO NOTHING;
    END IF;
  ELSE
    SELECT id INTO admin_user_id_int FROM users WHERE email = 'admin@mail.com' LIMIT 1;
    SELECT id INTO default_user_id_int FROM users WHERE email = 'user@mail.com' LIMIT 1;
    SELECT id INTO patient_ana_id_int FROM patients WHERE name = 'Ana Perez' LIMIT 1;
    SELECT id INTO patient_carlos_id_int FROM patients WHERE name = 'Carlos Gomez' LIMIT 1;

    IF observations_has_status AND observations_has_category THEN
      INSERT INTO observations (id, code, value, date, status, category, patient_id, user_id)
      SELECT 'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '8867-4', '120', NOW() - INTERVAL '3 day', 'final', 'vital-signs', patient_ana_id_int, admin_user_id_int
      WHERE NOT EXISTS (
        SELECT 1 FROM observations WHERE patient_id = patient_ana_id_int AND code = '8867-4' AND value = '120'
      );

      INSERT INTO observations (id, code, value, date, status, category, patient_id, user_id)
      SELECT 'aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '8480-6', '78', NOW() - INTERVAL '2 day', 'final', 'vital-signs', patient_ana_id_int, default_user_id_int
      WHERE NOT EXISTS (
        SELECT 1 FROM observations WHERE patient_id = patient_ana_id_int AND code = '8480-6' AND value = '78'
      );

      INSERT INTO observations (id, code, value, date, status, category, patient_id, user_id)
      SELECT 'bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1', '8867-4', '130', NOW() - INTERVAL '1 day', 'final', 'vital-signs', patient_carlos_id_int, admin_user_id_int
      WHERE NOT EXISTS (
        SELECT 1 FROM observations WHERE patient_id = patient_carlos_id_int AND code = '8867-4' AND value = '130'
      );

      INSERT INTO observations (id, code, value, date, status, category, patient_id, user_id)
      SELECT 'bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2', '8310-5', '37.0', NOW() - INTERVAL '8 hour', 'final', 'vital-signs', patient_carlos_id_int, default_user_id_int
      WHERE NOT EXISTS (
        SELECT 1 FROM observations WHERE patient_id = patient_carlos_id_int AND code = '8310-5' AND value = '37.0'
      );

      INSERT INTO observations (id, code, value, date, status, category, patient_id, user_id)
      SELECT 'bbbbbbb3-bbbb-4bbb-8bbb-bbbbbbbbbbb3', '29463-7', '81', NOW() - INTERVAL '2 hour', 'final', 'exam', patient_carlos_id_int, admin_user_id_int
      WHERE NOT EXISTS (
        SELECT 1 FROM observations WHERE patient_id = patient_carlos_id_int AND code = '29463-7' AND value = '81'
      );
    ELSE
      INSERT INTO observations (code, value, date, patient_id, user_id)
      SELECT '8867-4', '120', NOW() - INTERVAL '3 day', patient_ana_id_int, admin_user_id_int
      WHERE NOT EXISTS (
        SELECT 1 FROM observations WHERE patient_id = patient_ana_id_int AND code = '8867-4' AND value = '120'
      );

      INSERT INTO observations (code, value, date, patient_id, user_id)
      SELECT '8480-6', '78', NOW() - INTERVAL '2 day', patient_ana_id_int, default_user_id_int
      WHERE NOT EXISTS (
        SELECT 1 FROM observations WHERE patient_id = patient_ana_id_int AND code = '8480-6' AND value = '78'
      );

      INSERT INTO observations (code, value, date, patient_id, user_id)
      SELECT '8867-4', '130', NOW() - INTERVAL '1 day', patient_carlos_id_int, admin_user_id_int
      WHERE NOT EXISTS (
        SELECT 1 FROM observations WHERE patient_id = patient_carlos_id_int AND code = '8867-4' AND value = '130'
      );

      INSERT INTO observations (code, value, date, patient_id, user_id)
      SELECT '8310-5', '37.0', NOW() - INTERVAL '8 hour', patient_carlos_id_int, default_user_id_int
      WHERE NOT EXISTS (
        SELECT 1 FROM observations WHERE patient_id = patient_carlos_id_int AND code = '8310-5' AND value = '37.0'
      );

      INSERT INTO observations (code, value, date, patient_id, user_id)
      SELECT '29463-7', '81', NOW() - INTERVAL '2 hour', patient_carlos_id_int, admin_user_id_int
      WHERE NOT EXISTS (
        SELECT 1 FROM observations WHERE patient_id = patient_carlos_id_int AND code = '29463-7' AND value = '81'
      );
    END IF;
  END IF;
END $$;
