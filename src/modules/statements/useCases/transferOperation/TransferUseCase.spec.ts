import { Statement } from './../../entities/Statement';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { TransferUseCase } from './TransferUseCase';
import { TransferError } from './TransferError';



let transferUseCase : TransferUseCase;
let userRepositoryInMemory : InMemoryUsersRepository;
let statementRepositoryInMemory :  InMemoryStatementsRepository;

enum OperationType {
  TRANSFER = 'transfer',
  DEPOSIT = 'deposit'
}

describe("Create Transfer",()=>{

  beforeEach(()=>{
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    userRepositoryInMemory = new  InMemoryUsersRepository();
    transferUseCase =  new TransferUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
      )
  })

  it("should be able create new transfer",async ()=>{

    const user = await userRepositoryInMemory.create({
      name: "Test User",
      email:"Test@test.com.br",
      password:"123456789"
    });

    await statementRepositoryInMemory.create({
        user_id: user.id as string,
        amount:1000.0,
        description:"Description statement",
        type: "deposit" as OperationType
    })

    const userTransfer = await userRepositoryInMemory.create({
      name: "Test User2",
      email:"Test@test.com.br",
      password:"123456789"
    })

    const statement = await transferUseCase.execute(
      {
        id:user.id as string,
        user_id: userTransfer.id as string,
        amount:100.0,
        description:"Description statement",
      }
    );


    expect(statement).toHaveProperty("sender_id")
  });

  it("should be able create new transfer with insufficient balance",()=>{

   expect(async()=>{
    const user = await userRepositoryInMemory.create({
      name: "Test User",
      email:"Test@test.com.br",
      password:"123456789"
    })

    await  transferUseCase.execute(
      {
        id:user.id as string,
        user_id: "29287897",
        amount:100.0,
        description:"Description statement",
      }
    );

   }).rejects.toBeInstanceOf(TransferError)


  })

});
