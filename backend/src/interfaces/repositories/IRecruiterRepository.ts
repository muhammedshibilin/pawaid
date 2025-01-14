import { IRecruiter } from "../types/IRecruiter.interface";

export interface IRecruiterRepository {
  createRecruiter(RecruiterData: Partial<IRecruiter>): Promise<IRecruiter>;
  findRecruiterByEmail(email: string): Promise<IRecruiter | null>;
}