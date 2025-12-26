import { VALIDATION_RULES } from './constants';

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`;
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return null; // Phone is optional
  }
  if (!VALIDATION_RULES.PHONE_REGEX.test(phone)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) {
    return 'Name is required';
  }
  if (name.length < 2) {
    return 'Name must be at least 2 characters';
  }
  return null;
};

export const validateNumber = (
  value: number,
  min?: number,
  max?: number,
  fieldName: string = 'Value'
): string | null => {
  if (value === null || value === undefined || isNaN(value)) {
    return `${fieldName} is required`;
  }
  if (min !== undefined && value < min) {
    return `${fieldName} must be at least ${min}`;
  }
  if (max !== undefined && value > max) {
    return `${fieldName} must not exceed ${max}`;
  }
  return null;
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};