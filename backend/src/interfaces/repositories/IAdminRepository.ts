import { IDoctor } from "../types/IDocotor.interface";
import { IRecruiter } from "../types/IRecruiter.interface";
import { IUser } from "../types/IUser";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IUser | null>;
  getUsers(): Promise<IUser[]>;
  getDoctors(): Promise<IDoctor[]>;
  getRecruiters(): Promise<IRecruiter[]>;
  blockUser(userId: string, is_block: boolean): Promise<IUser | null>;
  blockDoctor(doctorId: string, is_block: boolean): Promise<IDoctor | null>;
  blockRecruiter(recruiterId: string, is_block: boolean): Promise<IRecruiter| null>;


}
