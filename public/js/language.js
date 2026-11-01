const DEFAULT_LANGUAGE = "en";
const LANGUAGE_API_URL = "/api/guest/language";
let currentTranslations = {};
let currentLanguage = DEFAULT_LANGUAGE;
// interface Window {
//   invitationLanguage?: Language;
//   translate: (key: string) => string;
// }
function isValidLanguage(value) {
    return value === "en" || value === "pt" || value === "it";
}
function getInitialLanguage() {
    //console.debug(window.preferredLanguage);
    // return isValidLanguage(window.effectiveLanguage)
    //   ? window.effectiveLanguage
    //   : DEFAULT_LANGUAGE;
    const language = window.preferredLanguage;
    if (language === "en" || language === "pt" || language === "it") {
        return language;
    }
    return DEFAULT_LANGUAGE;
}
async function saveLanguage(language) {
    const response = await fetch(LANGUAGE_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ language }),
    });
    if (!response.ok) {
        throw new Error(`Unable to save preferred language: ${response.status}`);
    }
}
async function loadTranslations(language) {
    const url = `/locales/${language}.json`;
    console.log("Loading translations from:", url);
    const response = await fetch(url);
    console.log("Translation response:", response.status, response.statusText);
    if (!response.ok) {
        throw new Error(`Could not load language: ${language}`);
    }
    const translations = await response.json();
    console.log("Translations loaded:", translations);
    return translations;
}
function getTranslation(translations, key) {
    return key
        .split(".")
        .reduce((object, property) => object?.[property], translations);
}
function translatePage(translations) {
    setPageTitle(translations);
    Object.entries(translations).forEach(([id, translation]) => {
        const element = document.getElementById(id);
        if (element && typeof translation === "string") {
            element.innerHTML = translation;
        }
    });
    document
        .querySelectorAll("input[placeholder][id]")
        .forEach((element) => {
        const key = `${element.id}Placeholder`;
        if (typeof translations[key] === "string") {
            element.placeholder = translations[key];
        }
    });
    setPageButtons(translations);
}
function updateLocalizedImages(language) {
    document
        .querySelectorAll("img[data-localized-src]")
        .forEach((img) => {
        const filename = img.dataset.localizedSrc;
        if (filename) {
            img.src = `/images/locales/${language}/${filename}`;
        }
    });
}
function showLanguageToast(language) {
    const toastElement = document.getElementById("languageToast");
    if (!toastElement) {
        return;
    }
    const toastHeader = document.getElementById("languageToastHeader");
    const toastTitle = document.getElementById("languageToastTitle");
    const toastBody = document.getElementById("languageToastBody");
    const headers = {
        en: "Marcos's Birthday Party",
        it: "Festa di Compleanno di Marcos",
        pt: "Festa de Aniversário do Marcos",
    };
    const titles = {
        en: "Language Changed",
        it: "Lingua Modificata",
        pt: "Idioma Alterado",
    };
    const bodies = {
        en: "The language has been changed to English.",
        it: "La lingua è stata modificata in italiano.",
        pt: "O idioma foi alterado para português.",
    };
    if (toastHeader) {
        toastHeader.innerHTML = headers[language];
    }
    if (toastTitle) {
        toastTitle.innerHTML = titles[language];
    }
    if (toastBody) {
        toastBody.innerHTML = bodies[language];
    }
    const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
    toast.show();
}
function setPageTitle(translations) {
    const titleKey = document.documentElement.dataset.pageTitle;
    if (titleKey && translations[titleKey]) {
        document.title = translations[titleKey];
    }
}
async function setLanguage(language) {
    console.log("Setting language:", language);
    const translations = await loadTranslations(language);
    currentTranslations = translations;
    currentLanguage = language;
    translatePage(translations);
    updateLocalizedImages(language);
    document.documentElement.lang = language;
}
async function changePreferredLanguage(language) {
    if (language === currentLanguage) {
        return;
    }
    try {
        // Load the translations before saving the preference.
        const translations = await loadTranslations(language);
        // Persist the preference in the guest's CSV record.
        await saveLanguage(language);
        // Apply the language only after successful persistence.
        currentTranslations = translations;
        currentLanguage = language;
        window.preferredLanguage = language;
        translatePage(translations);
        updateLocalizedImages(language);
        document.documentElement.lang = language;
        hideCurrentLanguageFlag();
        showLanguageToast(language);
    }
    catch (error) {
        console.error("Unable to change preferred language:", error);
    }
}
function initializeLanguageButtons() {
    const buttons = document.querySelectorAll("[data-language]");
    console.log(`Found ${buttons.length} language buttons.`);
    let changingLanguage = false;
    buttons.forEach((button) => {
        button.addEventListener("click", async () => {
            const language = button.dataset.language;
            if (!isValidLanguage(language) || changingLanguage) {
                return;
            }
            console.log("Language selected:", language);
            changingLanguage = true;
            try {
                await changePreferredLanguage(language);
            }
            finally {
                changingLanguage = false;
            }
        });
    });
    // if menu bar is hidden, display optional buttons are available, then hide current language flag
    hideCurrentLanguageFlag();
}
function hideCurrentLanguageFlag() {
    const lang = window.preferredLanguage;
    document
        .querySelectorAll(".language-selector-opt button[data-language]")
        .forEach((button) => {
        button.classList.toggle("d-none", button.dataset.language === lang);
    });
}
function setPageButtons(translations) {
    document.querySelectorAll("[data-button]").forEach((element) => {
        const key = element.getAttribute("data-button");
        if (key && translations[key]) {
            element.innerHTML = translations[key];
        }
    });
}
function translate(key) {
    return getTranslation(currentTranslations, key) ?? key;
}
window.translate = translate;
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Language system initialized.");
    initializeLanguageButtons();
    const language = getInitialLanguage();
    // await loadTranslations(language);
    console.log("Initial language:", language);
    try {
        await setLanguage(language);
    }
    catch (error) {
        console.error("Unable to initialize language:", error);
    }
});
export {};
