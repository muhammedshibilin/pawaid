import User from '../../models/user.model';
import { IUser } from '../../interfaces/types/IUser';
import { IAdminRepository } from '../../interfaces/repositories/IAdminRepository';
import { IDoctor } from '../../interfaces/types/IDocotor.interface';
import Doctor from '../../models/doctor.model';
import { IRecruiter } from '../../interfaces/types/IRecruiter.interface';
import Recruiter from '../../models/recruiter.model';

class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async getUsers(): Promise<IUser[]> {
    try {
      return await User.find({ is_admin: false }, 'username email is_block createdAt');
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async getDoctors(): Promise<IDoctor[]> {
    try {
      return await Doctor.find({},'username email is_block createdAt');
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('Failed to fetch doctors');
    }
  }

  async getRecruiters(): Promise<IRecruiter[]> {
    try {
      return await Recruiter.find({},'username email is_block createdAt');
    } catch (error) {
      console.error('Error fetching recruiters:', error);
      throw new Error('Failed to fetch recruiters');
    }
  }

  async blockUser(userId: string, is_block: boolean): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { is_block: is_block },
      { new: true } 
    );
  }
  async blockDoctor(doctorId: string, is_block: boolean): Promise<IDoctor | null> {
    console.log('hsii doctor blockkk',doctorId,is_block)
    return await Doctor.findByIdAndUpdate(
      doctorId,
      { is_block: is_block },
      { new: true } 
    );
  }
  async blockRecruiter(recruiterId: string, is_block: boolean): Promise<IRecruiter | null> {
    return await Recruiter.findByIdAndUpdate(
      recruiterId,
      { is_block: is_block },
      { new: true } 
    );
  }
}

export default AdminRepository
