import { IPayload } from "./interfaces/types/IPayload";

declare global{
    namespace Express{
        interface Request{
            user?:UserPayload
            userId?:UserPayload
        }
    }
}