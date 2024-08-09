function main() {
  //---------- i18n
  // The locale our app first shows
  const defaultLocale = "en";

  // The active locale
  let locale;

  // Gets filled with active locale translations
  let translations = {};

  // When the page content is ready...
  document.addEventListener("DOMContentLoaded", () => {
    // Detect the user's locale
    const userLocale = navigator.language || navigator.userLanguage;

    // Map the detected locale to the appropriate translation file
    const supportedLocales = ["en", "is", "sv"];
    const newLocale = supportedLocales.includes(userLocale) ? userLocale : defaultLocale;

    // Translate the page to the detected or default locale
    setLocale(newLocale);
  });

  // Load translations for the given locale and translate
  // the page to this locale
  async function setLocale(newLocale) {
    if (newLocale === locale) return;

    const newTranslations = await fetchTranslationsFor(newLocale);
    translations = newTranslations;
    locale = newLocale;
  

    // Translate the page content
    translatePage();
  }

  // Fetch translations for the given locale
  async function fetchTranslationsFor(locale) {
    const response = await fetch(`/lang/${locale}.json`);
    return await response.json();
  }

  // Translate the page content
  function translatePage() {
    // Implement your translation logic here
    // For example, you can iterate over elements with a data-i18n attribute
    document.querySelectorAll("[data-i18n-key]").forEach((element) => {
      const key = element.getAttribute("data-i18n-key");
      element.textContent = translations[key] || key;
    });
  }
}

main();
