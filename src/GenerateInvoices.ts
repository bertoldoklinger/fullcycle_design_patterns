import pgp from 'pg-promise'





export default class GenerateInvoices {


  async execute() {
    const connection = pgp()("postgres://postgres:postgres@localhost:5432/branas")

    const contracts = await connection.query("select * from branas.contract", [])
    console.log(contracts)

    return []
  }
}