import { injectable } from 'tsyringe';
import { IStatementsRepository } from './../../repositories/IStatementsRepository';
import { IUsersRepository } from './../../../users/repositories/IUsersRepository';
import { inject } from 'tsyringe';
import { CreateStatementError } from '../createStatement/CreateStatementError';

interface IRequest{

  id: string;
  user_id: string;
  amount: number;
  description: string;

}

enum OperationType {
  TRANSFER = 'transfer',
  DEPOSIT = 'deposit'
}

@injectable()
class TransferUseCase{

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}


  async execute({id,user_id,amount,description}:IRequest){

      const user = await this.usersRepository.findById(id);

      const userTransfer =  await this.usersRepository.findById(user_id);

      if(!user) {
        throw new CreateStatementError.UserNotFound();
      }

      if(!userTransfer) {
        throw new CreateStatementError.UserNotFound();
      }


      const { balance } = await this.statementsRepository.getUserBalance({ user_id: id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
     }

     const statementOperation = await this.statementsRepository.createTransfer({
        user_id: id,
        sender_id: user_id,
        amount,
        description,
        type: 'transfer' as OperationType,
      })

      await this.statementsRepository.create({
      user_id,
      type: 'deposit' as OperationType,
      amount,
      description
    });

    return statementOperation;

  }

}

export{TransferUseCase}
