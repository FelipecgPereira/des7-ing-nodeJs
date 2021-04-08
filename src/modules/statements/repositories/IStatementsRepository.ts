import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { ICreateTransferDTO } from "../useCases/transferOperation/ICreateTransferDTO";

export interface IStatementsRepository {
  create: (data: ICreateStatementDTO) => Promise<Statement>;
  createTransfer:(data:ICreateTransferDTO) => Promise<Statement>;
  findStatementOperation: (data: IGetStatementOperationDTO) => Promise<Statement | undefined>;
  getUserBalance: (data: IGetBalanceDTO) => Promise<
    { balance: number } | { balance: number, statement: Statement[] }
  >;
}
