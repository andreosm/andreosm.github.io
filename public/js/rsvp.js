import { showFeedback, clearFeedback } from "./feedback.js";
const rsvpForm = document.getElementById("rsvpForm");
const attendingYes = document.getElementById("attendingYes");
const attendingNo = document.getElementById("attendingNo");
const partySizeSection = document.getElementById("partySizeSection");
const partySizeInput = document.getElementById("partySize");
const partySizeError = document.getElementById("partySizeError");
// const declineMessage = document.getElementById(
//   "declineMessage",
// ) as HTMLElement | null;
const submitButton = document.getElementById("submitRsvp");
const btnSubmitIcon = document.getElementById("btnSubmitIcon");
function isValidPartySize() {
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
function updateFormState() {
    if (!attendingYes ||
        !attendingNo ||
        !partySizeSection ||
        !partySizeInput ||
        !submitButton) {
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
    partySizeInput.classList.toggle("is-invalid", attendingYes?.checked === true && !valid);
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
    // ------------------------
    let partySizeEst = -1;
    if (isNo) {
        partySizeEst = 0;
    }
    if (isYes) {
        partySizeEst = Number(partySizeInput?.value.trim());
    }
    //const formData = new FormData(rsvpForm);
    //onst body = new URLSearchParams();
    // formData.forEach((value, key) => {
    //   body.append(key, String(value));
    // });
    console.debug("updating rsvp");
    const responseObj = {
        success: true,
        feedbackType: "success",
        feedbackKey: "rsvpAccepted",
        finished: false,
    };
    if (!Number.isInteger(partySizeEst) || partySizeEst < 0) {
        responseObj.success = true;
        responseObj.feedbackType = "danger";
        responseObj.feedbackKey = "rsvpInvalidPartySize";
    }
    else {
        try {
            const response = await fetch("/rsvp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    partySizeEst,
                }),
            });
            const result = await response.json();
            if (result.feedbackKey === "rsvpInvalidPartySize") {
                showFeedback("rsvpFeedback", "rsvpFeedbackText", result.feedbackType, result.feedbackKey);
            }
            if (result.feedbackKey === "rsvpDeclined") {
                showFeedback("rsvpFeedback", "rsvpFeedbackText", result.feedbackType, result.feedbackKey);
            }
            if (result.feedbackKey === "rsvpAccepted") {
                if (result.finished) {
                    showFeedback("rsvpFeedback", "rsvpFeedbackText", result.feedbackType, result.feedbackKey);
                }
                else {
                    window.location.href = "/" + window.btnNav;
                    return;
                }
            }
            console.error("RSVP submission succeeded with key:" + result.feedbackKey);
        }
        catch (error) {
            console.error("RSVP submission failed:", error);
            showFeedback("rsvpFeedback", "rsvpFeedbackText", "danger", "rsvpSaveError");
        }
    }
    if (partySizeEst === 0) {
        responseObj.feedbackType = "info";
        responseObj.feedbackKey = "rsvpDeclined";
        responseObj.finished = true;
    }
});
updateFormState();
