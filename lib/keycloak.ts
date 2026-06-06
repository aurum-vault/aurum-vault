import type Keycloak from "keycloak-js";

let _kc: Keycloak | null = null;

export async function getKeycloak(): Promise<Keycloak> {
  if (!_kc) {
    const { default: Keycloak } = await import("keycloak-js");
    _kc = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL!,
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM!,
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
    });
  }
  return _kc;
}