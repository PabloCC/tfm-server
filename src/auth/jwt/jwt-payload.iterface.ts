import { Role } from "../enums/user-role.enum";

export interface JwtPayload {
    id: number;
    username: string;
    email: string;
    name: string;
    role: Role
}