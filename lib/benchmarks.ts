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
      row("rbx-cryptography", 102.33),
      row("rbx-cryptography Luau", 135.42),
      row("HashLib", 776.57),
      row("CryptographyService", 1242.67),
      row("Gamer", 4993.41),
    ],
  },
  {
    name: "SHA-512",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 363.42),
      row("CryptographyService", 1123.41),
      row("HashLib", 1173.15),
    ],
  },
  {
    name: "SHA3-512",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 467.69),
      row("HashLib", 2166.42),
      row("CryptographyService", 14867.68),
    ],
  },
  {
    name: "BLAKE2b",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 40.67),
      row("rbx-cryptography Luau", 191.02),
      row("CryptographyService", 2382.58),
    ],
  },
  {
    name: "BLAKE3",
    input: "50 KB",
    bytes: KB_50,
    rows: [row("rbx-cryptography", 21.21), row("rbx-cryptography Luau", 52.49)],
  },
  {
    name: "HMAC",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography BLAKE3", 33.44),
      row("rbx-cryptography SHA-256", 116.24),
      row("HashLib SHA-256", 793.45),
      row("CryptographyService SHA-256", 1249.96),
      row("Gamer SHA-256", 5061.81),
    ],
  },
  {
    name: "ChaCha20",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 69.18),
      row("Orbit", 144.56),
      row("CryptographyService", 585.72),
    ],
  },
  {
    name: "Poly1305",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 27.09),
      row("Orbit", 98.64),
      row("CryptographyService", 1847.85),
    ],
  },
  {
    name: "AES-256-GCM",
    input: "50 KB",
    bytes: KB_50,
    rows: [row("rbx-cryptography", 349.72)],
  },
  {
    name: "XOR",
    input: "1 MB",
    bytes: MB_1,
    rows: [row("rbx-cryptography", 405.9), row("Gamer", 12711.46)],
  },
  {
    name: "Base64 encode and decode",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 68.49),
      row("Gamer", 2817.95),
      row("HashLib", 4271.41),
    ],
  },
];
