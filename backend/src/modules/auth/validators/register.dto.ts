export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  county?: string;
  city?: string;
  addressLine?: string;
  latitude?: number;
  longitude?: number;
}