import mongoose,{Schema,Model} from "mongoose";
import { IDoctor } from "../interfaces/types/IDocotor.interface";


const DoctorSchema:Schema = new Schema<IDoctor>({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    phone:{
        type:Number
    },
    password:{
        type:String,
        minlength:6
    },
    document:{
        type:String,
        required:true
    },
    rescued:{
        type:Number,
        default:0
    },
    is_available:{
        type:Boolean,
        default:true
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    is_block:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true,
}
)

const Doctor:Model<IDoctor> = mongoose.model<IDoctor>('Doctor',DoctorSchema)

export default Doctor;