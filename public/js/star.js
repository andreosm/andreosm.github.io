import { showFeedback, clearFeedback } from "./feedback.js";
document.addEventListener("DOMContentLoaded", () => {
    console.log("All radios:", document.querySelectorAll('input[name="star"]').length);
    const form1 = document.getElementById("starForm");
    const form2 = document.getElementById("starFormSong");
    const submitForm1 = document.getElementById("starSubmitButton");
    const submitForm2 = document.getElementById("starSubmitSongButton");
    const starRadios = document.querySelectorAll('input[name="star"]');
    const noRadio = document.querySelector('input[name="star"][value="no"]');
    const noOption = noRadio?.closest(".form-check");
    const noDiv = document.getElementById("divNo");
    //const noLabel = noOption?.querySelector<HTMLLabelElement>("label");
    const presenting = document.getElementById("presenting");
    let noEscapeCount = 0;
    const MAX_NO_ESCAPES = 2;
    const ESCAPE_DISTANCE = 60;
    let direction = "down";
    // function refreshStepper(stepper: StepperState): void {
    //   const stepIds: StepId[] = [
    //     "welcome",
    //     "party",
    //     "star",
    //     "rsvp",
    //     "thats60s",
    //     "thats7s",
    //     "end",
    //   ];
    //   const elements = document.querySelectorAll<HTMLElement>(
    //     ".party-stepper .party-step",
    //   );
    //   elements.forEach((element, index) => {
    //     const stepId = stepIds[index];
    //     if (!stepId) return;
    //     const active = stepper.currentStep === stepId;
    //     const completed = stepper.completedSteps.includes(stepId);
    //     // Update the CSS classes
    //     element.classList.toggle("active", active);
    //     element.classList.toggle("completed", completed);
    //     // Update aria-current
    //     if (active) {
    //       element.setAttribute("aria-current", "step");
    //     } else {
    //       element.removeAttribute("aria-current");
    //     }
    //     // Update the step indicator
    //     const indicator = element.querySelector<HTMLElement>(
    //       ".party-step-indicator",
    //     );
    //     if (indicator) {
    //       if (completed && !active) {
    //         indicator.innerHTML = '<i class="bi bi-check-lg"></i>';
    //       } else {
    //         indicator.textContent = String(index + 1);
    //       }
    //     }
    //   });
    // }
    function moveNoOptionDown() {
        if (!noOption)
            return;
        noEscapeCount++;
        console.log("Moving No. Escape:", noEscapeCount);
        //noOption.style.transform = `translateY(${noEscapeCount * ESCAPE_DISTANCE}px)`;
        noOption.style.marginTop = `${noEscapeCount * ESCAPE_DISTANCE}px`;
        // if (noEscapeCount === 1 && noLabel) {
        //     noLabel.innerHTML = window.translate("starNoSeriously");
        // }
        // if (noEscapeCount === 2 && noLabel) {
        //     noLabel.innerHTML = window.translate("starNoCaughtMe");
        // }
    }
    function moveNoOptionUp() {
        if (!noOption)
            return;
        noEscapeCount--;
        console.log("Moving No. Escape:", noEscapeCount);
        //noOption.style.transform = `translateY(${noEscapeCount * ESCAPE_DISTANCE}px)`;
        noOption.style.marginTop = `${noEscapeCount * ESCAPE_DISTANCE}px`;
        //   if (noEscapeCount === 1 && noLabel) {
        //     noLabel.innerHTML = window.translate("starNoSeriously");
        //   }
        //   if (noEscapeCount === 1 && noLabel) {
        //     noLabel.innerHTML = window.translate("starNoCaughtMe");
        //   }
    }
    function moveNo() {
        if (!noDiv)
            return;
        if (direction == "down") {
            noEscapeCount++;
            noDiv.style.marginTop = `${noEscapeCount * ESCAPE_DISTANCE}px`;
            if (noEscapeCount >= MAX_NO_ESCAPES) {
                direction = "up";
            }
        }
        if (direction == "up") {
            noEscapeCount--;
            noDiv.style.marginTop = `${noEscapeCount * ESCAPE_DISTANCE}px`;
            if (noEscapeCount == 0) {
                direction = "down";
            }
        }
    }
    function updatePresentingState() {
        if (!presenting) {
            return;
        }
        const selectedStar = document.querySelector('input[name="star"]:checked');
        const isNo = selectedStar?.value === "no";
        if (isNo && presenting.value.trim().length === 0) {
            presenting.value = "";
        }
        presenting.disabled = isNo;
    }
    if (noDiv) {
        noDiv.addEventListener("mouseover", () => {
            moveNo();
        });
    }
    // if (noOption && noRadio) {
    // noOption.addEventListener("mouseenter", () => {
    //     console.log("Mouse entered No");
    //     if (direction == "down") {
    //         if (noEscapeCount >= MAX_NO_ESCAPES) {
    //             direction = "up";
    //           //return;
    //         }
    //         moveNoOptionDown();
    //     }
    //     if (direction == "up") {
    //         if (noEscapeCount == 0) {
    //           direction = "down";
    //         return;
    //       }
    //       moveNoOptionUp();
    //     }
    // });
    // noOption.addEventListener(
    //     "touchstart",
    //     (event: TouchEvent) => {
    //         if (direction = "down") {
    //             if (noEscapeCount >= MAX_NO_ESCAPES) {
    //                 direction = "up";
    //               //return;
    //             }
    //             event.preventDefault();
    //             moveNoOptionDown();
    //         }
    //         if ((direction = "up")) {
    //             if (noEscapeCount == 0) {
    //                 direction = "down";
    //             //return;
    //           }
    //           event.preventDefault();
    //           moveNoOptionUp();
    //         }
    //     },
    //     { passive: false },
    // );
    // }
    starRadios.forEach((radio) => {
        radio.addEventListener("change", updatePresentingState);
    });
    if (form1) {
        //console.debug("form 1");
        form1.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearFeedback("starFeedback", "starFeedbackText");
            // ========================================================
            // QUESTION 1
            // ========================================================
            const selectedStar = document.querySelector('input[name="star"]:checked');
            if (!selectedStar) {
                showFeedback("starFeedback", "starFeedbackText", "danger", "starSelectionRequired");
                return;
            }
            //console.debug("selected" + selectedStar?.value);
            // ========================================================
            // QUESTION 2
            // ========================================================
            const presenting = document.getElementById("presenting");
            const presentingText = selectedStar?.value === "no" ? "" : presenting?.value.trim();
            // ========================================================
            // SEND TO SERVER
            // ========================================================
            try {
                submitForm1.disabled = true;
                const response = await fetch("/star", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        star: selectedStar.value,
                        presenting: presentingText,
                        whichForm: "1",
                    }),
                });
                const result = (await response.json());
                if (!response.ok || !result.success) {
                    showFeedback("starFeedback", "starFeedbackText", "danger", result.key ?? "starSaveError");
                    return;
                }
                //if in panel 2, whether guest is in guided mode or not
                //always move to panel 3 after submission
                //pageNavigation will take care of the url
                window.location.href = "/" + window.btnNav;
                //   showFeedback(
                //     "starFeedback",
                //     "starFeedbackText",
                //     "success",
                //     "starSaved",
                //   );
                //"star?goto=3";
                return;
            }
            catch (error) {
                console.error("Error saving Star information:", error);
                showFeedback("starFeedback", "starFeedbackText", "danger", "starSaveError");
            }
            finally {
                submitForm1.disabled = false;
            }
        });
    }
    if (form2) {
        //console.debug("form 1");
        form2.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearFeedback("starMusicFeedback", "starMusicFeedbackText");
            // ========================================================
            // QUESTION 3
            // ========================================================
            const songs = [];
            for (let i = 1; i <= 7; i++) {
                const input = document.getElementById(`song${i}`);
                songs.push(input.value.trim());
            }
            // ========================================================
            // SEND TO SERVER
            // ========================================================
            try {
                submitForm2.disabled = true;
                const response = await fetch("/star", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        songs,
                        whichForm: "2",
                    }),
                });
                const result = (await response.json());
                if (!response.ok || !result.success) {
                    showFeedback("starMusicFeedback", "starMusicFeedbackText", "danger", result.key ?? "starSaveError");
                    return;
                }
                // const resp = await fetch("/api/stepper", {
                //   method: "POST",
                //   headers: {
                //     "Content-Type": "application/json",
                //   },
                //   body: JSON.stringify({
                //     currentStep,
                //     completedSteps,
                //   }),
                // });
                // if (!response.ok) {
                //   throw new Error("Failed to update Stepper");
                // }
                // const result: StepperResponse = await response.json();
                //refreshStepper(result.stepper);
                // if(result.finished === true && )
                // isStepCompleted(req);
                //if guest is in guided mode (not finished), next url is determined by pageNavigation
                //if guest is not in guided mode (finished), we simply show the feedback
                const nextUrl = window.btnNav;
                if (nextUrl == "finish") {
                    window.location.href = "/" + window.btnNav;
                }
                else {
                    showFeedback("starMusicFeedback", "starMusicFeedbackText", "success", "starSaved");
                }
                //console.debug("Stepper updated:", result.stepper);
            }
            catch (error) {
                console.error("Error saving Star information:", error);
                showFeedback("starMusicFeedback", "starMusicFeedbackText", "danger", "starSaveError");
            }
            finally {
                submitForm2.disabled = false;
            }
        });
    }
});
