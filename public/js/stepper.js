"use strict";
async function updateStepper(currentStep, completedSteps) {
    const response = await fetch("/api/stepper", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
            currentStep: currentStep,
            completedSteps: completedSteps,
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to update Stepper");
    }
    const result = await response.json();
    console.log("Stepper updated:", result.stepper);
}
function refreshStepper(stepper) {
    document.querySelectorAll(".stepper-step").forEach((element) => {
        const stepId = element.dataset.stepId;
        element.classList.toggle("active", stepId === stepper.currentStep);
        element.classList.toggle("completed", stepper.completedSteps.includes(stepId ?? ""));
    });
}
