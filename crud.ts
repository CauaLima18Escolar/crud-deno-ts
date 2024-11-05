interface STUDENT {
  name: string;
  age: number;
  course: string;
}

const STUDENT = new Map<string, STUDENT>();
const FILE_PATH = "./db.json";

async function readData() {
  const DATA = await Deno.readTextFile(FILE_PATH);
  return DATA ? JSON.parse(DATA) : null;
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

// Mostrar estudantes no JSON
async function readST() {
  const DATA = await readData()

  if (DATA) {
    const MATRICULAS = Object.keys(DATA)
    MATRICULAS.forEach(MATRICULA => console.log(MATRICULA))
    return
  }

  return console.log('Não há estudantes cadastrados.')
  
}

// Atualizar um estudante no JSON
async function updateST(mat:string) {
  const DATA = await readData()
  const ST_DATA = DATA[mat]
  const OPTIONS = `

  [1] Para mudar o nome do estudante
  [2] Para mudar a idade do estudante
  [3] Para mudar o curso do estudante

  `
  if (ST_DATA) {
    console.log(ST_DATA, OPTIONS)
    const OPTION:number = parseInt(prompt('INSIRA UMA OPÇÃO >>> ') || '0')

    switch(OPTION) {
      case 1:
        const NEW_NAME:string = prompt('INFORME O NOVO NOME >>> ') || `${ST_DATA.name}`
        ST_DATA.name = NEW_NAME
        await writeFile(ST_DATA)
        break
        
      default:
        console.log('ESSA OPÇÃO NÃO EXISTE.')
        break
    }
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
    console.log("Erro: Esse comando não existe no CRUD");
    return;
  }

  switch(args[0]) {
    case 'createST':
      if (args.length !== 5) {
        console.log("Erro: Esse comando precisa de 4 argumentos.");
        return;
      } 

      mat = args[1];
      stName = args[2];
      stAge = parseInt(args[3]);
      stCourse = args[4];
    
      createST(mat, stName, stAge, stCourse);
      break
    case 'readST':
      readST();
      break
    case 'updateST':
      if (args.length !== 2) {
        console.log("Erro. Esse comando precisa de um argumento.");
        return;
      } 

      mat = args[1];

      updateST(mat)
      break
  }
}

main();