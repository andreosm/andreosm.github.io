import { showFeedback, clearFeedback } from "./feedback.js";

interface GuestSearchResponse {
  success: boolean;
  firstName?: string;
    message?: string;
    key?: string;
}

interface AccessCodeResponse {
  success: boolean;
  redirectUrl?: string;
  message?: string;
}

type Language = "en" | "pt" | "it";
const DEFAULT_LANGUAGE= "en";
const LANGUAGE_STORAGE_KEY = "preferredLanguage";

document.addEventListener("DOMContentLoaded", () => {
  const guestSearchSection = document.getElementById(
    "guestSearchSection",
  ) as HTMLElement;

  const accessCodeSection = document.getElementById(
    "accessCodeSection",
  ) as HTMLElement;

  const guestSearchForm = document.getElementById(
    "guestSearchForm",
  ) as HTMLFormElement;

  const accessCodeForm = document.getElementById(
    "accessCodeForm",
  ) as HTMLFormElement;

  const firstNameInput = document.getElementById(
    "firstName",
  ) as HTMLInputElement;
    
      const firstNameFakeInput = document.getElementById(
        "firstNameFake",
      ) as HTMLInputElement;

    const lastNameInput = document.getElementById("lastName") as HTMLInputElement;
    
          const lastNameFakeInput = document.getElementById(
            "lastNameFake",
          ) as HTMLInputElement;

  const accessCodeInput = document.getElementById(
    "accessCode",
  ) as HTMLInputElement;

  const searchFeedback = document.getElementById(
    "searchFeedback",
  ) as HTMLElement;

  const codeFeedback = document.getElementById("codeFeedback") as HTMLElement;

  const accessCodeTitle = document.getElementById(
    "accessCodeTitle",
  ) as HTMLElement;

  const searchButton = document.getElementById(
    "searchButton",
  ) as HTMLButtonElement;

  const accessCodeButton = document.getElementById(
    "accessCodeButton",
  ) as HTMLButtonElement;

//   const backToSearchButton = document.getElementById(
//     "backToSearchButton",
//   ) as HTMLButtonElement;

  // ================================================================
  // SEARCH FOR GUEST
  // ================================================================

  guestSearchForm.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

      clearFeedback("searchFeedback", "searchFeedbackText");

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();

    let valid = true;

    // --------------------------------------------------------
    // Validate first name
    // --------------------------------------------------------

    if (!firstName) {
      firstNameInput.classList.add("is-invalid");
      valid = false;
    } else {
      firstNameInput.classList.remove("is-invalid");
    }

    // --------------------------------------------------------
    // Validate last name
    // --------------------------------------------------------

    if (!lastName) {
      lastNameInput.classList.add("is-invalid");
      valid = false;
    } else {
      lastNameInput.classList.remove("is-invalid");
    }

    if (!valid) {
      return;
    }

    // --------------------------------------------------------
    // Search
    // --------------------------------------------------------

    try {
      setButtonBusy(searchButton, true);

      const response = await fetch("/search", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          firstName,
          lastName,
        }),
      });

      const result = (await response.json()) as GuestSearchResponse;

      if (!response.ok || !result.success) {
        showFeedback(
            "searchFeedback",
            "searchFeedbackText",
            "danger",
            result.key ?? "searchByNameNotFound",
        );

        return;
      }

      // ----------------------------------------------------
      // Guest found
      // ----------------------------------------------------
        let preferredLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        
        if (!preferredLang || preferredLang == "") {
            preferredLang = DEFAULT_LANGUAGE;
        }

        const language = preferredLang as Language;

        const accessCodeTitles: Record<Language, string> = {
            en: "Welcome ",
            it: "Bienvenuto(a)",
            pt: "Bem-vindo(a)",
        }           

        firstNameFakeInput.value = firstName;
        firstNameFakeInput.disabled = true;
        lastNameFakeInput.value = lastName;
        lastNameFakeInput.disabled = true;

        guestSearchSection.classList.add("d-none");

        accessCodeSection.classList.remove("d-none");

      // if (result.firstName) {
      //   accessCodeTitle.textContent =  accessCodeTitles[language] + `${result.firstName}!`;
      // }

      accessCodeInput.value = "";

      accessCodeInput.focus();
    } catch (error) {
      console.error("Error searching for guest:", error);

      showFeedback(
        "searchFeedback",
        "searchFeedbackText",
        "danger",
        "searchByNameNotFound",
      );
    } finally {
      setButtonBusy(searchButton, false);
    }
  });

  // ================================================================
  // VERIFY ACCESS CODE
  // ================================================================

  accessCodeForm.addEventListener("submit", async (event: SubmitEvent) => {
    console.debug("here");
    
    event.preventDefault();

    clearFeedback("codeFeedback", "codeFeedbackText");

    const accessCode = accessCodeInput.value.trim();

    console.debug("accessCode is" + accessCode);

    let valid = true;

    // --------------------------------------------------------
    // Validate access code
    // --------------------------------------------------------

        if (!accessCode) {
          accessCodeInput.classList.add("is-invalid");

          valid = false;;
        } else {
          accessCodeInput.classList.remove("is-invalid");
        }

    if (!valid) {
      return;
    }

    try {
      setButtonBusy(accessCodeButton, true);

      const response = await fetch("/search/access-code", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          accessCode,
        }),
      });

      const result = (await response.json()) as AccessCodeResponse;

      if (!response.ok || !result.success) {
        showFeedback(
          "codeFeedback",
          "codeFeedbackText",
            "danger",
            "searchAccessCodeNotFound",
        );

        accessCodeInput.select();

        return;
      }

      // ----------------------------------------------------
      // Access granted
      // ----------------------------------------------------

      window.location.href = result.redirectUrl ?? "/";
    } catch (error) {
      console.error("Error verifying access code:", error);

      showFeedback(
        "codeFeedback",
        "codeFeedbackText",
        "danger",
        "searchByNameError",
      );
    } finally {
      setButtonBusy(accessCodeButton, false);
    }
  });

  // ================================================================
  // BACK TO NAME SEARCH
  // ================================================================

//   backToSearchButton.addEventListener("click", () => {
//     accessCodeSection.classList.add("d-none");

//     guestSearchSection.classList.remove("d-none");

//     accessCodeInput.value = "";

//     clearFeedback("codeFeedback", "codeFeedbacTextk");
//     clearFeedback("searchFeedback", "searchFeedbackText");

//     firstNameInput.focus();
//   });

  // ================================================================
  // REMOVE VALIDATION WHEN USER TYPES
  // ================================================================

  firstNameInput.addEventListener("input", () => {
    firstNameInput.classList.remove("is-invalid");
  });

  lastNameInput.addEventListener("input", () => {
    lastNameInput.classList.remove("is-invalid");
  });

  accessCodeInput.addEventListener("input", () => {
    accessCodeInput.classList.remove("is-invalid");

    clearFeedback("codeFeedback", "codeFeedbacTextk");
    clearFeedback("searchFeedback", "searchFeedbackText");
  });
});

// ====================================================================
// FEEDBACK
// ====================================================================

// function showFeedback(
//   element: HTMLElement,
//   message: string,
//   type: "success" | "danger" | "warning" | "info",
// ): void {
//   element.textContent = message;

//   element.className = `alert alert-${type}`;
// }

// function clearFeedback(element: HTMLElement): void {
//   element.textContent = "";

//   element.className = "alert d-none";
// }

// ====================================================================
// BUTTON STATE
// ====================================================================

function setButtonBusy(button: HTMLButtonElement, busy: boolean): void {
  button.disabled = busy;

  if (busy) {
    button.dataset.originalText = button.textContent ?? "";

    button.textContent = "...";
  } else {
    const originalText = button.dataset.originalText;

    if (originalText) {
      button.textContent = originalText;
    }
  }
}
