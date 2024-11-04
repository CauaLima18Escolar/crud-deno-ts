import { ensureFile } from "https://deno.land/std@0.203.0/fs/mod.ts";

interface STUDENT {
  name: string;
  age: number;
  course: string;
}

const STUDENT = new Map<string, STUDENT>();
const FILE_PATH = "./db.json";

async function ensureDataFile() {
  await ensureFile(FILE_PATH);
}

async function readData() {
  await ensureDataFile();
  const data = await Deno.readTextFile(FILE_PATH);
  return data ? JSON.parse(data) : null;
}

async function writeFile(ST_DATA:object) {
    const CURRENT_DATA = await readData()

    if (CURRENT_DATA) {
        const DATA = Object.assign({}, CURRENT_DATA, ST_DATA)
        await Deno.writeTextFile(FILE_PATH, JSON.stringify(DATA, null, 2));

    } else {
      await Deno.writeTextFile(FILE_PATH, JSON.stringify(ST_DATA, null, 2));
    }
    
    console.log('Estudante adicionado')
}

// Adicionar um estudante ao JSON
async function createST(mat:string, stName:string, stAge:number, stCourse:string) {
  STUDENT.set(mat, { name: stName, age: stAge, course: stCourse})
  const ST_DATA = Object.fromEntries(STUDENT)
  await writeFile(ST_DATA)
}

// Buscar por um estudante no JSON
async function readST(mat:string) {
  const DATA = await readData()
  const ST_DATA = DATA[mat]
  
  if (ST_DATA) {
    return console.log(ST_DATA)
  }

  return console.log('Estudante não encontrado')
}

// Atualizar um estudante no JSON
async function updateST(mat:string) {
  const DATA = await readData()
  const ST_DATA = DATA[mat]
  
  if (ST_DATA) {
    return console.log(ST_DATA)
  }

  return console.log('Estudante não encontrado')
}

function main() {
  const args = Deno.args;
  const commands = ['createST', 'readST', 'updateST', 'deleteST']

  let mat:string
  let stName:string
  let stAge:number
  let stCourse:string

  if (!commands.includes(args[0])) {
    console.log("Erro. Esse comando não existe");
    return;
  }

  switch(args[0]) {
    case 'createST':
      if (args.length !== 5) {
        console.log("Erro. Esse comando não existe");
        return;
      } 

      mat = args[1];
      stName = args[2];
      stAge = parseInt(args[3]);
      stCourse = args[4];
    
      createST(mat, stName, stAge, stCourse);
      break
    case 'readST':
      if (args.length !== 2) {
        console.log("Erro. Esse comando não existe");
        return;
      } 
      mat = args[1];
    
      readST(mat);
      break
    case 'updateST':
      if (args.length !== 2) {
        console.log("Erro. Esse comando não existe");
        return;
      } 

      mat = args[1];
    
      updateST(mat)
      break
  }
}

main();