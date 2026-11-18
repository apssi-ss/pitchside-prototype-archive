import { describe, expect, it } from "vitest";
import { checkinMessage, parsePassportCode, passportQrPayload } from "@/lib/passport";
import { player } from "@/lib/mock-data";

describe("Football Passport QR", () => {
  it("encodes only the random passport token, not player details", () => {
    const payload = passportQrPayload(player.passportToken);
    expect(payload).toBe(`BOLAID:P:${player.passportToken}`);
    expect(payload).not.toContain(player.name);
    expect(payload).not.toContain(player.footballId);
  });

  it("accepts a scanned passport QR", () => {
    expect(parsePassportCode("BOLAID:P:7f3c9a2e51d84b06c1e2a9d4", "qr")).toEqual({
      kind: "passport",
      token: "7f3c9a2e51d84b06c1e2a9d4",
    });
  });

  it("rejects a QR that is not a passport, even if it looks like a Football ID", () => {
    expect(parsePassportCode("https://example.com", "qr").kind).toBe("invalid");
    expect(parsePassportCode("IDN-FB-2016-000123", "qr").kind).toBe("invalid");
  });

  it("allows a typed Football ID only for manual entry", () => {
    expect(parsePassportCode("idn-fb-2016-000123", "manual")).toEqual({
      kind: "football_id",
      footballId: "IDN-FB-2016-000123",
    });
  });

  it("reports duplicates and wrong-roster players as not checked in", () => {
    expect(checkinMessage({ status: "duplicate", checked_in_at: "2027-02-13T01:00:00Z" }).tone).toBe("warning");
    expect(checkinMessage({ status: "not_in_roster" }).tone).toBe("danger");
    expect(checkinMessage({ status: "ok" }).tone).toBe("success");
  });

  it("uses training language for rejected training attendance", () => {
    const rejected = checkinMessage(
      {
        status: "not_in_roster",
        player_name: "Rizky Pratama",
        football_id: "IDN-FB-2016-000123",
        team: "U10",
      },
      "training",
    );
    expect(rejected.title).toBe("Tidak terdaftar di sesi latihan ini");
    expect(rejected.detail).toBe(
      "Rizky Pratama · IDN-FB-2016-000123 (U10) tidak terdaftar pada sesi latihan ini.",
    );

    const missingSession = checkinMessage({ status: "no_match" }, "training");
    expect(missingSession.title).toBe("Sesi latihan tidak ditemukan");
    expect(missingSession.detail).toBe("Pilih ulang sesi latihan.");
  });
});
