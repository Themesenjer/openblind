import { AuthFieldErrors, LoginPayload, RegisterPayload } from "@/types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(values: LoginPayload): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  if (!values.email.trim()) {
    errors.email = "El correo es obligatorio.";
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = "Ingresa un correo válido.";
  }

  if (!values.password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (values.password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres.";
  }

  return errors;
}

export function validateRegister(values: RegisterPayload): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "El nombre completo es obligatorio.";
  }

  if (!values.email.trim()) {
    errors.email = "El correo es obligatorio.";
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = "Ingresa un correo válido.";
  }

  if (!values.password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (values.password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres.";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }

  return errors;
}
