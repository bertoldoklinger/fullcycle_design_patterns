import ContractDatabaseRepository from "../src/ContractDatabaseRepository"
import ContractRepository from "../src/ContractRepository"
import DatabaseConnection from "../src/DatabaseConnection"
import GenerateInvoices, { Input } from "../src/GenerateInvoices"
import PgPromiseAdapter from "../src/PgPromiseAdapter"

let generateInvoices: GenerateInvoices
let connection: DatabaseConnection
let contractRepository: ContractRepository


beforeEach(() => {
  // const contractRepository: ContractRepository = {
  //   async list(): Promise<any> {
  //     return [
  //       { 
  //         idContract: "",
  //         description: "",
  //         periods: 12,
  //         amount: "6000",
  //         date: new Date('2022-01-01T10:00:00'),
  //         payments: [
  //           { 
  //             idContract: "",
  //             idPayment: "",
  //             amount: 6000,
  //             date: new Date('2022-01-05T10:00:00')
  //           }
  //         ],
  //       }
  //     ]
  //   }
  // }
  connection = new PgPromiseAdapter()
  contractRepository = new ContractDatabaseRepository(connection)
  generateInvoices = new GenerateInvoices(contractRepository)
})
//teste de integração
test('Deve gerar as notas fiscais por regime de caixa', async () => {

  const input: Input = {
    month: 1,
    year: 2022,
    type: "cash"
  }

  const output = await generateInvoices.execute(input)

  expect(output.at(0)?.date).toBe("2022-01-05")
  expect(output.at(0)?.amount).toBe(6000)
  
})


test('Deve gerar as notas fiscais por regime de competência do mês 1', async () => {
  const input:Input = {
    month: 1,
    year: 2022,
    type: "accrual"
  }

  const output = await generateInvoices.execute(input)

  expect(output.at(0)?.date).toBe("2022-01-01")
  expect(output.at(0)?.amount).toBe(500)
})

test('Deve gerar as notas fiscais por regime de competência do mês 2', async () => {
  const input:Input = {
    month: 2,
    year: 2022,
    type: "accrual"
  }

  const output = await generateInvoices.execute(input)

  expect(output.at(0)?.date).toBe("2022-02-01")
  expect(output.at(0)?.amount).toBe(500)
})

test('Deve gerar as notas fiscais por regime de competência por csv', async () => {
  const input:Input = {
    month: 1,
    year: 2022,
    type: "accrual",
    format: "csv"
  }

  const output = await generateInvoices.execute(input)

  expect(output).toBe("2022-01-01;500")
})

afterEach(async () => {
  connection.close()
})