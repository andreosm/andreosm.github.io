"use strict";
const DEFAULT_LANGUAGE = "en";
const LANGUAGE_STORAGE_KEY = "preferredLanguage";
function getSavedLanguage() {
    const language = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (language === "en" || language === "pt" || language === "it") {
        return language;
    }
    return DEFAULT_LANGUAGE;
}
function saveLanguage(language) {
    const currentLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    if (currentLanguage != language)
        showLanguageToast(language);
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
        if (element) {
            element.innerHTML = translation;
        }
    });
    setPageButtons(translations);
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
    try {
        const translations = await loadTranslations(language);
        translatePage(translations);
        saveLanguage(language);
        document.documentElement.lang = language;
    }
    catch (error) {
        console.error("Unable to load language:", error);
    }
}
function initializeLanguageButtons() {
    const buttons = document.querySelectorAll("[data-language]");
    console.log(`Found ${buttons.length} language buttons.`);
    buttons.forEach((button) => {
        button.addEventListener("click", async () => {
            const language = button.dataset.language;
            console.log("Language selected:", language);
            await setLanguage(language);
        });
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
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Language system initialized.");
    // registerCurrentPage();
    // updateMenuAccess();
    initializeLanguageButtons();
    const language = getSavedLanguage();
    console.log("Initial language:", language);
    await setLanguage(language);
});
