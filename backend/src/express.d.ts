import { IPayload } from "./interfaces/IPayload";

declare global{
    namespace Express{
        interface Request{
            user?:UserPayload
        }
    }
}