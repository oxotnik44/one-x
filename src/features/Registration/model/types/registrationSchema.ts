export interface RegistrationSchema {
    email: string;
    password: string;
    confirmPassword: string;
    captcha: string;
    isLoading: boolean;
    error: string | null;
}
