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

async function writeFile(ST_DATA:object, isDeleting?:boolean) {
    const CURRENT_DATA = await readData()

    if (CURRENT_DATA && !isDeleting) {
      const DATA = Object.assign({}, CURRENT_DATA, ST_DATA)
      await Deno.writeTextFile(FILE_PATH, JSON.stringify(DATA, null, 2));
      return

    } 
    
    if (isDeleting) {
      await Deno.writeTextFile(FILE_PATH, JSON.stringify(ST_DATA, null, 2));
      return
    }

    await Deno.writeTextFile(FILE_PATH, JSON.stringify(ST_DATA, null, 2));
    return
}

// Adicionar um estudante ao JSON
async function createST(MAT:string, stName:string, stAge:number, stCourse:string) {
  STUDENT.set(MAT, { name: stName, age: stAge, course: stCourse})
  const ST_DATA = Object.fromEntries(STUDENT)
  await writeFile(ST_DATA)
  console.log('Estudante adicionado')
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
async function updateST(MAT:string) {
  const DATA = await readData()
  const ST_DATA = DATA[MAT]
  const OPTIONS = `

  [1] Para mudar a matrícula do estudante
  [2] Para mudar o nome do estudante
  [3] Para mudar a idade do estudante
  [4] Para mudar o curso do estudante

  `
  if (ST_DATA) {
    console.log(ST_DATA, OPTIONS)
    const OPTION:number = parseInt(prompt('INSIRA UMA OPÇÃO >>> ') || '0')

    let NEW_ST_DATA:object

    switch(OPTION) {
      case 1:
        const NEW_MAT:string = prompt('INFORME A NOVA MATRÍCULA >>> ') || `${MAT}`
        NEW_ST_DATA = { [NEW_MAT]: ST_DATA }
        await deleteST(MAT)
        await writeFile(NEW_ST_DATA)
        break
      case 2:
        const NEW_NAME:string = prompt('INFORME O NOVO NOME >>> ') || `${ST_DATA.name}`
        ST_DATA.name = NEW_NAME
        NEW_ST_DATA = { [MAT]: ST_DATA }
        await writeFile(NEW_ST_DATA)
        break

      case 3:
        const NEW_AGE:number = parseInt(prompt('INFORME A NOVA IDADE >>> ') || `${ST_DATA.age}`)
        ST_DATA.age = NEW_AGE
        NEW_ST_DATA = { [MAT]: ST_DATA }
        await writeFile(NEW_ST_DATA)
        break

      case 4:
        const NEW_COURSE:string = prompt('INFORME A NOVA IDADE >>> ') || `${ST_DATA.course}`
        ST_DATA.course = NEW_COURSE
        NEW_ST_DATA = { [MAT]: ST_DATA }
        await writeFile(NEW_ST_DATA)
        break
        
      default:
        console.log('Erro: Essa opção não existe.')
        break
    }

    return
  }

  return console.log('Estudante não encontrado')
}

async function deleteST(MAT:string) {
  const DATA = await readData()

  if (DATA[MAT]) {
    delete DATA[MAT]
    await writeFile(DATA, true)
    return console.log('Estudante deletado.')
  }

  return console.log('Não há estudante com essa matrícula.')
}

function main() {
  const args = Deno.args;

  let mat:string
  let stName:string
  let stAge:number
  let stCourse:string

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
    case 'deleteST':
      if (args.length !== 2) {
        console.log("Erro. Esse comando precisa de um argumento.");
        return;
      }

      mat = args[1];

      deleteST(mat)
      break
    default:
      console.log("Erro: Esse comando não existe no CRUD");
      break
  }
}

main();