DROP TABLE IF EXISTS observation_components CASCADE;

DROP TABLE IF EXISTS observations CASCADE;

DROP TABLE IF EXISTS patients CASCADE;

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE observation_components (
  id uuid NOT NULL,
  code varchar(50) NOT NULL,
  value decimal NOT NULL,
  unit varchar(50) NOT NULL,
  observation_id uuid NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE observations (
  id uuid NOT NULL,
  code varchar(50) NOT NULL,
  value varchar(255),
  date timestamp DEFAULT CURRENT_TIMESTAMP,
  status varchar(20) NOT NULL,
  category varchar(50) NOT NULL,
  patient_id uuid NOT NULL,
  user_id uuid NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE patients (
  id uuid NOT NULL,
  name varchar(100) NOT NULL,
  birth_date date NOT NULL,
  gender varchar(10) NOT NULL,
  address varchar(255),
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id uuid NOT NULL,
  name varchar(100) NOT NULL,
  email varchar(150) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  jwt_token text,
  PRIMARY KEY (id)
);

ALTER TABLE
  observations
ADD
  CONSTRAINT FK_patients_TO_observations FOREIGN KEY (patient_id) REFERENCES patients (id);

ALTER TABLE
  observations
ADD
  CONSTRAINT FK_users_TO_observations FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE
  observation_components DROP CONSTRAINT IF EXISTS FK_observations_TO_observation_components;

ALTER TABLE
  observation_components
ADD
  CONSTRAINT FK_observations_TO_observation_components FOREIGN KEY (observation_id) REFERENCES observations (id) ON DELETE CASCADE;