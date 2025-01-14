import { IRecruiterRepository } from "../interfaces/repositories/IRecruiterRepository";
import bcrypt from 'bcryptjs';
import { IRecruiter } from "../interfaces/types/IRecruiter.interface";

export class RecruiterService {
    constructor(private recruiterRepository: IRecruiterRepository) {}

    async register(recruiterData: Partial<IRecruiter>): Promise<{ status: number; message: string; data?: IRecruiter }> {
        if (!recruiterData.email) {
            return { status: 400, message: 'Email is required!' };
        }

        const existingRecruiter = await this.recruiterRepository.findRecruiterByEmail(recruiterData.email);
        if (existingRecruiter) {
            return { status: 409, message: 'Email already registered!' };
        }
        recruiterData.is_verified = false;
        recruiterData.password = null

        console.log('recruiter data is service',recruiterData)
        const recruiter = await this.recruiterRepository.createRecruiter(recruiterData);
        return { status: 200, message: 'recruiter registered successfully', data:recruiter};
    }

    async login(email: string, password: string): Promise<string> {
        const recruiter = await this.recruiterRepository.findRecruiterByEmail(email);
        if (!recruiter) {
            throw new Error('recruiter not found');
        }

        const isPasswordValid = await bcrypt.compare(password, recruiter.password!);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        if (!recruiter.is_verified) {
            throw new Error('recruiter is not verified by admin');
        }

        return 'Login successful';
    }
}
