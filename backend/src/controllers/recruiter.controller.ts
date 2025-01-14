import { Request, Response } from 'express';
import { RecruiterService } from '../services/recruiter.service';

interface UploadedFile extends Express.Multer.File {
    location: string;
  }
  
export class RecruiterController {
  private recruiterService: RecruiterService;

  constructor(recruiterService: RecruiterService) {
    this.recruiterService = recruiterService;
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const recruiterData = { ...req.body, document:(req.file as UploadedFile).location};
      console.log(recruiterData, "recruiter dataa is here");
  
      const result = await this.recruiterService.register(recruiterData);
      return res.status(result.status).json({ message: result.message, data: result.data });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const message = await this.recruiterService.login(email, password);
      return res.status(200).json({ message });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
