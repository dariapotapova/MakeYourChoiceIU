export type UserRole = 'student' | 'admin' | 'admin-student';

export interface AuthUser {
    email: string;
    group: string;
    role: UserRole;
}