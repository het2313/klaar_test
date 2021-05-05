CREATE DATABASE perntodo;
CREATE TABLE banks(
    ifsc character varying(11) NOT NULL,
    bank_id bigint,
    branch character varying(74),
    address character varying(500),
    city character varying(50),
    district character varying(50),
    state character varying(26),
    bank_name character varying(500)
);
COPY banks(
    ifsc,
    bank_id,
    branch,
    address,
    city,
    district,
    state,
    bank_name
)
FROM 'E:\react_projects\klaar_test\klaar_backend_test\indian_banks-master\bank_branches.csv' DELIMITER ',' CSV HEADER;