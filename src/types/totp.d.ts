interface Totp {
  use_aes: boolean;
  aes_key?: string;
  config: Array<TotpItem>;
}

interface TotpItem {
  secret: string;
  name: string;
  issuer_name: string;
}
