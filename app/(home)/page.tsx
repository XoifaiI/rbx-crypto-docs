import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import Link from "next/link";

const usage = `local Cryptography = require(ReplicatedStorage.Cryptography)

local SHA256 = Cryptography.Hashing.SHA2.SHA256
local AEAD = Cryptography.Encryption.AEAD
local EdDSA = Cryptography.Verification.EdDSA
local CSPRNG = Cryptography.Utilities.CSPRNG

-- hash
local Hex: string, Digest: buffer = SHA256(buffer.fromstring("Hello World"))

-- encrypt, and decrypt
local Key: buffer = CSPRNG.RandomBytes(32)
local Nonce: buffer = CSPRNG.RandomBytes(12)
local Ciphertext: buffer, Tag: buffer = AEAD.Encrypt(buffer.fromstring("secret"), Key, Nonce)
local Plaintext: buffer? = AEAD.Decrypt(Ciphertext, Key, Nonce, Tag)

-- sign, and verify
local SecretKey: buffer = CSPRNG.RandomBytes(32)
local PublicKey: buffer = EdDSA.PublicKey(SecretKey)
local Signature: buffer = EdDSA.Sign(Digest, SecretKey, PublicKey)
print(EdDSA.Verify(Digest, PublicKey, Signature)) -- true`;

const features = [
  {
    title: "As fast as Luau goes",
    body: "Every hot loop is unrolled and tuned against the native code it compiles to. SHA-256 hashes 50 KB in 121 μs, and ChaCha20 encrypts it in 76 μs.",
  },
  {
    title: "Roblox's own hashing when it can",
    body: "SHA-256, SHA-1, MD5, Base64 and 32 byte BLAKE3 and BLAKE2b go through EncodingService, which runs as native code inside Roblox.",
  },
  {
    title: "Authenticated encryption",
    body: "ChaCha20-Poly1305, XChaCha20-Poly1305 and AES-GCM. Decrypt gives you nil when anything was changed, so tampered data never reaches your code.",
  },
  {
    title: "Signatures and key exchange",
    body: "Ed25519 signatures, and X25519 key exchange, so two sides can agree on a key without ever sending it.",
  },
  {
    title: "Post quantum",
    body: "ML-KEM and ML-DSA from FIPS 203 and 204, at every security level, checked against the official test vectors.",
  },
  {
    title: "Only loads what you use",
    body: "Requiring the library takes about 2 ms. Each algorithm loads the first time you touch it, or when you call Preload.",
  },
];

const themes = { light: "github-light", dark: "github-dark" } as const;

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-20">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          rbx-cryptography
        </h1>
        <p className="mt-4 text-lg text-fd-muted-foreground">
          Cryptography for Roblox, as fast as Luau can run it. Hashing,
          encryption, signatures, post quantum key exchange and a secure random
          number generator, all in strictly typed Luau.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/docs"
            className="rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground"
          >
            Read the docs
          </Link>
          <Link
            href="/docs/learn/getting-started"
            className="rounded-lg border px-5 py-2.5 font-medium"
          >
            Get started
          </Link>
        </div>

        <div className="mt-12 grid gap-4">
          <ServerCodeBlock code={usage} lang="luau" themes={themes} />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-fd-card p-5"
            >
              <h2 className="font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-fd-muted-foreground">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
