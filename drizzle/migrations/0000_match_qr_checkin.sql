CREATE TYPE public.app_role AS ENUM ('organizer', 'admin');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Organizers read organizer profiles" ON public.profiles
  FOR SELECT TO authenticated USING (
    public.has_role(auth.uid(), 'organizer') AND public.has_role(id, 'organizer')
  );
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
      NULLIF(NEW.raw_user_meta_data ->> 'name', ''),
      split_part(COALESCE(NEW.email, ''), '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

CREATE TABLE public.players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  football_id text NOT NULL UNIQUE,
  full_name text NOT NULL,
  team text NOT NULL,
  category text NOT NULL,
  passport_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.players TO authenticated;
GRANT ALL ON public.players TO service_role;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Organizers read players" ON public.players
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'organizer'));

CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_name text NOT NULL,
  category text NOT NULL,
  home_team text NOT NULL,
  away_team text NOT NULL,
  kickoff_at timestamptz NOT NULL,
  venue text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.matches TO authenticated;
GRANT ALL ON public.matches TO service_role;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Organizers read matches" ON public.matches
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'organizer'));

CREATE TABLE public.match_roster (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  team text NOT NULL,
  shirt_number integer,
  UNIQUE (match_id, player_id)
);
GRANT SELECT ON public.match_roster TO authenticated;
GRANT ALL ON public.match_roster TO service_role;
ALTER TABLE public.match_roster ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Organizers read rosters" ON public.match_roster
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'organizer'));

CREATE TABLE public.match_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  method text NOT NULL DEFAULT 'qr' CHECK (method IN ('qr', 'manual')),
  checked_in_by uuid NOT NULL,
  checked_in_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (match_id, player_id)
);
GRANT SELECT ON public.match_checkins TO authenticated;
GRANT ALL ON public.match_checkins TO service_role;
ALTER TABLE public.match_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Organizers read check-ins" ON public.match_checkins
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'organizer'));

CREATE INDEX match_roster_match_idx ON public.match_roster (match_id);
CREATE INDEX match_checkins_match_idx ON public.match_checkins (match_id);

CREATE OR REPLACE FUNCTION public.check_in_player(_match_id uuid, _code text, _method text DEFAULT 'qr')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_raw text := btrim(COALESCE(_code, ''));
  v_player public.players%ROWTYPE;
  v_team text;
  v_at timestamptz;
BEGIN
  IF v_uid IS NULL OR NOT public.has_role(v_uid, 'organizer') THEN
    RETURN jsonb_build_object('status', 'forbidden');
  END IF;
  IF _method NOT IN ('qr', 'manual') THEN
    RETURN jsonb_build_object('status', 'invalid_method');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.matches WHERE id = _match_id) THEN
    RETURN jsonb_build_object('status', 'no_match');
  END IF;

  IF upper(v_raw) LIKE 'BOLAID:P:%' THEN
    SELECT * INTO v_player FROM public.players
      WHERE passport_token = lower(substr(v_raw, 10));
  ELSIF _method = 'manual' THEN
    SELECT * INTO v_player FROM public.players
      WHERE upper(football_id) = upper(v_raw);
  END IF;

  IF v_player.id IS NULL THEN
    RETURN jsonb_build_object('status', 'unknown');
  END IF;

  SELECT team INTO v_team FROM public.match_roster
    WHERE match_id = _match_id AND player_id = v_player.id;
  IF v_team IS NULL THEN
    RETURN jsonb_build_object(
      'status', 'not_in_roster',
      'player_name', v_player.full_name,
      'football_id', v_player.football_id,
      'team', v_player.team
    );
  END IF;

  INSERT INTO public.match_checkins (match_id, player_id, method, checked_in_by)
  VALUES (_match_id, v_player.id, _method, v_uid)
  ON CONFLICT (match_id, player_id) DO NOTHING
  RETURNING checked_in_at INTO v_at;

  IF v_at IS NULL THEN
    SELECT checked_in_at INTO v_at FROM public.match_checkins
      WHERE match_id = _match_id AND player_id = v_player.id;
    RETURN jsonb_build_object(
      'status', 'duplicate',
      'player_name', v_player.full_name,
      'football_id', v_player.football_id,
      'team', v_team,
      'checked_in_at', v_at
    );
  END IF;

  RETURN jsonb_build_object(
    'status', 'ok',
    'player_name', v_player.full_name,
    'football_id', v_player.football_id,
    'team', v_team,
    'checked_in_at', v_at
  );
END;
$$;
REVOKE EXECUTE ON FUNCTION public.check_in_player(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_in_player(uuid, text, text) TO authenticated, service_role;

INSERT INTO public.players (id, football_id, full_name, team, category, passport_token) VALUES
  ('a1000000-0000-4000-8000-000000000001', 'IDN-FB-2016-000123', 'Rizky Pratama', 'SSB Garuda Muda', 'U10', '7f3c9a2e51d84b06c1e2a9d4'),
  ('a1000000-0000-4000-8000-000000000002', 'IDN-FB-2016-000141', 'Fajar Nugraha', 'SSB Garuda Muda', 'U10', '2b8e41f0c7a95d13e6f04b72'),
  ('a1000000-0000-4000-8000-000000000003', 'IDN-FB-2016-000157', 'Andi Saputra', 'SSB Garuda Muda', 'U10', '9d05c3a7e2f1486b0a3c5e91'),
  ('a1000000-0000-4000-8000-000000000004', 'IDN-FB-2016-000208', 'Dimas Arya', 'SSB Pelita Gowa', 'U10', 'c46a1e9f03b7d28e5f19a0c3'),
  ('a1000000-0000-4000-8000-000000000005', 'IDN-FB-2016-000219', 'Bayu Kurnia', 'SSB Pelita Gowa', 'U10', '5e7b2d0a9c48f1e36b0d7a24'),
  ('a1000000-0000-4000-8000-000000000006', 'IDN-FB-2014-000318', 'Muhammad Akbar', 'SSB Hasanuddin', 'U12', 'e1f09b3c6a2d47805c9e3b16'),
  ('a1000000-0000-4000-8000-000000000007', 'IDN-FB-2014-000342', 'Rafi Ananda', 'SSB Karebosi', 'U12', '83a6d4e0b1c95f27d0e4a6b8');

INSERT INTO public.matches (id, tournament_name, category, home_team, away_team, kickoff_at, venue) VALUES
  ('b2000000-0000-4000-8000-000000000001', 'Makassar Youth Cup 2027', 'U10', 'SSB Garuda Muda', 'SSB Pelita Gowa', '2027-02-13 01:00:00+00', 'Lap. A'),
  ('b2000000-0000-4000-8000-000000000002', 'Makassar Youth Cup 2027', 'U12', 'SSB Hasanuddin', 'SSB Karebosi', '2027-02-13 05:00:00+00', 'Lap. B');

INSERT INTO public.match_roster (match_id, player_id, team, shirt_number) VALUES
  ('b2000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001', 'SSB Garuda Muda', 8),
  ('b2000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000002', 'SSB Garuda Muda', 10),
  ('b2000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000003', 'SSB Garuda Muda', 4),
  ('b2000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000004', 'SSB Pelita Gowa', 7),
  ('b2000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000005', 'SSB Pelita Gowa', 1),
  ('b2000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000006', 'SSB Hasanuddin', 5),
  ('b2000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000007', 'SSB Karebosi', 9);