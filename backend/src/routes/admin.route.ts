import { Router } from 'express';
import authenticateJWT from '../middlewares/authentication';
import AdminController from '../controllers/admin.controller';
import AdminService from '../services/admin.service';
import AdminRepository from '../repositories/implementations/admin.repository';

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

const admin_route = Router();

admin_route.post('/login',adminController.login.bind(adminController))
admin_route.get('/users',authenticateJWT(['admin']),adminController.getUsers.bind(adminController));
admin_route.get('/doctors',authenticateJWT(['admin']),adminController.getDoctors.bind(adminController));
admin_route.get('/recruiters',authenticateJWT(['admin']),adminController.getRecruiters.bind(adminController));
admin_route.patch('/block-user/:id', authenticateJWT(['admin']), adminController.blockUser.bind(adminController));
admin_route.patch('/block-doctor/:id', authenticateJWT(['admin']), adminController.blockDoctor.bind(adminController));
admin_route.patch('/block-recruiter/:id', authenticateJWT(['admin']), adminController.blockRecruiter.bind(adminController));


export default admin_route;
