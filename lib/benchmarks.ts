export type Row = {
  library: string;
  time: number;
};

export type Test = {
  name: string;
  input: string;
  bytes?: number;
  rows: Row[];
};

const row = (library: string, time: number): Row => ({ library, time });

const KB_50 = 51200;
const MB_1 = 1048576;

export const TESTS: Test[] = [
  {
    name: "SHA-256",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 102.28),
      row("rbx-cryptography Luau", 135.45),
      row("HashLib", 769.63),
      row("Dekkonot", 775.58),
      row("CryptographyService", 1237.17),
      row("Gamer", 4941.96),
    ],
  },
  {
    name: "SHA-512",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 361.16),
      row("CryptographyService", 1112.36),
      row("HashLib", 1170.36),
      row("Dekkonot", 2185.2),
    ],
  },
  {
    name: "SHA3-512",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 458.33),
      row("HashLib", 2147.64),
      row("CryptographyService", 14625.37),
    ],
  },
  {
    name: "BLAKE2b",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 40.61),
      row("rbx-cryptography Luau", 190.62),
      row("Dekkonot", 711.27),
      row("CryptographyService", 2415.17),
    ],
  },
  {
    name: "BLAKE3",
    input: "50 KB",
    bytes: KB_50,
    rows: [row("rbx-cryptography", 21.15), row("rbx-cryptography Luau", 52.5)],
  },
  {
    name: "HMAC",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography BLAKE3", 33.45),
      row("rbx-cryptography SHA-256", 115.67),
      row("HashLib SHA-256", 787.15),
      row("CryptographyService SHA-256", 1245.67),
      row("Gamer SHA-256", 4974.8),
    ],
  },
  {
    name: "ChaCha20",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 67.83),
      row("Orbit", 143.62),
      row("CryptographyService", 586.1),
      row("MrRoblick", 610.56),
      row("EncryptedNet", 10227.42),
    ],
  },
  {
    name: "Poly1305",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 27.18),
      row("Orbit", 98.71),
      row("CryptographyService", 1858.23),
    ],
  },
  {
    name: "AES-256-GCM",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 341.4),
      row("RobloxGamerPro200007 (CTR, no authentication)", 9945.7),
    ],
  },
  {
    name: "XOR",
    input: "1 MB",
    bytes: MB_1,
    rows: [row("rbx-cryptography", 405.25), row("Gamer", 13026.56)],
  },
  {
    name: "Base64 encode and decode",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 67.12),
      row("Reselim", 129.12),
      row("Lute", 238.74),
      row("Gamer", 2776.8),
      row("HashLib", 4181.26),
    ],
  },
];
