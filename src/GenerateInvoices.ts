import ContractRepository from './ContractRepository'
import JsonPresenter from './JsonPresenter'
import Presenter from './Presenter'

export type Input = {
  month: number
  year: number
  type: "accrual" | "cash" 
  format?: string
}

export type Output = {
  date: Date
  amount: number
}

export default class GenerateInvoices {
    constructor(
      readonly contractRepository: ContractRepository, 
      readonly presenter: Presenter = new JsonPresenter()
    ){}

    async execute(input: Input): Promise<any> {
      const output: Output[] = []

      const contracts = await this.contractRepository.list()
      for(const contract of contracts) {
        const invoices = contract.generateInvoices(input.month,input.year, input.type)
            for(const invoice of invoices) {
              output.push({
                date: invoice.date, amount: invoice.amount
              })
            }
      }
      return this.presenter.present(output)
    }
}