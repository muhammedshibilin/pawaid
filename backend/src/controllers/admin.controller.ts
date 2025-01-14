import { Request, Response } from 'express';
import AdminService from '../services/admin.service';
import {  setCookie } from '../utilities/cookie.util';


class AdminController {
    private readonly adminService: AdminService;

    constructor(adminService: AdminService) {
        this.adminService = adminService;
    }

    async login(req: Request, res: Response): Promise<Response> {
      const { email, password } = req.body;
      console.log(req.body)
      if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required' });
      }
      const{status,message,accessToken,refreshToken} = await this.adminService.loginAdmin(email, password);
      console.log(status,message,refreshToken)
      if (status === 200) {
          setCookie(res, 'refreshToken', refreshToken!);
          return res.status(status).json({ message,accessToken });
      }else{
          return res.status(status).json({message});
      }
  }

    async blockUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.id;
            const { is_block } = req.body;

            console.log('Blocking user request:', { userId, is_block });

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            const updatedUser = await this.adminService.BlockUser(userId, is_block);

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: `User ${is_block ? 'blocked' : 'unblocked'} successfully`,
                user: updatedUser
            });

        } catch (error) {
            console.error('Error in blockUser:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async blockDoctor(req: Request, res: Response): Promise<Response> {
        try {
            const doctorId = req.params.id;
            const { is_block } = req.body;

            console.log('Blocking user request:', { doctorId, is_block });

            if (!doctorId) {
                return res.status(400).json({
                    success: false,
                    message: 'doctor ID is required'
                });
            }

            const updatedDoctor = await this.adminService.BlockDoctor(doctorId, is_block);

            if (!updatedDoctor) {
                return res.status(404).json({
                    success: false,
                    message: 'doctor not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: `Doctor ${is_block ? 'blocked' : 'unblocked'} successfully`,
                user: updatedDoctor
            });

        } catch (error) {
            console.error('Error in blockUser:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async blockRecruiter(req: Request, res: Response): Promise<Response> {
        try {
            const recruiterId = req.params.id;
            const { is_block } = req.body;

            console.log('Blocking Recruiter request:', { recruiterId, is_block });
            if (!recruiterId) {
                return res.status(400).json({
                    success: false,
                    message: 'Recruiter ID is required'
                });
            }

            const updatedRecruiter = await this.adminService.BlockRecruiter(recruiterId, is_block);

            if (!updatedRecruiter) {
                return res.status(404).json({
                    success: false,
                    message: 'Recruiter not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: `Recruiter ${is_block ? 'blocked' : 'unblocked'} successfully`,
                Recruiter: updatedRecruiter
            });

        } catch (error) {
            console.error('Error in blockRecruiter:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async getUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.adminService.getAllUsers();
            return res.status(200).json({
                status: 200,
                message: 'Users fetched successfully',
                users: users
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error fetching users',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async getDoctors(req: Request, res: Response): Promise<Response> {
        try {
            const doctors = await this.adminService.getAllDoctors();
        
            return res.status(200).json({
                status: 200,
                message: 'doctorss fetched successfully',
                doctors: doctors
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error fetching users',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async getRecruiters(req: Request, res: Response): Promise<Response> {
        try {
            const recruiters = await this.adminService.getAllRecruiters();
            return res.status(200).json({
                status: 200,
                message: 'recruiters fetched successfully',
                recruiters:recruiters
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error fetching users',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}

export default AdminController;
