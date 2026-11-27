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
      row("rbx-cryptography", 75.95),
      row("EncodingService", 101.97),
      row("HashLib", 771.27),
      row("Gamer", 1043.95),
      row("CryptographyService", 1210.64),
      row("Dekkonot", 767.37),
    ],
  },
  {
    name: "SHA-512",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 273.85),
      row("HashLib", 1166.03),
      row("CryptographyService", 1053.2),
      row("Dekkonot", 2144.74),
    ],
  },
  {
    name: "SHA3-512",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 267.65),
      row("HashLib", 2137.03),
      row("CryptographyService", 14525.1),
    ],
  },
  {
    name: "BLAKE2b",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 165.62),
      row("EncodingService", 40.62),
      row("CryptographyService", 2371.05),
      row("Dekkonot", 705.89),
    ],
  },
  {
    name: "BLAKE3",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 47.09),
      row("EncodingService", 21.01),
    ],
  },
  {
    name: "HMAC",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography BLAKE3", 63.83),
      row("rbx-cryptography SHA-256", 76.64),
      row("HashLib SHA-256", 788.45),
      row("CryptographyService SHA-256", 1216.28),
      row("Gamer SHA-256", 1072.94),
    ],
  },
  {
    name: "KMAC",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography KMAC-128", 130.08),
      row("rbx-cryptography KMAC-256", 155.89),
    ],
  },
  {
    name: "ChaCha20",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 64.08),
      row("Orbit", 145.95),
      row("CryptographyService", 591.14),
      row("MrRoblick", 623.85),
      row("EncryptedNet", 9989.24),
    ],
  },
  {
    name: "Poly1305",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 21.35),
      row("Orbit", 98.62),
      row("CryptographyService", 1830.48),
    ],
  },
  {
    name: "AES-256-GCM",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 291.03),
      row("RobloxGamerPro200007 (CTR, no authentication)", 928.06),
    ],
  },
  {
    name: "XOR",
    input: "1 MB",
    bytes: MB_1,
    rows: [
      row("rbx-cryptography", 434.07),
      row("Gamer", 14067.19),
    ],
  },
  {
    name: "Base64 encode and decode",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 68.57),
      row("EncodingService", 76.53),
      row("Reselim", 134.77),
      row("Lute", 242.68),
      row("Gamer", 1736.95),
      row("HashLib", 4344.71),
    ],
  },
  {
    name: "Ed25519",
    input: "64 byte message",
    rows: [
      row("rbx-cryptography public key", 23.52),
      row("rbx-cryptography sign", 27.81),
      row("rbx-cryptography verify", 89.9),
    ],
  },
  {
    name: "X25519 exchange",
    rows: [
      row("rbx-cryptography", 104.19),
      row("Orbit", 269.95),
    ],
  },
  {
    name: "ML-KEM key generation",
    rows: [
      row("rbx-cryptography ML-KEM-512", 14.16),
      row("rbx-cryptography ML-KEM-1024", 24.22),
      row("techs-sus ML-KEM-1024", 23135.31),
    ],
  },
  {
    name: "ML-KEM encapsulate",
    rows: [
      row("rbx-cryptography ML-KEM-512", 10.87),
      row("rbx-cryptography ML-KEM-1024", 19.21),
      row("techs-sus ML-KEM-1024", 25558.18),
    ],
  },
  {
    name: "ML-KEM decapsulate",
    rows: [
      row("rbx-cryptography ML-KEM-512", 17.49),
      row("rbx-cryptography ML-KEM-1024", 29.24),
      row("techs-sus ML-KEM-1024", 28876.15),
    ],
  },
  {
    name: "ML-DSA key generation",
    rows: [
      row("rbx-cryptography ML-DSA-44", 31.87),
      row("rbx-cryptography ML-DSA-87", 62.93),
      row("techs-sus ML-DSA-87", 130538.7),
    ],
  },
  {
    name: "ML-DSA sign",
    input: "64 byte message",
    note: "Signing retries a varying number of times, so every row signs a message that needs one attempt.",
    rows: [
      row("rbx-cryptography ML-DSA-44", 55.36),
      row("rbx-cryptography ML-DSA-87", 97.09),
      row("techs-sus ML-DSA-87", 191468.8),
    ],
  },
  {
    name: "ML-DSA verify",
    input: "64 byte message",
    rows: [
      row("rbx-cryptography ML-DSA-44", 25.04),
      row("rbx-cryptography ML-DSA-87", 43.8),
      row("techs-sus ML-DSA-87", 136208.91),
    ],
  },
];
