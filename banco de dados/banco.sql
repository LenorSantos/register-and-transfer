--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg22.04+1)
-- Dumped by pg_dump version 15.1 (Ubuntu 15.1-1.pgdg22.04+1)

-- Started on 2022-12-21 16:42:28 -03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16440)
-- Name: Accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Accounts" (
    id text NOT NULL,
    balance double precision NOT NULL
);


ALTER TABLE public."Accounts" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16445)
-- Name: Transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Transactions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public."Transactions_id_seq" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16446)
-- Name: Transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transactions" (
    id integer DEFAULT nextval('public."Transactions_id_seq"'::regclass) NOT NULL,
    value double precision NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "debitedAccountId" text NOT NULL,
    "creditedAccountId" text NOT NULL
);


ALTER TABLE public."Transactions" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16452)
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16453)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer DEFAULT nextval('public."Users_id_seq"'::regclass) NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    "accountId" text
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 3380 (class 0 OID 16440)
-- Dependencies: 214
-- Data for Name: Accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Accounts" (id, balance) FROM stdin;
mariana	82.75
ramon	89.25
sara	112.25
luiz	115.75
\.


--
-- TOC entry 3382 (class 0 OID 16446)
-- Dependencies: 216
-- Data for Name: Transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transactions" (id, value, "createdAt", "debitedAccountId", "creditedAccountId") FROM stdin;
16	50.5	2022-11-23 23:01:20-03	luiz	sara
17	17.25	2022-11-24 00:36:41-03	mariana	luiz
18	22.5	2022-12-19 14:21:45-03	luiz	sara
19	10.75	2022-12-19 14:23:10-03	ramon	luiz
20	60.75	2022-12-21 12:58:23-03	sara	luiz
\.


--
-- TOC entry 3384 (class 0 OID 16453)
-- Dependencies: 218
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, username, password, "accountId") FROM stdin;
15	luiz	$2b$10$F3F8HkyMMsscPdJbUxTEvOP9fqRVYjyEHsK9Ch89mpYvUpr0HFbXq	luiz
16	mariana	$2b$10$grifc0HOF6YLM7ECOsbyGe.uiCysprIc1VRi4CZYrf0aw.5OMDyKS	mariana
17	sara	$2b$10$rXytBb/2MnxVgjdbYzlRGuaNfLCpScLoYG8UOUK/DhgokrqSgZcym	sara
18	ramon	$2b$10$SO7VktuBbevjrgv1qosO8.UYMpWy37pceD56q6S0TW/koDwQyIAcW	ramon
\.


--
-- TOC entry 3390 (class 0 OID 0)
-- Dependencies: 215
-- Name: Transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Transactions_id_seq"', 20, true);


--
-- TOC entry 3391 (class 0 OID 0)
-- Dependencies: 217
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 18, true);


--
-- TOC entry 3230 (class 2606 OID 16460)
-- Name: Accounts Accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Accounts"
    ADD CONSTRAINT "Accounts_pkey" PRIMARY KEY (id);


--
-- TOC entry 3232 (class 2606 OID 16462)
-- Name: Transactions Transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY (id);


--
-- TOC entry 3234 (class 2606 OID 16464)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- TOC entry 3237 (class 2606 OID 16465)
-- Name: Users accountId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "accountId" FOREIGN KEY ("accountId") REFERENCES public."Accounts"(id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3235 (class 2606 OID 16470)
-- Name: Transactions creditedAccountId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "creditedAccountId" FOREIGN KEY ("creditedAccountId") REFERENCES public."Accounts"(id) NOT VALID;


--
-- TOC entry 3236 (class 2606 OID 16475)
-- Name: Transactions debitedAccountId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "debitedAccountId" FOREIGN KEY ("debitedAccountId") REFERENCES public."Accounts"(id) NOT VALID;


-- Completed on 2022-12-21 16:42:28 -03

--
-- PostgreSQL database dump complete
--

