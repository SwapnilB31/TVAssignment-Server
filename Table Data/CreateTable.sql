CREATE TABLE public."RestaurantList"
(
    id integer NOT NULL,
    name character varying(40) COLLATE pg_catalog."default",
    price integer NOT NULL DEFAULT 100,
    ratings real NOT NULL DEFAULT 0,
    "numRatings" integer NOT NULL DEFAULT 0,
    "mealType" character varying(10) COLLATE pg_catalog."default",
    address character varying(30) COLLATE pg_catalog."default",
    format json,
    occasion json,
    CONSTRAINT "RestaurantList_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public."RestaurantList"
    OWNER to postgres;