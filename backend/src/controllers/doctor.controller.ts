import { Request, Response } from 'express';
import { DoctorService } from '../services/doctor.service';

interface UploadedFile extends Express.Multer.File {
    location: string;
  }
  
export class DoctorController {
  private doctorService: DoctorService;

  constructor(doctorService: DoctorService) {
    this.doctorService = doctorService;
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const doctorData = { ...req.body, document:(req.file as UploadedFile).location,};
      console.log(doctorData, "doctor dataa is here");
  
      const result = await this.doctorService.register(doctorData);
      return res.status(result.status).json({ message: result.message, data: result.data });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const message = await this.doctorService.login(email, password);
      return res.status(200).json({ message });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
