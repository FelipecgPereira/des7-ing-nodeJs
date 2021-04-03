import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { GetStatementOperationError } from './GetStatementOperationError';

let getStatementOperationUseCase : GetStatementOperationUseCase;
let userRepositoryInMemory : InMemoryUsersRepository;
let statementRepositoryInMemory :  InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operations",()=>{

  beforeEach(()=>{
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    userRepositoryInMemory = new  InMemoryUsersRepository();
    getStatementOperationUseCase =  new GetStatementOperationUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
      )
  })

  it("should be able list operation",async ()=>{
    const user = await userRepositoryInMemory.create({
      name: "Test User",
      email:"Test@test.com.br",
      password:"123456789"
    })

    const statement =  await statementRepositoryInMemory.create(
      {
        user_id: user.id as string,
        amount:100.0,
        description:"Description statement 100",
        type: "deposit" as OperationType
      }
    );



    const result = await getStatementOperationUseCase.execute({
      user_id:user.id as string,
      statement_id:statement.id as string
    })

    expect(result).toEqual(statement);

  })

  it("should be able list operation with incorrect user.id",async ()=>{

    expect(async ()=>{
      const user = await userRepositoryInMemory.create({
        name: "Test User",
        email:"Test@test.com.br",
        password:"123456789"
      })

      const statement =  await statementRepositoryInMemory.create(
        {
          user_id: user.id as string,
          amount:100.0,
          description:"Description statement 100",
          type: "deposit" as OperationType
        }
      );


      await getStatementOperationUseCase.execute({
        user_id:"IncorrectUserId",
        statement_id:statement.id as string
      })

    }).rejects.toBeInstanceOf(GetStatementOperationError)
  })

  it("should be able list operation with incorrect statement.id",async ()=>{

    expect(async ()=>{
      const user = await userRepositoryInMemory.create({
        name: "Test User",
        email:"Test@test.com.br",
        password:"123456789"
      })

      const statement =  await statementRepositoryInMemory.create(
        {
          user_id: user.id as string,
          amount:100.0,
          description:"Description statement 100",
          type: "deposit" as OperationType
        }
      );


      await getStatementOperationUseCase.execute({
        user_id:user.id as string,
        statement_id:"IncorrectStatementId"
      })

    }).rejects.toBeInstanceOf(GetStatementOperationError)
  })
})
