import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferUseCase } from "./TransferUseCase";


class TransferController{
  async handle(request: Request, response: Response): Promise<Response>{
    const {id} = request.user;
    const {user_id} = request.params;
    const {amount, description} = request.body;
    const transferUseCase = container.resolve(TransferUseCase);

    const statement = await transferUseCase.execute({
      id,
      user_id,
      amount,
      description
    });
    return response.json(statement);
  }
}

export{TransferController}
