import {UploadFile} from "antd";

/**
 * Converte um objeto de valores em FormData de forma segura.
 * - Ignora valores nulos/undefined.
 * - Converte booleanos para "1"/"0".
 * - Serializa arrays/objetos para JSON.
 * - Aceita UploadFile do Ant Design.
 * - Permite mapear nomes de campos (ex: camelCase -> snake_case).
 */
export function objectToFormData(
  values: Record<string, any>,
  files?: Record<string, UploadFile | File | Blob | null>,
  fieldMap?: Record<string, string>
): FormData {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    const field = fieldMap?.[key] || key;

    if (value === undefined || value === null) return;

    if (typeof value === "boolean") {
      formData.append(field, value ? "1" : "0");
      return;
    }

    if (typeof value === "object" && !(value instanceof File) && !(value instanceof Blob)) {
      formData.append(field, JSON.stringify(value));
      return;
    }

    formData.append(field, String(value));
  });

  if (files) {
    Object.entries(files).forEach(([key, file]) => {
      const field = fieldMap?.[key] || key;
      const realFile =
        (file as UploadFile)?.originFileObj ||
        (file as File) ||
        (file as Blob);

      if (realFile) {
        formData.append(field, realFile);
      }
    });
  }

  return formData;
}
