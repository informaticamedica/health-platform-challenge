DROP TABLE IF EXISTS observations CASCADE;

DROP TABLE IF EXISTS patients CASCADE;

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE observations (
  id int NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
  code varchar(50) NOT NULL,
  value varchar(255) NOT NULL,
  date timestamp DEFAULT CURRENT_TIMESTAMP,
  patient_id int NOT NULL,
  user_id int NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE patients (
  id int NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
  name varchar(100) NOT NULL,
  birth_date date NOT NULL,
  gender varchar(10) NOT NULL,
  address varchar(255),
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id int NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
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