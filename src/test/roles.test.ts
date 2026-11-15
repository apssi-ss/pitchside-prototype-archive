import { describe, expect, it } from "vitest";
import { resolveRole } from "@/lib/roles";

describe("role-aware navigation", () => {
  it("keeps the current role on shared pages like Notifikasi and Akun", () => {
    expect(resolveRole("coach", "/notifications")).toBe("coach");
    expect(resolveRole("referee", "/account")).toBe("referee");
  });

  it("switches to the owner role when opening a role-only page", () => {
    expect(resolveRole("coach", "/parent/consent")).toBe("parent");
    expect(resolveRole("parent", "/association/verification")).toBe("association");
  });
});
