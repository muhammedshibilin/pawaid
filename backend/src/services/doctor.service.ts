import { IDoctorRepository } from "../interfaces/repositories/IDoctorRepository";
import bcrypt from 'bcryptjs';
import { IDoctor } from "../interfaces/types/IDocotor.interface";

export class DoctorService {
    constructor(private doctorRepository: IDoctorRepository) {}

    async register(doctorData: Partial<IDoctor>): Promise<{ status: number; message: string; data?: IDoctor }> {
        if (!doctorData.email) {
            return { status: 400, message: 'Email is required!' };
        }

        const existingDoctor = await this.doctorRepository.findDoctorByEmail(doctorData.email);
        if (existingDoctor) {
            return { status: 409, message: 'Email already registered!' };
        }
        doctorData.is_verified = false;
        doctorData.password = null

        const doctor = await this.doctorRepository.createDoctor(doctorData);
        return { status: 200, message: 'Doctor registered successfully', data: doctor };
    }

    async login(email: string, password: string): Promise<string> {
        const doctor = await this.doctorRepository.findDoctorByEmail(email);
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        const isPasswordValid = await bcrypt.compare(password, doctor.password!);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        if (!doctor.is_verified) {
            throw new Error('Doctor is not verified by admin');
        }

        return 'Login successful';
    }
}
