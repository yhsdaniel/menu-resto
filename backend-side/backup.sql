--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Menu" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    "imageUrl" text NOT NULL,
    "categoryId" text NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "isPopular" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Menu" OWNER TO postgres;

--
-- Name: Menu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Menu_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Menu_id_seq" OWNER TO postgres;

--
-- Name: Menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Menu_id_seq" OWNED BY public."Menu".id;


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id integer NOT NULL,
    "tableOrderId" integer NOT NULL,
    amount double precision NOT NULL,
    "paidAmount" double precision DEFAULT 0 NOT NULL,
    "changeAmount" double precision DEFAULT 0 NOT NULL,
    status text NOT NULL,
    "paymentMethod" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: Payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payment_id_seq" OWNER TO postgres;

--
-- Name: Payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Payment_id_seq" OWNED BY public."Payment".id;


--
-- Name: TableOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TableOrder" (
    id integer NOT NULL,
    "tableNumber" integer NOT NULL,
    "totalPrice" double precision NOT NULL,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TableOrder" OWNER TO postgres;

--
-- Name: TableOrderMenu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TableOrderMenu" (
    id integer NOT NULL,
    "tableOrderId" integer NOT NULL,
    "menuId" integer NOT NULL,
    quantity integer NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TableOrderMenu" OWNER TO postgres;

--
-- Name: TableOrderMenu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TableOrderMenu_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TableOrderMenu_id_seq" OWNER TO postgres;

--
-- Name: TableOrderMenu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TableOrderMenu_id_seq" OWNED BY public."TableOrderMenu".id;


--
-- Name: TableOrder_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TableOrder_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TableOrder_id_seq" OWNER TO postgres;

--
-- Name: TableOrder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TableOrder_id_seq" OWNED BY public."TableOrder".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Menu id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Menu" ALTER COLUMN id SET DEFAULT nextval('public."Menu_id_seq"'::regclass);


--
-- Name: Payment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN id SET DEFAULT nextval('public."Payment_id_seq"'::regclass);


--
-- Name: TableOrder id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TableOrder" ALTER COLUMN id SET DEFAULT nextval('public."TableOrder_id_seq"'::regclass);


--
-- Name: TableOrderMenu id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TableOrderMenu" ALTER COLUMN id SET DEFAULT nextval('public."TableOrderMenu_id_seq"'::regclass);


--
-- Data for Name: Menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Menu" (id, name, description, price, "imageUrl", "categoryId", "isAvailable", "isPopular", "createdAt", "updatedAt") FROM stdin;
1	Nasi Goreng Spesial	Nasi goreng dengan telur, ayam, udang, dan sayuran segar	35000	https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop	main-course	t	t	2026-05-05 04:40:54.147	2026-05-05 04:37:35.404
2	Mie Goreng Seafood	Mie goreng dengan udang, cumi, dan sayuran	38000	https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop	main-course	t	t	2026-05-05 06:05:14.713	2026-05-05 06:05:14.713
3	Ayam Bakar Madu	Ayam bakar dengan saus madu spesial dan lalapan	42000	https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop	main-course	t	t	2026-05-05 06:06:02.197	2026-05-05 06:06:02.197
4	Sate Ayam	10 tusuk sate ayam dengan bumbu kacang	30000	https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&h=300&fit=crop	main-course	t	f	2026-05-05 06:06:42.586	2026-05-05 06:06:42.586
5	Salad	Salad dengan sayur dan daging segar	45000	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop	appetizer	t	f	2026-05-05 06:25:35.905	2026-05-05 06:25:35.905
6	Lumpia Goreng	Lumpia isi sayuran dan ayam, 3 pcs	30000	https://images.unsplash.com/photo-1581438761655-ebb4e43add30?w=400&h=300&fit=crop	appetizer	t	f	2026-05-05 06:37:26.952	2026-05-05 06:37:26.952
7	Kentang Goreng	Kentang goreng crispy dengan saus sambal	20000	https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop	snack	t	f	2026-05-05 06:38:02.709	2026-05-05 06:38:02.709
8	Pisang Goreng Keju	Pisang goreng crispy	15000	https://images.unsplash.com/photo-1540714605746-4f474eefc6d4?w=400&h=300&fit=crop	snack	t	f	2026-05-05 06:40:10.92	2026-05-05 06:40:10.92
9	Kopi Susu	Espresso dengan susu segar dan gula aren	22000	https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop	coffee	t	t	2026-05-05 06:41:15.855	2026-05-05 06:41:15.855
10	Americano	Double shot espresso	20000	https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&h=300&fit=crop	coffee	t	f	2026-05-05 06:44:01.979	2026-05-05 06:44:01.979
12	Matcha Latte	Matcha premium dengan susu segar	28000	https://images.unsplash.com/photo-1749280447307-31a68eb38673?w=400&h=300&fit=crop	tea	t	f	2026-05-05 07:40:02.536	2026-05-05 07:40:02.536
13	Ice Tea	Teh manis segar dengan es batu	10000	https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop	tea	t	f	2026-05-05 07:41:06.605	2026-05-05 07:41:06.605
14	Jus Alpukat	Jus alpukat segar dengan susu coklat	22000	https://images.unsplash.com/photo-1583525999977-2b928def9ab6/?w=400&h=300&fit=crop	juice	t	f	2026-05-05 07:44:37.02	2026-05-05 07:44:37.02
15	Jus Jeruk	Jus jeruk segar tanpa gula tambahan	18000	https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop	juice	t	f	2026-05-05 07:45:03.364	2026-05-05 07:45:03.364
16	Mango Smoothie	Smoothie mangga segar dengan yogurt	25000	https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop	smoothie	t	f	2026-05-05 07:45:27.58	2026-05-05 07:45:27.58
17	Brownies Coklat	Brownies coklat premium dengan ice cream vanilla	28000	https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop	dessert	t	f	2026-05-05 07:46:42.425	2026-05-05 07:46:42.425
18	Pancake Maple	Pancake fluffy dengan maple syrup dan buah segar	32000	https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop	snack	t	f	2026-05-05 07:47:18.218	2026-05-05 07:47:18.218
19	Es Krim Tiga Rasa	Vanilla, coklat, dan strawberry dengan topping	25000	https://images.unsplash.com/photo-1645878490155-a0dbcd313645/?w=400&h=300&fit=crop	dessert	t	t	2026-05-05 07:49:04.619	2026-05-05 07:49:04.619
20	Bakso	Bakso daging sapi gurih	25000	https://images.unsplash.com/photo-1747317368514-590dad462536?w=400&h=300&fit=crop	appetizer	t	f	2026-05-05 07:50:34.655	2026-05-05 07:50:34.655
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, "tableOrderId", amount, "paidAmount", "changeAmount", status, "paymentMethod", "createdAt", "updatedAt") FROM stdin;
1	1	35000	35000	0	paid	qris	2026-05-05 07:54:12.426	2026-05-05 07:54:12.426
2	3	35000	35000	0	paid	card	2026-05-06 09:32:39.2	2026-05-06 09:32:39.2
3	2	35000	35000	0	paid	cash	2026-05-06 09:33:34.444	2026-05-06 09:33:34.444
\.


--
-- Data for Name: TableOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TableOrder" (id, "tableNumber", "totalPrice", status, "createdAt", "updatedAt") FROM stdin;
1	1	35000	paid	2026-05-05 07:53:34.741	2026-05-05 07:54:12.424
3	1	35000	paid	2026-05-06 09:32:17.357	2026-05-06 09:32:39.195
2	1	35000	paid	2026-05-06 09:31:22.417	2026-05-06 09:33:34.443
\.


--
-- Data for Name: TableOrderMenu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TableOrderMenu" (id, "tableOrderId", "menuId", quantity, notes, "createdAt", "updatedAt") FROM stdin;
1	1	1	1	\N	2026-05-05 07:53:34.741	2026-05-05 07:53:34.741
2	2	1	1	\N	2026-05-06 09:31:22.417	2026-05-06 09:31:22.417
3	3	1	1	\N	2026-05-06 09:32:17.357	2026-05-06 09:32:17.357
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
17ab9025-b6a3-42d4-a225-c1fe1de59003	7b6db3a39c9673eddad34c45d3d6048692bb078e3e45dfe2a69e3013ec62cb4b	2026-05-05 11:36:18.662432+07	20260505043618_init	\N	\N	2026-05-05 11:36:18.598639+07	1
\.


--
-- Name: Menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Menu_id_seq"', 20, true);


--
-- Name: Payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Payment_id_seq"', 3, true);


--
-- Name: TableOrderMenu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TableOrderMenu_id_seq"', 3, true);


--
-- Name: TableOrder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TableOrder_id_seq"', 3, true);


--
-- Name: Menu Menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Menu"
    ADD CONSTRAINT "Menu_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: TableOrderMenu TableOrderMenu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TableOrderMenu"
    ADD CONSTRAINT "TableOrderMenu_pkey" PRIMARY KEY (id);


--
-- Name: TableOrder TableOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TableOrder"
    ADD CONSTRAINT "TableOrder_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Payment_paymentMethod_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_paymentMethod_idx" ON public."Payment" USING btree ("paymentMethod");


--
-- Name: Payment_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_status_idx" ON public."Payment" USING btree (status);


--
-- Name: Payment_tableOrderId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_tableOrderId_key" ON public."Payment" USING btree ("tableOrderId");


--
-- Name: TableOrderMenu_menuId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TableOrderMenu_menuId_idx" ON public."TableOrderMenu" USING btree ("menuId");


--
-- Name: TableOrderMenu_tableOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TableOrderMenu_tableOrderId_idx" ON public."TableOrderMenu" USING btree ("tableOrderId");


--
-- Name: TableOrderMenu_tableOrderId_menuId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TableOrderMenu_tableOrderId_menuId_key" ON public."TableOrderMenu" USING btree ("tableOrderId", "menuId");


--
-- Name: TableOrder_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TableOrder_status_idx" ON public."TableOrder" USING btree (status);


--
-- Name: TableOrder_tableNumber_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TableOrder_tableNumber_idx" ON public."TableOrder" USING btree ("tableNumber");


--
-- Name: Payment Payment_tableOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_tableOrderId_fkey" FOREIGN KEY ("tableOrderId") REFERENCES public."TableOrder"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TableOrderMenu TableOrderMenu_menuId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TableOrderMenu"
    ADD CONSTRAINT "TableOrderMenu_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES public."Menu"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TableOrderMenu TableOrderMenu_tableOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TableOrderMenu"
    ADD CONSTRAINT "TableOrderMenu_tableOrderId_fkey" FOREIGN KEY ("tableOrderId") REFERENCES public."TableOrder"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

