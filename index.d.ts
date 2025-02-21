import { User } from "./src/users/types";

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}
