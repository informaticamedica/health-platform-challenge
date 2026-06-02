INSERT INTO users (id, name, email, password)
VALUES
  (
    '11111111-1111-4111-8111-111111111111',
    'Admin',
    'admin@mail.com',
    'Test1234'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'User',
    'user@mail.com',
    'Test1234'
  )
ON CONFLICT (email) DO UPDATE
SET password = EXCLUDED.password,
    updated_at = NOW();

INSERT INTO patients (id, name, birth_date, gender, address)
VALUES
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'Ana Perez',
    '1990-04-15T00:00:00.000Z',
    'female',
    'Calle 123, Buenos Aires'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    'Carlos Gomez',
    '1985-11-22T00:00:00.000Z',
    'male',
    'Av. Siempre Viva 742, Cordoba'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO observations (id, patient_id, user_id, code, value, date, status, category)
VALUES
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    '8867-4',
    '72',
    NOW() - INTERVAL '3 days',
    'final',
    'vital-signs'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '22222222-2222-4222-8222-222222222222',
    '85354-9',
    '120/78',
    NOW() - INTERVAL '2 days',
    'final',
    'vital-signs'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd1',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '11111111-1111-4111-8111-111111111111',
    '8310-5',
    '37.0',
    NOW() - INTERVAL '8 hours',
    'final',
    'vital-signs'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd2',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '22222222-2222-4222-8222-222222222222',
    '29463-7',
    '81',
    NOW() - INTERVAL '2 hours',
    'preliminary',
    'exam'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO observation_components (observation_id, code, value, unit)
VALUES
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', '8480-6', 120, 'mmHg'),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', '8462-4', 78, 'mmHg')
ON CONFLICT (observation_id, code) DO NOTHING;
