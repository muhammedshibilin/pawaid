import bcrypt from 'bcryptjs';
import { generateJwtToken } from '../utilities/generateJwt';
import { IUser } from '../interfaces/types/IUser';
import { IAdminRepository } from '../interfaces/repositories/IAdminRepository';
import { IDoctor } from '../interfaces/types/IDocotor.interface';
import { IRecruiter } from '../interfaces/types/IRecruiter.interface';

class AdminService {
  private readonly adminRepository: IAdminRepository;
  

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
  }

  async loginAdmin(email: string, password: string): Promise<{ status: number; message: string; accessToken?: string; refreshToken?: string }> {
    try {
      const admin = await this.adminRepository.findByEmail(email);

      if (!admin) {
        return { status: 404, message: 'Admin not found' };
      }

      if (!admin.is_admin) {
        return { status: 403, message: 'Access denied. Not an admin.' };
      }

      if (!admin.password) {
        throw new Error('Password is missing for this user.');
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return { status: 401, message: 'Invalid password' };
      }

      const token = generateJwtToken(
        { id: admin._id, email: admin.email, role: 'admin' },
        'access',
        '2m'
      );

      const refreshToken = generateJwtToken(
        { id: admin._id, email: admin.email, role: 'admin' },
        'refresh',
        '14d'
      );

      return { status: 200, message: 'Login successful', accessToken: token, refreshToken };
    } catch (error) {
      console.error('Error during admin login:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await this.adminRepository.getUsers();
      return users;
    } catch (error) {
      console.error('Error in getAllUsers service:', error);
      throw error;
    }
  }
  async getAllDoctors(): Promise<IDoctor[]> {
    try {
      const doctors = await this.adminRepository.getDoctors();
      return doctors;
    } catch (error) {
      console.error('Error in getAllUsers service:', error);
      throw error;
    }
  }
  async getAllRecruiters(): Promise<IRecruiter[]> {
    try {
      const recruiters = await this.adminRepository.getRecruiters();
      return recruiters;
    } catch (error) {
      console.error('Error in getAllUsers service:', error);
      throw error;
    }
  }

  async BlockUser(userId: string, is_block: boolean): Promise<{ status: number; message: string; user?: IUser }> {
    try {
      const user = await this.adminRepository.blockUser(userId, is_block);
      if (!user) {
        return { status: 404, message: 'User not found' };
      }

      const action = is_block ? 'blocked' : 'unblocked';
      return { status: 200, message: `User successfully ${action}`, user };
    } catch (error) {
      console.error('Error toggling user block status:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }

  async BlockDoctor(doctorId: string, is_block: boolean): Promise<{ status: number; message: string; doctor?: IDoctor }> {
    try {
      const doctor = await this.adminRepository.blockDoctor(doctorId, is_block);
      if (!doctor) {
        return { status: 404, message: 'User not found' };
      }

      const action = is_block ? 'blocked' : 'unblocked';
      return { status: 200, message: `doctor successfully ${action}`,doctor };
    } catch (error) {
      console.error('Error toggling doctor block status:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }
  async BlockRecruiter(recruiterId: string, is_block: boolean): Promise<{ status: number; message: string; recruiter?: IRecruiter }> {
    try {
      const recruiter = await this.adminRepository.blockRecruiter(recruiterId, is_block);
      if (!recruiter) {
        return { status: 404, message: 'recruiter not found' };
      }

      const action = is_block ? 'blocked' : 'unblocked';
      return { status: 200, message: `recruiter successfully ${action}`, recruiter };
    } catch (error) {
      console.error('Error toggling recruiter block status:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }
}

export default AdminService; 