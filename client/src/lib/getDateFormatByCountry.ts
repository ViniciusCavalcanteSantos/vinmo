/**
 * Obtém o formato de data (ex: "DD/MM/YYYY") para um código de país ISO 3166-1 alpha-2.
 * Usa a API Intl nativa para garantir suporte a praticamente todas as localidades.
 *
 * @param cca2 O código do país de 2 letras (ex: "BR", "US", "JP").
 * @param fallbackFormat O formato a ser retornado se o cca2 for inválido.
 * @returns O formato de data como uma string.
 */
export default function getDateFormatByCountry(
  cca2: string = 'US',
  fallbackFormat: string = "YYYY-MM-DD"
): string {
  try {
    const formatter = new Intl.DateTimeFormat(cca2, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const sampleDate = new Date(2023, 10, 25);
    const parts = formatter.formatToParts(sampleDate);

    return parts
      .map((part) => {
        switch (part.type) {
          case "day":
            return "DD";
          case "month":
            return "MM";
          case "year":
            return "YYYY";
          default:
            return part.value;
        }
      })
      .join("");
  } catch (error) {
    return fallbackFormat;
  }
}
