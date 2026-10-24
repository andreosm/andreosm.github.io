export {};

import { showFeedback, clearFeedback } from "./feedback.js";

// interface Window {
//   translate: (key: string) => string;
// }

const rsvpForm = document.getElementById("rsvpForm") as HTMLFormElement | null;

declare global {
  interface Window {
    btnNav: string;
    effectiveLanguage?: "en" | "pt" | "it";
    showNavbar?: boolean;
  }
}

// declare global {
//   interface Window {
//     translate: (key: string) => string;
//   }
// }

// window.translate = translate;

const attendingYes = document.getElementById(
  "attendingYes",
) as HTMLInputElement | null;

const attendingNo = document.getElementById(
  "attendingNo",
) as HTMLInputElement | null;

const partySizeSection = document.getElementById(
  "partySizeSection",
) as HTMLElement | null;

const partySizeInput = document.getElementById(
  "partySize",
) as HTMLInputElement | null;

const partySizeError = document.getElementById(
  "partySizeError",
) as HTMLElement | null;

// const declineMessage = document.getElementById(
//   "declineMessage",
// ) as HTMLElement | null;

const submitButton = document.getElementById(
  "submitRsvp",
) as HTMLButtonElement | null;

const btnSubmitIcon = document.getElementById(
  "btnSubmitIcon",
) as HTMLElement | null;

function isValidPartySize(): boolean {
  if (!partySizeInput) {
    return false;
  }

  /*
        Empty input is invalid.
    */

  if (partySizeInput.value.trim() === "") {
    return false;
  }

  const value = Number(partySizeInput.value);

  return Number.isInteger(value) && value > 0;
}

function updateFormState(): void {
  if (
    !attendingYes ||
    !attendingNo ||
    !partySizeSection ||
    !partySizeInput ||
    !submitButton
  ) {
    return;
  }

  /*
        NO
    */

  if (attendingNo.checked) {
    partySizeSection.classList.add("d-none");

    // declineMessage.classList.remove("d-none");

    partySizeInput.value = "";

    partySizeInput.classList.remove("is-invalid");

    submitButton.disabled = false;

    if (btnSubmitIcon) {
      if (btnSubmitIcon.classList.contains("bi-patch-question"))
        btnSubmitIcon.classList.remove("bi-patch-question");

      if (btnSubmitIcon.classList.contains("bi-hand-thumbs-up-fill"))
        btnSubmitIcon.classList.remove("bi-hand-thumbs-up-fill");

      btnSubmitIcon?.classList.add("bi-hand-thumbs-down-fill");
    }

    clearFeedback("rsvpFeedback", "rsvpFeedbackText");
    return;
  }

  /*
        YES
    */

  if (attendingYes.checked) {
    // declineMessage.classList.add("d-none");

    partySizeSection.classList.remove("d-none");

    const valid = isValidPartySize();

    submitButton.disabled = !valid;

    if (btnSubmitIcon) {
      if (btnSubmitIcon.classList.contains("bi-patch-question"))
        btnSubmitIcon.classList.remove("bi-patch-question");

      if (btnSubmitIcon.classList.contains("bi-hand-thumbs-down-fill"))
        btnSubmitIcon.classList.remove("bi-hand-thumbs-down-fill");

      btnSubmitIcon?.classList.add("bi-hand-thumbs-up-fill");
    }

    clearFeedback("rsvpFeedback", "rsvpFeedbackText");
    return;
  }

  /*
        Neither selected
    */

  partySizeSection.classList.add("d-none");

  //   declineMessage.classList.add("d-none");

  submitButton.disabled = true;
}

attendingYes?.addEventListener("change", updateFormState);

attendingNo?.addEventListener("change", updateFormState);

partySizeInput?.addEventListener("input", () => {
  const valid = isValidPartySize();

  partySizeInput.classList.toggle(
    "is-invalid",
    attendingYes?.checked === true && !valid,
  );

  // partySizeError?.classList.toggle(
  //   "d-none",
  //   attendingYes?.checked === true && !valid,
  // );

  updateFormState();
});

rsvpForm?.addEventListener("submit", async (event) => {
  /*
        Prevent full page postback.
    */
  event.preventDefault();

  /*
        Client validation is only convenience.

        Server validation remains authoritative.
    */

  // -------------------------
  // VALIDATE
  // -------------------------

  const isNo = attendingNo?.checked === true;

  const isYes = attendingYes?.checked === true;

  const validPartySize = isYes && isValidPartySize();

  if (!isNo && !validPartySize) {
    updateFormState();

    if (isYes) {
      partySizeInput?.classList.add("is-invalid");
    }

    return;
  }

  // -------------------------
  // BUILD REQUEST
  // -------------------------

  const formData = new FormData(rsvpForm);

  const body = new URLSearchParams();

  formData.forEach((value, key) => {
    body.append(key, String(value));
  });

  // -------------------------
  // SUBMIT
  // -------------------------

  try {
    const response = await fetch("/rsvp", {
      method: "POST",
      body,
    });

    const result = await response.json();

    //console.debug("results from rsvp: " + result);

    const guestData = document.getElementById(
      "guestData",
    ) as HTMLElement | null;

    const finished =
      typeof guestData?.dataset.finished === "string"
        ? guestData?.dataset.finished
        : "false";

    const isFinished = finished === "true";

    // -------------------------
    // FEEDBACK
    // -------------------------
    if (result.feedbackKey === "rsvpAccepted") {
      if (isFinished) {
        showFeedback(
          "rsvpFeedback",
          "rsvpFeedbackText",
          result.feedbackType,
          result.feedbackKey,
        );
      } else {
        window.location.href = "/" + window.btnNav;
        return;
      }
    }

    showFeedback(
      "rsvpFeedback",
      "rsvpFeedbackText",
      result.feedbackType,
      result.feedbackKey,
    );
    console.error("RSVP submission succeeded with key:" + result.feedbackKey);
  } catch (error) {
    console.error("RSVP submission failed:", error);

    showFeedback("rsvpFeedback", "rsvpFeedbackText", "danger", "rsvpSaveError");
  }
});

updateFormState();
