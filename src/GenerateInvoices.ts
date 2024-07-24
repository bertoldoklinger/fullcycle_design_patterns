import moment from 'moment'
import ContractRepository from './ContractRepository'

export type Input = {
  month: number
  year: number
  type: "accrual" | "cash" 
  format?: string
}

/**
 * The type `Output` consists of a `date` property of type string and an `amount`
 * property of type number.
 * @property {string} date - The `date` property in the `Output` type represents a
 * date in string format.
 * @property {number} amount - The `amount` property in the `Output` type
 * represents a numerical value. It is of type `number`, which means it can store
 * numeric data such as integers or floating-point numbers.
 */
// export type Output = {
//   date: string
//   amount: number
// }

export default class GenerateInvoices {
    constructor(private readonly contractRepository: ContractRepository){}

    async execute(input: Input): Promise<any> {
      const output: any[] = []

      const contracts = await this.contractRepository.list()
      for(const contract of contracts) {
        const invoices = contract.generateInvoices(input.month,input.year, input.type)
            for(const invoice of invoices) {
              output.push({
                date: moment(invoice.date).format("YYYY-MM-DD"), amount: invoice.amount
              })
            }
      }
      if (!input.format || input.format === 'json') {
        return output
      }
      if(input.format === "csv") {
        const lines: string[] = []
        for(const invoice of output) {
          const line: string[] = []
          line.push(invoice.date)
          line.push(`${invoice.amount}`)
          lines.push(line.join(";"))
        }
        return lines.join("\n")
      }
    }
}