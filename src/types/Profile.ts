export interface ProfileData extends Record<string, unknown> {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  avatar: string;
}

export interface UpdateProfileData extends Record<string, unknown> {
  email?: string;
  login?: string;
  first_name?: string;
  second_name?: string;
  display_name?: string;
  phone?: string;
  password?: string;
  oldPassword?: string;
}

export interface UpdatePasswordData extends Record<string, unknown> {
  oldPassword: string;
  newPassword: string;
}
