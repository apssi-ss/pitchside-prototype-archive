import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Btn, PageHeader, Panel, Segmented } from "@/components/kit";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

function safeRedirect(value: unknown) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/account";
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search['redirect'] === "string" ? search['redirect'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Masuk · BolaID" },
      { name: "description", content: "Masuk ke akun BolaID untuk panitia, pelatih, dan orang tua." },
      { property: "og:title", content: "Masuk · BolaID" },
      { property: "og:description", content: "Masuk atau daftar akun BolaID." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const REDIRECT_KEY = "bolaid.after-auth";

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const target = safeRedirect(search.redirect);
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const go = (to: string) => navigate({ to: safeRedirect(to) as "/account", replace: true });
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const stored = window.sessionStorage.getItem(REDIRECT_KEY);
        window.sessionStorage.removeItem(REDIRECT_KEY);
        go(stored ?? target);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        const stored = window.sessionStorage.getItem(REDIRECT_KEY);
        window.sessionStorage.removeItem(REDIRECT_KEY);
        go(stored ?? target);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, target]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Cek email Anda", { description: "Klik tautan konfirmasi untuk mengaktifkan akun." });
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal masuk");
    } finally {
      setBusy(false);
    }
  }

  async function oauth(provider: "google" | "lovable") {
    window.sessionStorage.setItem(REDIRECT_KEY, target);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) toast.error("Gagal masuk", { description: String(result.error.message ?? result.error) });
  }

  return (
    <div className="mx-auto max-w-md">
      <PageHeader eyebrow="Akun BolaID" title={mode === "in" ? "Masuk" : "Daftar akun"} />
      <Panel>
        <div className="grid gap-2">
          <Btn variant="outline" onClick={() => oauth("google")} type="button">
            Lanjut dengan Google
          </Btn>
          <Btn variant="outline" onClick={() => oauth("lovable")} type="button">
            Lanjut dengan Lovable
          </Btn>
        </div>
        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> atau email <span className="h-px flex-1 bg-border" />
        </div>
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "in", label: "Masuk" },
            { value: "up", label: "Daftar" },
          ]}
        />
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <label className="grid gap-1 text-sm font-semibold">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl border bg-background px-3 font-normal"
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Kata sandi
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === "in" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl border bg-background px-3 font-normal"
            />
          </label>
          <Btn type="submit" disabled={busy} size="lg">
            {busy ? "Memproses…" : mode === "in" ? "Masuk" : "Daftar"}
          </Btn>
        </form>
      </Panel>
    </div>
  );
}
