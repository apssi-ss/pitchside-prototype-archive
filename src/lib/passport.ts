/** QR payload prefix for Football Passport check-in codes. The QR carries only a random token. */
export const PASSPORT_PREFIX = "BOLAID:P:";

export function passportQrPayload(token: string) {
  return `${PASSPORT_PREFIX}${token}`;
}

export type ParsedCode =
  | { kind: "passport"; token: string }
  | { kind: "football_id"; footballId: string }
  | { kind: "invalid" };

/** Classify a scanned or typed code before sending it to the check-in action. */
export function parsePassportCode(raw: string, method: "qr" | "manual"): ParsedCode {
  const value = raw.trim();
  if (value.toUpperCase().startsWith(PASSPORT_PREFIX)) {
    const token = value.slice(PASSPORT_PREFIX.length).toLowerCase();
    return /^[0-9a-f]{16,64}$/.test(token) ? { kind: "passport", token } : { kind: "invalid" };
  }
  if (method === "manual" && /^IDN-FB-\d{4}-\d{6}$/i.test(value)) {
    return { kind: "football_id", footballId: value.toUpperCase() };
  }
  return { kind: "invalid" };
}

export type CheckinStatus =
  | "ok"
  | "duplicate"
  | "not_in_roster"
  | "unknown"
  | "no_match"
  | "forbidden"
  | "invalid_method";

export type CheckinResult = {
  status: CheckinStatus;
  player_name?: string;
  football_id?: string;
  team?: string;
  checked_in_at?: string;
};

export function checkinMessage(r: CheckinResult, context: "match" | "training" = "match"): {
  tone: "success" | "warning" | "danger";
  title: string;
  detail: string;
} {
  const who = r.player_name ? `${r.player_name} · ${r.football_id ?? ""}`.trim() : "";
  const time = r.checked_in_at
    ? new Date(r.checked_in_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : "";
  switch (r.status) {
    case "ok":
      return { tone: "success", title: "Check-in berhasil", detail: `${who} · ${r.team ?? ""}` };
    case "duplicate":
      return { tone: "warning", title: "Sudah check-in", detail: `${who} tercatat pukul ${time}` };
    case "not_in_roster":
      if (context === "training") {
        return {
          tone: "danger",
          title: "Tidak terdaftar di sesi latihan ini",
          detail: `${who} (${r.team ?? "-"}) tidak terdaftar pada sesi latihan ini.`,
        };
      }
      return {
        tone: "danger",
        title: "Tidak terdaftar di laga ini",
        detail: `${who} (${r.team ?? "-"}) bukan bagian roster pertandingan.`,
      };
    case "unknown":
      return { tone: "danger", title: "Passport tidak dikenal", detail: "Kode tidak cocok dengan pemain mana pun." };
    case "no_match":
      if (context === "training") {
        return { tone: "danger", title: "Sesi latihan tidak ditemukan", detail: "Pilih ulang sesi latihan." };
      }
      return { tone: "danger", title: "Pertandingan tidak ditemukan", detail: "Pilih ulang pertandingan." };
    case "forbidden":
      return { tone: "danger", title: "Tidak ada akses panitia", detail: "Akun ini belum ditetapkan sebagai panitia." };
    default:
      return { tone: "danger", title: "Permintaan tidak valid", detail: "Coba pindai ulang." };
  }
}
