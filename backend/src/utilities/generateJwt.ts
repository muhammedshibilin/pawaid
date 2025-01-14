import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

export function generateJwtToken(payload: object, secretKeyType:'access'|'refresh', expiresIn: string): string {
    let secretKey:string;
    
    if(secretKeyType=='access'){
        secretKey = process.env.JWT_SECRET as string
    }else if(secretKeyType=='refresh'){
        secretKey = process.env.JWT_REFRESH_SECRET as string
    }else{
        throw new Error('invalid secret type')
    }

    if(!secretKey){
        throw new Error('missing secret key')
    }

    return jwt.sign(payload, secretKey, { expiresIn });
}
