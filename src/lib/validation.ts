import { ADVERTISING_WILLINGNESS_OPTIONS } from "@/lib/drivers-form";
import type { BrandsFormData, DriversFormData } from "@/lib/types";

/** Returns an error message string or null if valid. */
export function validateBrandsStep(step: number, fd: BrandsFormData): string | null {
  switch (step) {
    case 0: return fd.ciudad ? null : "Por favor selecciona tu ciudad.";
    case 1: return fd.zonas.trim() ? null : "Por favor indica al menos una zona.";
    case 2: return null; // presupuesto optional
    case 3: return null; // objetivo optional
    case 4: return null; // problema optional
    case 5: {
      if (!fd.empresa.trim()) return "Por favor ingresa el nombre de tu empresa.";
      if (!fd.whatsapp.trim()) return "Por favor ingresa tu número de WhatsApp.";
      if (!fd.email.trim() || !/\S+@\S+\.\S+/.test(fd.email)) return "Por favor ingresa un email válido.";
      return null;
    }
    case 6: return null; // notas optional
    default: return null;
  }
}

export function validateDriversStep(step: number, fd: DriversFormData): string | null {
  switch (step) {
    case 0:
      return fd.ciudad === "Medellín" || fd.ciudad === "Bogotá"
        ? null
        : "Por favor selecciona tu ciudad.";
    case 1: {
      if (fd.zonas.length === 0) return "Por favor selecciona al menos una zona.";
      if (fd.zonas.includes("Otra") && !fd.zonasOtra.trim()) {
        return "Por favor especifica tu zona en el campo de texto.";
      }
      return null;
    }
    case 2:
      return fd.km ? null : "Por favor selecciona tus kilómetros promedio al mes.";
    case 3:
      return fd.vehiculo.trim() ? null : "Por favor ingresa los datos de tu vehículo.";
    case 4: {
      if (!fd.nombre.trim()) return "Por favor ingresa tu nombre.";
      if (!fd.whatsapp.trim()) return "Por favor ingresa tu número de WhatsApp.";
      if (!fd.email.trim() || !/\S+@\S+\.\S+/.test(fd.email)) {
        return "Por favor ingresa un email válido.";
      }
      return null;
    }
    case 5: {
      if (!fd.dispuestoPublicidad) return "Por favor selecciona una opción.";
      if (
        !ADVERTISING_WILLINGNESS_OPTIONS.includes(
          fd.dispuestoPublicidad as (typeof ADVERTISING_WILLINGNESS_OPTIONS)[number]
        )
      ) {
        return "Por favor selecciona Sí o No.";
      }
      return null;
    }
    case 6:
      return null;
    default:
      return null;
  }
}
