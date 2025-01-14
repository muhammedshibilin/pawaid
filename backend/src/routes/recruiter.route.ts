import { Router } from 'express';
import createUploadService from '../services/upload.service';
import { RecruiterRepository } from '../repositories/implementations/recruiter.repository';
import { RecruiterService } from '../services/recruiter.service';
import { RecruiterController } from '../controllers/recruiter.controller';


const recruiter_route = Router();


const upload = createUploadService('recruiters')


const recruiterRepository = new RecruiterRepository()
const recruiterService = new RecruiterService(recruiterRepository)
const recruiterController = new RecruiterController(recruiterService);

recruiter_route.post('/register',upload.single('document'),recruiterController.register.bind(recruiterController));
recruiter_route.post('/login', recruiterController.login.bind(recruiterController));

export default recruiter_route;
