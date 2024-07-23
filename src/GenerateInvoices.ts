import moment from 'moment'
import ContractRepository from './ContractRepository'

export type Input = {
  month: number
  year: number
  type: "accrual" | "cash"
}

export type Output = {
  date: string
  amount: number
}

export default class GenerateInvoices {
    constructor(private readonly contractRepository: ContractRepository){}

    async execute(input: Input): Promise<Output[]> {
      const output: Output[] = []

      const contracts = await this.contractRepository.list()
      for(const contract of contracts) {
        const invoices = contract.generateInvoices(input.month,input.year, input.type)
            for(const invoice of invoices) {
              output.push({
                date: moment(invoice.date).format("YYYY-MM-DD"), amount: invoice.amount
              })
            }
      }
      return output
  }
}

