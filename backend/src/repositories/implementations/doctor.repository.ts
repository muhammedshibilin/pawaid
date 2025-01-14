import { IDoctorRepository } from "../../interfaces/repositories/IDoctorRepository";
import { IDoctor } from "../../interfaces/types/IDocotor.interface";
import Doctor from "../../models/doctor.model";

export class DoctorRepository implements IDoctorRepository {
    async createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor> {
        const doctor = new Doctor(doctorData);
        return doctor.save();
      }
    
      async findDoctorByEmail(email: string): Promise<IDoctor | null> {
        console.log('Searching doctor by email:', email);
        const doctor = await Doctor.findOne({ email });
        console.log('Doctor found:', doctor);
        return doctor;
      }

     
}
