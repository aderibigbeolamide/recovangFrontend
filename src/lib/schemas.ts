import { z } from 'zod';

export const registerStep1Schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const collectorOnboardingSchema = z.object({
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  identificationType: z.enum(['NIN', 'BVN', 'VotersCard']),
  identificationNumber: z.string().min(5, 'ID number is required'),
});

export const businessOnboardingSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  registrationNumber: z.string().min(5, 'RC number is required'),
  address: z.string().min(5, 'Address is required'),
  industry: z.string().min(2, 'Industry is required'),
});

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>;
export type CollectorOnboardingData = z.infer<typeof collectorOnboardingSchema>;
export type BusinessOnboardingData = z.infer<typeof businessOnboardingSchema>;
