-- Create the sequence for the id column
CREATE SEQUENCE IF NOT EXISTS patient_id_seq;

-- Create the patient table
CREATE TABLE IF NOT EXISTS public.patient
(
    id integer NOT NULL DEFAULT nextval('patient_id_seq'),
    firstname character varying(30) COLLATE pg_catalog."default" NOT NULL,
    lastname character varying(30) COLLATE pg_catalog."default" NOT NULL,
    email character varying(55) COLLATE pg_catalog."default" NOT NULL,
    "number" integer NOT NULL,
    birthday date NOT NULL,
    age integer NOT NULL,
    address character varying(55) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT patient_pkey PRIMARY KEY (id)
);

ALTER TABLE public.patient
ADD COLUMN password character varying(255);

CREATE SEQUENCE refresh_tokens_id_seq;

-- Create the refresh_tokens table
CREATE TABLE IF NOT EXISTS public.refresh_tokens
(
    id integer NOT NULL DEFAULT nextval('refresh_tokens_id_seq'::regclass),
    user_id integer NOT NULL,
    token text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id)
);

-- No need for the OWNER TO postgres clause

CREATE SEQUENCE secadm_id_seq;

CREATE TABLE IF NOT EXISTS public.secadm
(
    id integer NOT NULL DEFAULT nextval('secadm_id_seq'),
    username character varying(255),
    password character varying(255),
    CONSTRAINT secadm_pkey PRIMARY KEY (id)
);

-- Sequence for doctores
CREATE SEQUENCE IF NOT EXISTS doctores_id_seq;

-- Create the doctores table
CREATE TABLE IF NOT EXISTS public.doctores
(
    id integer NOT NULL DEFAULT nextval('doctores_id_seq'),
    firstName character varying(30) NOT NULL,
    lastName character varying(30) NOT NULL,
    username character varying(50) NOT NULL UNIQUE,
    email character varying(55) NOT NULL UNIQUE,
    password character varying(255) NOT NULL,
    CONSTRAINT doctores_pkey PRIMARY KEY (id)
);

-- Sequence for role
CREATE SEQUENCE IF NOT EXISTS role_id_seq;

-- Create the role table
CREATE TABLE IF NOT EXISTS public.role
(
    id integer NOT NULL DEFAULT nextval('role_id_seq'),
    role_name character varying(50) NOT NULL UNIQUE,
    CONSTRAINT role_pkey PRIMARY KEY (id)
);

-- Sequence for users
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Create the users table
CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'),
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id) ON DELETE CASCADE
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    birthday DATE NOT NULL,
    appoint_day TIMESTAMP NOT NULL,
    address TEXT NOT NULL,
    selected_doctor VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- assistance table 

CREATE SEQUENCE assistance_id_seq;

CREATE TABLE IF NOT EXISTS public.assistance
(
    id integer NOT NULL DEFAULT nextval('assistance_id_seq'),
    username character varying(255),
    password character varying(255),
    CONSTRAINT assistance_pkey PRIMARY KEY (id)
);

-- Create sequence for medical records
CREATE SEQUENCE IF NOT EXISTS medical_records_id_seq;

-- Create Medical Records Table
CREATE TABLE IF NOT EXISTS public.medical_records
(
    record_id integer NOT NULL DEFAULT nextval('medical_records_id_seq'),
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    diagnosis text COLLATE pg_catalog."default",
    treatment_plan text COLLATE pg_catalog."default",
    notes text COLLATE pg_catalog."default",
    CONSTRAINT medical_records_pkey PRIMARY KEY (record_id),
    CONSTRAINT medical_records_patient_id_fkey FOREIGN KEY (patient_id)
        REFERENCES public.patient (id) ON DELETE CASCADE,
    CONSTRAINT medical_records_doctor_id_fkey FOREIGN KEY (doctor_id)
        REFERENCES public.doctores (id) ON DELETE CASCADE
);

-- Create sequence for eye examinations
CREATE SEQUENCE IF NOT EXISTS eye_examinations_id_seq;

-- Create Eye Examinations Table
CREATE TABLE IF NOT EXISTS public.eye_examinations
(
    exam_id integer NOT NULL DEFAULT nextval('eye_examinations_id_seq'),
    record_id integer NOT NULL,
    visual_acuity_right varchar(10) COLLATE pg_catalog."default",
    visual_acuity_left varchar(10) COLLATE pg_catalog."default",
    intraocular_pressure_right numeric(5,2),
    intraocular_pressure_left numeric(5,2),
    fundus_examination text COLLATE pg_catalog."default",
    anterior_segment text COLLATE pg_catalog."default",
    posterior_segment text COLLATE pg_catalog."default",
    exam_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT eye_examinations_pkey PRIMARY KEY (exam_id),
    CONSTRAINT eye_examinations_record_id_fkey FOREIGN KEY (record_id)
        REFERENCES public.medical_records (record_id) ON DELETE CASCADE
);

-- Create sequence for prescriptions
CREATE SEQUENCE IF NOT EXISTS prescriptions_id_seq;

-- Create Prescriptions Table
CREATE TABLE IF NOT EXISTS public.prescriptions
(
    prescription_id integer NOT NULL DEFAULT nextval('prescriptions_id_seq'),
    record_id integer NOT NULL,
    sphere_right numeric(5,2),
    cylinder_right numeric(5,2),
    axis_right integer,
    sphere_left numeric(5,2),
    cylinder_left numeric(5,2),
    axis_left integer,
    add_power numeric(5,2),
    pd numeric(5,2),
    prescription_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expiration_date timestamp without time zone,
    CONSTRAINT prescriptions_pkey PRIMARY KEY (prescription_id),
    CONSTRAINT prescriptions_record_id_fkey FOREIGN KEY (record_id)
        REFERENCES public.medical_records (record_id) ON DELETE CASCADE
);

-- Create sequence for imaging
CREATE SEQUENCE IF NOT EXISTS imaging_id_seq;

-- Create Imaging Table
CREATE TABLE IF NOT EXISTS public.imaging
(
    image_id integer NOT NULL DEFAULT nextval('imaging_id_seq'),
    record_id integer NOT NULL,
    image_type varchar(50) COLLATE pg_catalog."default",
    image_url text COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    upload_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT imaging_pkey PRIMARY KEY (image_id),
    CONSTRAINT imaging_record_id_fkey FOREIGN KEY (record_id)
        REFERENCES public.medical_records (record_id) ON DELETE CASCADE
);

-- Create sequence for appointment_status
CREATE SEQUENCE IF NOT EXISTS appointment_status_id_seq;

-- Create appointment_status table
CREATE TABLE IF NOT EXISTS public.appointment_status
(
    id integer NOT NULL DEFAULT nextval('appointment_status_id_seq'),
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL,
    appoint_day timestamp without time zone NOT NULL,
    status character varying(20) NOT NULL CHECK (status IN ('scheduled', 'checked_in', 'completed')),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT appointment_status_pkey PRIMARY KEY (id),
    CONSTRAINT appointment_status_patient_id_fkey FOREIGN KEY (patient_id)
        REFERENCES public.patient (id) ON DELETE CASCADE,
    CONSTRAINT appointment_status_doctor_id_fkey FOREIGN KEY (doctor_id)
        REFERENCES public.doctores (id) ON DELETE CASCADE
);

-- Create index for better query performance on appointment dates
CREATE INDEX IF NOT EXISTS idx_appointment_status_date ON public.appointment_status (appoint_day);

-- Create sequence for payments
CREATE SEQUENCE IF NOT EXISTS payments_id_seq;

-- Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments
(
    payment_id integer NOT NULL DEFAULT nextval('payments_id_seq'),
    patient_id integer NOT NULL,
    dr_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    payment_method character varying(50),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_pkey PRIMARY KEY (payment_id),
    CONSTRAINT payments_patient_id_fkey FOREIGN KEY (patient_id)
        REFERENCES public.patient (id) ON DELETE CASCADE,
    CONSTRAINT payments_dr_id_fkey FOREIGN KEY (dr_id)
        REFERENCES public.doctores (id) ON DELETE CASCADE
);

-- Create index for better query performance on payment dates
CREATE INDEX IF NOT EXISTS idx_payments_date ON public.payments (payment_date);

-- Create sequence for analysis_orders
CREATE SEQUENCE IF NOT EXISTS analysis_orders_id_seq;

-- Create Analysis Orders Table with minimal required columns
CREATE TABLE IF NOT EXISTS public.analysis_orders
(
    order_id integer NOT NULL DEFAULT nextval('analysis_orders_id_seq'),
    record_id integer NOT NULL,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL,
    analysis_test varchar(100) NOT NULL,
    priority varchar(20) NOT NULL CHECK (priority IN ('routine', 'urgent', 'emergency')),
    CONSTRAINT analysis_orders_pkey PRIMARY KEY (order_id),
    CONSTRAINT analysis_orders_record_id_fkey FOREIGN KEY (record_id)
        REFERENCES public.medical_records (record_id) ON DELETE CASCADE,
    CONSTRAINT analysis_orders_patient_id_fkey FOREIGN KEY (patient_id)
        REFERENCES public.patient (id) ON DELETE CASCADE,
    CONSTRAINT analysis_orders_doctor_id_fkey FOREIGN KEY (doctor_id)
        REFERENCES public.doctores (id) ON DELETE CASCADE
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_analysis_orders_patient ON public.analysis_orders (patient_id);