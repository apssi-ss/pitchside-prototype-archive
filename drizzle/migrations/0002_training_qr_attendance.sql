CREATE TABLE public.training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team text NOT NULL,
  title text NOT NULL,
  starts_at timestamptz NOT NULL,
  venue text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.training_sessions TO authenticated;
GRANT ALL ON public.training_sessions TO service_role;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Organizers read training sessions" ON public.training_sessions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'organizer'));

CREATE TABLE public.training_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.training_sessions(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  method text NOT NULL DEFAULT 'qr' CHECK (method IN ('qr','manual')),
  recorded_by uuid NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, player_id)
);
GRANT SELECT ON public.training_attendance TO authenticated;
GRANT ALL ON public.training_attendance TO service_role;
ALTER TABLE public.training_attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Organizers read training attendance" ON public.training_attendance
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'organizer'));
CREATE INDEX training_attendance_session_idx ON public.training_attendance (session_id);

CREATE OR REPLACE FUNCTION public.record_training_attendance(_session_id uuid, _code text, _method text DEFAULT 'qr')
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_raw text := btrim(COALESCE(_code, ''));
  v_player public.players%ROWTYPE;
  v_team text;
  v_at timestamptz;
BEGIN
  IF v_uid IS NULL OR NOT public.has_role(v_uid, 'organizer') THEN
    RETURN jsonb_build_object('status','forbidden');
  END IF;
  IF _method NOT IN ('qr','manual') THEN RETURN jsonb_build_object('status','invalid_method'); END IF;
  SELECT team INTO v_team FROM public.training_sessions WHERE id = _session_id;
  IF v_team IS NULL THEN RETURN jsonb_build_object('status','no_match'); END IF;
  IF upper(v_raw) LIKE 'BOLAID:P:%' THEN
    SELECT * INTO v_player FROM public.players WHERE passport_token = lower(substr(v_raw, 10));
  ELSIF _method = 'manual' THEN
    SELECT * INTO v_player FROM public.players WHERE upper(football_id) = upper(v_raw);
  END IF;
  IF v_player.id IS NULL THEN RETURN jsonb_build_object('status','unknown'); END IF;
  IF v_player.team <> v_team THEN
    RETURN jsonb_build_object('status','not_in_roster','player_name',v_player.full_name,'football_id',v_player.football_id,'team',v_player.team);
  END IF;
  INSERT INTO public.training_attendance (session_id, player_id, method, recorded_by)
  VALUES (_session_id, v_player.id, _method, v_uid)
  ON CONFLICT (session_id, player_id) DO NOTHING
  RETURNING recorded_at INTO v_at;
  IF v_at IS NULL THEN
    SELECT recorded_at INTO v_at FROM public.training_attendance WHERE session_id=_session_id AND player_id=v_player.id;
    RETURN jsonb_build_object('status','duplicate','player_name',v_player.full_name,'football_id',v_player.football_id,'team',v_team,'checked_in_at',v_at);
  END IF;
  RETURN jsonb_build_object('status','ok','player_name',v_player.full_name,'football_id',v_player.football_id,'team',v_team,'checked_in_at',v_at);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.record_training_attendance(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_training_attendance(uuid, text, text) TO authenticated, service_role;

INSERT INTO public.training_sessions (id, team, title, starts_at, venue) VALUES
  ('c3000000-0000-4000-8000-000000000001','SSB Garuda Muda','U10 · Passing & kontrol bola','2027-02-10 09:00:00+00','Lap. Latihan Garuda'),
  ('c3000000-0000-4000-8000-000000000002','SSB Pelita Gowa','U10 · Small-sided game','2027-02-10 09:30:00+00','Lap. Pelita');