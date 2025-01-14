import { Router } from 'express';
import createUploadService from '../services/upload.service';
import { DoctorController } from '../controllers/doctor.controller';
import { DoctorRepository } from '../repositories/implementations/doctor.repository';
import { DoctorService } from '../services/doctor.service';
const doctor_route = Router();


const upload = createUploadService('doctors')
const doctorRepository = new DoctorRepository()
const doctorService = new DoctorService(doctorRepository)
const doctorController = new DoctorController(doctorService);

doctor_route.post('/register',upload.single('document'),doctorController.register.bind(doctorController));
doctor_route.post('/login', doctorController.login.bind(doctorController));


export default doctor_route;
