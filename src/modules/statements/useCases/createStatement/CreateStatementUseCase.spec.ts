import { Statement } from './../../entities/Statement';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { ICreateStatementDTO } from './ICreateStatementDTO';
import { CreateStatementError } from './CreateStatementError';


let createStatementUseCase : CreateStatementUseCase;
let userRepositoryInMemory : InMemoryUsersRepository;
let statementRepositoryInMemory :  InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement",()=>{

  beforeEach(()=>{
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    userRepositoryInMemory = new  InMemoryUsersRepository();
    createStatementUseCase =  new CreateStatementUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
      )
  })


  it("should be able create new statement",async ()=>{

    const user = await userRepositoryInMemory.create({
      name: "Test User",
      email:"Test@test.com.br",
      password:"123456789"
    })

    const statement = await createStatementUseCase.execute(
      {
        user_id: user.id as string,
        amount:100.0,
        description:"Description statement",
        type: "deposit" as OperationType
      }
    );

    expect(statement).toHaveProperty("id")
  });

  it("should be able create new statement with insufficient balance",()=>{

   expect(async()=>{
    const user = await userRepositoryInMemory.create({
      name: "Test User",
      email:"Test@test.com.br",
      password:"123456789"
    })

    await createStatementUseCase.execute(
      {
        user_id: user.id as string,
        amount:100.0,
        description:"Description statement",
        type: "withdraw" as OperationType
      }
    );

   }).rejects.toBeInstanceOf(CreateStatementError)


  })

});
