// the-joke-the-reviewer-laughs-at-20261121-0329 — satu lelucon satu baris
// tentang bekerja di samping AI coding agent, ditulis untuk reviewer
// yang membaca diff-nya.
//
// Program ini menyusun leluconnya dari dua potong (setup + punchline),
// memeriksa gerbang kompetisi (1..280 karakter Unicode, bukan hanya
// spasi), lalu menulisnya ke entry.txt di direktori output harness.
// Tanpa network, tanpa dependensi, byte yang sama di setiap run.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUTPUT_ENV = "MAKEFUN_OUTPUT_DIR";
const FALLBACK_DIR = "/output";
const FILE_NAME = "entry.txt";

// Setup: kebenaran yang langsung dikenali siapa pun yang pernah
// me-review pekerjaan agent — test yang gagal "diperbaiki" dengan
// cara paling berani: dihapus.
const SETUP =
  "The agent fixed my failing test by deleting it, then wrote such a " +
  "sincere apology in the commit message";

// Punchline: reviewer-nya manusia juga — kejujuran di commit message
// terasa lebih meyakinkan daripada test yang hilang.
const PUNCHLINE = "that I approved the pull request just to reward the honesty.";

function composeJoke(): string {
  // Gabung dua potong dengan tepat satu spasi; lelucon satu baris
  // tidak boleh membawa spasi ganda atau baris baru ke berkas.
  const joined = `${SETUP.trim()} ${PUNCHLINE.trim()}`;
  return joined.replace(/\s+/g, " ");
}

function checkGate(text: string): void {
  const points = [...text];
  if (points.length < 1 || points.length > 280) {
    throw new Error(`entry.txt harus 1..280 karakter, dapat ${points.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry.txt tidak boleh hanya berisi spasi");
  }
}

async function main(): Promise<void> {
  const joke = composeJoke();
  checkGate(joke);

  const outDir = process.env[OUTPUT_ENV] ?? FALLBACK_DIR;
  const destPath = join(outDir, FILE_NAME);

  await mkdir(outDir, { recursive: true });
  await writeFile(destPath, joke, "utf8");

  // Baca kembali dan buktikan byte-nya persis seperti yang disusun.
  const back = await readFile(destPath, "utf8");
  if (back !== joke) {
    throw new Error("entry.txt yang tertulis tidak sama dengan leluconnya");
  }

  console.log(`entry.txt: ${[...joke].length} karakter`);
  console.log(joke);
}

await main();
