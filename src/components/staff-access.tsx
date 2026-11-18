import { useQuery } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react";
import { PageHeader, Panel } from "@/components/kit";
import { supabase } from "@/integrations/supabase/client";

export function useMyRoles(userId: string) {
  return useQuery({
    queryKey: ["my-roles", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      if (error) throw error;
      return data.map((r) => r.role as string);
    },
  });
}

export function AccessPending({ eyebrow, email, roleLabel }: { eyebrow: string; email?: string | undefined; roleLabel: string }) {
  return (
    <div className="mx-auto max-w-lg">
      <PageHeader eyebrow={eyebrow} title="Akses belum aktif" />
      <Panel>
        <div className="flex gap-3 text-sm">
          <ShieldAlert className="h-6 w-6 shrink-0 text-warning" />
          <p>
            Akun <span className="font-semibold">{email}</span> belum ditetapkan sebagai {roleLabel}. Kirim email
            ini ke pengelola BolaID untuk diaktifkan.
          </p>
        </div>
      </Panel>
    </div>
  );
}
