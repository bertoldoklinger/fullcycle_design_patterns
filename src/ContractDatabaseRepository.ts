import ContractRepository from "./ContractRepository";
import DatabaseConnection from "./DatabaseConnection";

export default class ContractDatabaseRepository implements ContractRepository {
  constructor(private readonly connection: DatabaseConnection) {}
  
  async list(): Promise<any> {
    const contracts = await this.connection.query("select * from branas.contract", [])
    for(const contract of contracts) {
      contract.payments = await this.connection.query("select * from branas.payment where id_contract = $1", [contract.id_contract])
  }
    this.connection.close()
    return contracts
  }
}