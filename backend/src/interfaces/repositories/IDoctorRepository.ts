import { IDoctor } from "../types/IDocotor.interface";

export interface IDoctorRepository {
  createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor>;
  findDoctorByEmail(email: string): Promise<IDoctor | null>;
}
