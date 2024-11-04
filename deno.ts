import { ensureFile } from "https://deno.land/std@0.203.0/fs/mod.ts";

const student = {
    20231144010023: {
        nome: 'Olívia',
        idade: 19,
        curso: 'Informática'
    }
}

const FILE_PATH = "./db.json";

async function ensureDataFile() {
  await ensureFile(FILE_PATH);
}

async function readData() {
  await ensureDataFile();
  const data = await Deno.readTextFile(FILE_PATH);
  return data ? JSON.parse(data) : null;
}

async function writeFile() {
    const PATH = await readData()

    if (PATH) {
        const DATA = Object.assign({}, PATH, student)
        await Deno.writeTextFile(FILE_PATH, JSON.stringify(DATA, null, 2));
        return
    }

    await Deno.writeTextFile(FILE_PATH, JSON.stringify(student, null, 2));
}

writeFile()