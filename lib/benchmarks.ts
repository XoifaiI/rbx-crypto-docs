export type Row = {
  library: string;
  time: number;
};

export type Test = {
  name: string;
  input?: string;
  bytes?: number;
  note?: string;
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
      row("rbx-cryptography", 88.83),
      row("rbx-cryptography Luau", 120.52),
      row("HashLib", 768.86),
      row("Gamer", 1036.04),
      row("CryptographyService", 1209.67),
      row("Dekkonot", 768.69),
    ],
  },
  {
    name: "SHA-512",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 281.5),
      row("HashLib", 1163.18),
      row("CryptographyService", 1055.19),
      row("Dekkonot", 2207.7),
    ],
  },
  {
    name: "SHA3-512",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 271.26),
      row("HashLib", 2136.58),
      row("CryptographyService", 14792.71),
    ],
  },
  {
    name: "BLAKE2b",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 36.36),
      row("rbx-cryptography Luau", 156.63),
      row("CryptographyService", 2407.0),
      row("Dekkonot", 709.26),
    ],
  },
  {
    name: "BLAKE3",
    input: "50 KB",
    bytes: KB_50,
    rows: [row("rbx-cryptography", 19.04), row("rbx-cryptography Luau", 39.39)],
  },
  {
    name: "HMAC",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography BLAKE3", 29.84),
      row("rbx-cryptography Luau BLAKE3", 56.46),
      row("rbx-cryptography SHA-256", 99.42),
      row("rbx-cryptography Luau SHA-256", 117.73),
      row("HashLib SHA-256", 783.48),
      row("CryptographyService SHA-256", 1218.5),
      row("Gamer SHA-256", 1062.3),
    ],
  },
  {
    name: "KMAC",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography KMAC-128", 120.03),
      row("rbx-cryptography KMAC-256", 143.7),
    ],
  },
  {
    name: "ChaCha20",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 61.66),
      row("Orbit", 144.28),
      row("CryptographyService", 587.83),
      row("MrRoblick", 621.34),
      row("EncryptedNet", 9835.94),
    ],
  },
  {
    name: "Poly1305",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 21.74),
      row("Orbit", 98.63),
      row("CryptographyService", 1840.95),
    ],
  },
  {
    name: "AES-256-GCM",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 281.39),
      row("RobloxGamerPro200007 (CTR, no authentication)", 940.36),
    ],
  },
  {
    name: "XOR",
    input: "1 MB",
    bytes: MB_1,
    rows: [row("rbx-cryptography", 331.04), row("Gamer", 13577.55)],
  },
  {
    name: "Base64 encode and decode",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 62.61),
      row("rbx-cryptography Luau", 21.21),
      row("Reselim", 132.6),
      row("Lute", 240.09),
      row("Gamer", 1731.53),
      row("HashLib", 4178.93),
    ],
  },
  {
    name: "Ed25519",
    input: "64 byte message",
    rows: [
      row("rbx-cryptography public key", 23.6),
      row("rbx-cryptography sign", 36.42),
      row("rbx-cryptography verify", 130.64),
    ],
  },
  {
    name: "X25519 exchange",
    rows: [row("rbx-cryptography", 92.63), row("Orbit", 271.0)],
  },
  {
    name: "ML-KEM key generation",
    rows: [
      row("rbx-cryptography ML-KEM-512", 19.85),
      row("rbx-cryptography ML-KEM-1024", 36.99),
      row("techs-sus ML-KEM-1024", 23300.0),
    ],
  },
  {
    name: "ML-KEM encapsulate",
    rows: [
      row("rbx-cryptography ML-KEM-512", 23.49),
      row("rbx-cryptography ML-KEM-1024", 41.76),
      row("techs-sus ML-KEM-1024", 25847.4),
    ],
  },
  {
    name: "ML-KEM decapsulate",
    rows: [
      row("rbx-cryptography ML-KEM-512", 35.88),
      row("rbx-cryptography ML-KEM-1024", 66.36),
      row("techs-sus ML-KEM-1024", 29278.7),
    ],
  },
  {
    name: "ML-DSA key generation",
    rows: [
      row("rbx-cryptography ML-DSA-44", 55.29),
      row("rbx-cryptography ML-DSA-87", 120.9),
      row("techs-sus ML-DSA-87", 132910.83),
    ],
  },
  {
    name: "ML-DSA sign",
    input: "64 byte message",
    note: "Signing retries a varying number of times, so every row signs a message that needs one attempt.",
    rows: [
      row("rbx-cryptography ML-DSA-44", 74.21),
      row("rbx-cryptography ML-DSA-87", 154.82),
      row("techs-sus ML-DSA-87", 193987.45),
    ],
  },
  {
    name: "ML-DSA verify",
    input: "64 byte message",
    rows: [
      row("rbx-cryptography ML-DSA-44", 32.76),
      row("rbx-cryptography ML-DSA-87", 62.84),
      row("techs-sus ML-DSA-87", 137882.81),
    ],
  },
];
