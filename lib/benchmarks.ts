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
      row("rbx-cryptography", 84.78),
      row("rbx-cryptography Luau", 116.42),
      row("HashLib", 766.25),
      row("Gamer", 1033.4),
      row("CryptographyService", 1210.26),
      row("Dekkonot", 765.32),
    ],
  },
  {
    name: "SHA-512",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 254.65),
      row("HashLib", 1164.65),
      row("CryptographyService", 1046.97),
      row("Dekkonot", 2160.25),
    ],
  },
  {
    name: "SHA3-512",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 254.06),
      row("HashLib", 2121.24),
      row("CryptographyService", 14668.62),
    ],
  },
  {
    name: "BLAKE2b",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 33.65),
      row("rbx-cryptography Luau", 152.8),
      row("CryptographyService", 2347.9),
      row("Dekkonot", 707.24),
    ],
  },
  {
    name: "BLAKE3",
    input: "50 KB",
    bytes: KB_50,
    rows: [row("rbx-cryptography", 18.41), row("rbx-cryptography Luau", 41.63)],
  },
  {
    name: "HMAC",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography BLAKE3", 29.07),
      row("rbx-cryptography Luau BLAKE3", 55.8),
      row("rbx-cryptography SHA-256", 91.57),
      row("rbx-cryptography Luau SHA-256", 128.57),
      row("HashLib SHA-256", 781.18),
      row("CryptographyService SHA-256", 1215.81),
      row("Gamer SHA-256", 1056.95),
    ],
  },
  {
    name: "KMAC",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography KMAC-128", 123.68),
      row("rbx-cryptography KMAC-256", 140.78),
    ],
  },
  {
    name: "ChaCha20",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 56.17),
      row("Orbit", 141.7),
      row("CryptographyService", 587.4),
      row("MrRoblick", 602.49),
      row("EncryptedNet", 9806.69),
    ],
  },
  {
    name: "Poly1305",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 22.44),
      row("Orbit", 98.61),
      row("CryptographyService", 1825.34),
    ],
  },
  {
    name: "AES-256-GCM",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 293.66),
      row("RobloxGamerPro200007 (CTR, no authentication)", 912.09),
    ],
  },
  {
    name: "XOR",
    input: "1 MB",
    bytes: MB_1,
    rows: [row("rbx-cryptography", 344.94), row("Gamer", 13103.1)],
  },
  {
    name: "Base64 encode and decode",
    input: "50 KB",
    bytes: KB_50,
    rows: [
      row("rbx-cryptography", 27.19),
      row("Reselim", 129.73),
      row("Lute", 237.52),
      row("Gamer", 1707.13),
      row("HashLib", 4116.71),
    ],
  },
  {
    name: "Ed25519",
    input: "64 byte message",
    rows: [
      row("rbx-cryptography public key", 23.27),
      row("rbx-cryptography sign", 33.99),
      row("rbx-cryptography verify", 109.98),
    ],
  },
  {
    name: "X25519 exchange",
    rows: [row("rbx-cryptography", 91.12), row("Orbit", 268.8)],
  },
  {
    name: "ML-KEM key generation",
    rows: [
      row("rbx-cryptography ML-KEM-512", 14.13),
      row("rbx-cryptography ML-KEM-1024", 24.48),
      row("techs-sus ML-KEM-1024", 23135.31),
    ],
  },
  {
    name: "ML-KEM encapsulate",
    rows: [
      row("rbx-cryptography ML-KEM-512", 12.29),
      row("rbx-cryptography ML-KEM-1024", 19.3),
      row("techs-sus ML-KEM-1024", 25558.18),
    ],
  },
  {
    name: "ML-KEM decapsulate",
    rows: [
      row("rbx-cryptography ML-KEM-512", 18.32),
      row("rbx-cryptography ML-KEM-1024", 31.9),
      row("techs-sus ML-KEM-1024", 28876.15),
    ],
  },
  {
    name: "ML-DSA key generation",
    rows: [
      row("rbx-cryptography ML-DSA-44", 42.04),
      row("rbx-cryptography ML-DSA-87", 87.25),
      row("techs-sus ML-DSA-87", 130538.7),
    ],
  },
  {
    name: "ML-DSA sign",
    input: "64 byte message",
    note: "Signing retries a varying number of times, so every row signs a message that needs one attempt.",
    rows: [
      row("rbx-cryptography ML-DSA-44", 47.36),
      row("rbx-cryptography ML-DSA-87", 89.2),
      row("techs-sus ML-DSA-87", 191468.8),
    ],
  },
  {
    name: "ML-DSA verify",
    input: "64 byte message",
    rows: [
      row("rbx-cryptography ML-DSA-44", 20.66),
      row("rbx-cryptography ML-DSA-87", 36.28),
      row("techs-sus ML-DSA-87", 136208.91),
    ],
  },
];
