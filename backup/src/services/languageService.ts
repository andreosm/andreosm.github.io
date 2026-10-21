export type Language = "en" | "it" | "pt";

export function countryToLanguage(countryCode: string): Language {
  switch (countryCode.toUpperCase()) {
    case "IT":
      return "it";

    case "BR":
      return "pt";

    case "US":
    default:
      return "en";
  }
}
