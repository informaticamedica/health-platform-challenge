CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS person (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  date_of_birth TEXT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS phone_type (
  id BIGSERIAL PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS phone (
  id BIGSERIAL PRIMARY KEY,
  number VARCHAR(30) NOT NULL,
  person_id BIGINT NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  phone_type_id BIGINT NOT NULL REFERENCES phone_type(id)
);

CREATE TABLE IF NOT EXISTS address (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  locality VARCHAR(120) NOT NULL,
  street VARCHAR(120) NOT NULL,
  number INTEGER NOT NULL,
  notes TEXT NULL
);

CREATE TABLE IF NOT EXISTS contact_activities (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  activity_type VARCHAR(20) NOT NULL CHECK (activity_type IN ('call', 'meeting', 'email')),
  activity_date TEXT NOT NULL,
  description TEXT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  birth_date TIMESTAMPTZ NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  address VARCHAR(255) NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  code VARCHAR(50) NOT NULL,
  value TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'final' CHECK (status IN ('final', 'preliminary', '')),
  category VARCHAR(50) NOT NULL DEFAULT 'vital-signs',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS observation_components (
  id BIGSERIAL PRIMARY KEY,
  observation_id UUID NOT NULL REFERENCES observations(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  value NUMERIC NOT NULL,
  unit VARCHAR(50) NOT NULL,
  CONSTRAINT observation_components_observation_id_code_key UNIQUE (observation_id, code)
);

CREATE INDEX IF NOT EXISTS idx_person_email ON person(email);
CREATE INDEX IF NOT EXISTS idx_phone_number ON phone(number);
CREATE INDEX IF NOT EXISTS idx_phone_person_id ON phone(person_id);
CREATE INDEX IF NOT EXISTS idx_address_person_id ON address(person_id);
CREATE INDEX IF NOT EXISTS idx_activity_person_type ON contact_activities(person_id, activity_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
CREATE INDEX IF NOT EXISTS idx_observations_patient_id ON observations(patient_id);
CREATE INDEX IF NOT EXISTS idx_observations_user_id ON observations(user_id);
CREATE INDEX IF NOT EXISTS idx_observations_code ON observations(code);
CREATE INDEX IF NOT EXISTS idx_observations_category ON observations(category);
CREATE INDEX IF NOT EXISTS idx_observation_components_observation_id ON observation_components(observation_id);
