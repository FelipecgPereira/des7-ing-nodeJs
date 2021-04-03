import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';

import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';

let getBalanceUseCase : GetBalanceUseCase;
let userRepositoryInMemory : InMemoryUsersRepository;
let statementRepositoryInMemory :  InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance",()=>{

  beforeEach(()=>{
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    userRepositoryInMemory = new  InMemoryUsersRepository();
    getBalanceUseCase =  new GetBalanceUseCase(
      statementRepositoryInMemory,
      userRepositoryInMemory
      )
  })


  it("should be able list all statement",async ()=>{

    const user = await userRepositoryInMemory.create({
      name: "Test User",
      email:"Test@test.com.br",
      password:"123456789"
    })

    const statement = await statementRepositoryInMemory.create(
      {
        user_id: user.id as string,
        amount:100.0,
        description:"Description statement",
        type: "deposit" as OperationType
      }
    );

   const result =  await getBalanceUseCase.execute({user_id: user.id as string})

   expect(result.statement).toEqual([statement]);
   expect(result.balance).toBe(100)

  });


  it("should be able list all statement with incorrect user",async ()=>{

   expect(async ()=>{
    const user = await userRepositoryInMemory.create({
      name: "Test User",
      email:"Test@test.com.br",
      password:"123456789"
    })

     await statementRepositoryInMemory.create(
      {
        user_id:user.id as string,
        amount:100.0,
        description:"Description statement",
        type: "deposit" as OperationType
      }
    );

   await getBalanceUseCase.execute({user_id: "IncorrectId"})

   }).rejects.toBeInstanceOf(GetBalanceError)

  });




});
