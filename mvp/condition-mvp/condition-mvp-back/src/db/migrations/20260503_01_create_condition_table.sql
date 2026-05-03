CREATE TABLE IF NOT EXISTS conditions (
  id int NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
  patient_id int NOT NULL,
  created_by int NOT NULL,
  clinical_status varchar(20) NOT NULL,
  verification_status varchar(20) NOT NULL,
  code varchar(120) NOT NULL,
  recorded_date timestamp NOT NULL,
  notes text,
  PRIMARY KEY (id),
  CONSTRAINT fk_conditions_patient FOREIGN KEY (patient_id) REFERENCES patients (id),
  CONSTRAINT fk_conditions_user FOREIGN KEY (created_by) REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS idx_conditions_patient_id ON conditions (patient_id);
