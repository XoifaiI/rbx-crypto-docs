export type Row = {
  library: string;
  time: number;
};

export type Test = {
  name: string;
  input: string;
  rows: Row[];
};

const row = (library: string, time: number): Row => ({ library, time });

export const TESTS: Test[] = [
  {
    name: "SHA-256",
    input: "50 KB",
    rows: [
      row("rbx-cryptography", 121),
      row("rbx-cryptography Luau", 128),
      row("Dekkonot", 916),
      row("HashLib", 933),
    ],
  },
  {
    name: "SHA-512",
    input: "50 KB",
    rows: [
      row("rbx-cryptography", 453),
      row("HashLib", 1394),
      row("Dekkonot", 2323),
    ],
  },
  {
    name: "SHA3-512",
    input: "50 KB",
    rows: [row("rbx-cryptography", 554), row("HashLib", 3457)],
  },
  {
    name: "BLAKE2b, 32 byte digest",
    input: "50 KB",
    rows: [
      row("rbx-cryptography", 53),
      row("rbx-cryptography Luau", 283),
      row("Dekkonot", 883),
    ],
  },
  {
    name: "BLAKE3",
    input: "50 KB",
    rows: [row("rbx-cryptography", 8), row("rbx-cryptography Luau", 75)],
  },
  {
    name: "HMAC",
    input: "50 KB",
    rows: [
      row("rbx-cryptography BLAKE3", 26),
      row("rbx-cryptography SHA-256", 142),
      row("HashLib SHA-256", 947),
    ],
  },
  {
    name: "ChaCha20",
    input: "50 KB",
    rows: [
      row("rbx-cryptography", 76),
      row("MrRoblick", 696),
      row("EncryptedNet", 12011),
    ],
  },
  {
    name: "AES",
    input: "50 KB",
    rows: [row("rbx-cryptography", 365), row("RobloxGamerPro200007", 926)],
  },
  {
    name: "Base64 encode and decode",
    input: "50 KB",
    rows: [row("rbx-cryptography", 128), row("Reselim", 182), row("Lute", 297)],
  },
];
