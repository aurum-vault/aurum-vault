import type Keycloak from "keycloak-js";

let _kc: Keycloak | null = null;

export async function getKeycloak(): Promise<Keycloak> {
  if (!_kc) {
    const url      = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
    const realm    = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

    if (!url || !realm || !clientId) {
      throw new Error(
        `Keycloak env vars missing — restart the dev server after editing .env.local.\n` +
        `  NEXT_PUBLIC_KEYCLOAK_URL=${url}\n` +
        `  NEXT_PUBLIC_KEYCLOAK_REALM=${realm}\n` +
        `  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=${clientId}`,
      );
    }

    const { default: Keycloak } = await import("keycloak-js");
    _kc = new Keycloak({ url, realm, clientId });
  }
  return _kc;
}