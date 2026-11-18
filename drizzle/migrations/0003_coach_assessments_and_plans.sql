ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'coach';

ALTER TABLE public.players ADD COLUMN IF NOT EXISTS birth_year integer;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS position text NOT NULL DEFAULT '';

CREATE SEQUENCE IF NOT EXISTS public.player_football_seq START 1000;

CREATE OR REPLACE FUNCTION public.is_coach(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role::text = 'coach')
$$;
REVOKE EXECUTE ON FUNCTION public.is_coach(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_coach(uuid) TO authenticated, service_role;

CREATE POLICY "Coaches read players" ON public.players
  FOR SELECT TO authenticated USING (public.is_coach(auth.uid()));
CREATE POLICY "Coaches read training sessions" ON public.training_sessions
  FOR SELECT TO authenticated USING (public.is_coach(auth.uid()));
CREATE POLICY "Coaches read training attendance" ON public.training_attendance
  FOR SELECT TO authenticated USING (public.is_coach(auth.uid()));

CREATE OR REPLACE FUNCTION public.register_player(
  _full_name text, _team text, _category text, _birth_year integer, _position text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_name text := btrim(COALESCE(_full_name, ''));
  v_team text := btrim(COALESCE(_team, ''));
  v_cat text := upper(btrim(COALESCE(_category, '')));
  v_pos text := upper(btrim(COALESCE(_position, '')));
  v_fid text;
  v_id uuid;
BEGIN
  IF v_uid IS NULL OR NOT (public.is_coach(v_uid) OR public.has_role(v_uid, 'organizer')) THEN
    RETURN jsonb_build_object('status', 'forbidden');
  END IF;
  IF char_length(v_name) < 2 OR char_length(v_name) > 80
     OR char_length(v_team) < 2 OR char_length(v_team) > 80
     OR v_cat !~ '^U[0-9]{1,2}$'
     OR _birth_year IS NULL OR _birth_year < 2005 OR _birth_year > 2024
     OR char_length(v_pos) > 10 THEN
    RETURN jsonb_build_object('status', 'invalid');
  END IF;
  v_fid := 'IDN-FB-' || _birth_year::text || '-' || lpad(nextval('public.player_football_seq')::text, 6, '0');
  INSERT INTO public.players (football_id, full_name, team, category, birth_year, position)
  VALUES (v_fid, v_name, v_team, v_cat, _birth_year, v_pos)
  RETURNING id INTO v_id;
  RETURN jsonb_build_object('status', 'ok', 'id', v_id, 'football_id', v_fid);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.register_player(text, text, text, integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_player(text, text, text, integer, text) TO authenticated, service_role;

CREATE TABLE public.player_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL,
  period text NOT NULL CHECK (char_length(period) BETWEEN 2 AND 40),
  scores jsonb NOT NULL CHECK (jsonb_typeof(scores) = 'object'),
  average numeric(4,2) NOT NULL CHECK (average BETWEEN 1 AND 10),
  note text NOT NULL DEFAULT '' CHECK (char_length(note) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.player_assessments TO authenticated;
GRANT ALL ON public.player_assessments TO service_role;
ALTER TABLE public.player_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coaches read assessments" ON public.player_assessments
  FOR SELECT TO authenticated USING (public.is_coach(auth.uid()));
CREATE POLICY "Coaches add own assessments" ON public.player_assessments
  FOR INSERT TO authenticated WITH CHECK (public.is_coach(auth.uid()) AND coach_id = auth.uid());
CREATE INDEX player_assessments_player_idx ON public.player_assessments (player_id, created_at DESC);

CREATE TABLE public.development_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES public.player_assessments(id) ON DELETE SET NULL,
  created_by uuid NOT NULL,
  plan jsonb NOT NULL CHECK (jsonb_typeof(plan) = 'object'),
  model text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.development_plans TO authenticated;
GRANT ALL ON public.development_plans TO service_role;
ALTER TABLE public.development_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coaches read development plans" ON public.development_plans
  FOR SELECT TO authenticated USING (public.is_coach(auth.uid()));
CREATE POLICY "Coaches add own development plans" ON public.development_plans
  FOR INSERT TO authenticated WITH CHECK (public.is_coach(auth.uid()) AND created_by = auth.uid());
CREATE INDEX development_plans_player_idx ON public.development_plans (player_id, created_at DESC);