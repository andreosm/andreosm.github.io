interface StepperState {
  currentStep: string;
  completedSteps: string[];
}

export type StepId =
  | "welcome"
  | "party"
  | "star"
  | "rsvp"
  | "thats60s"
  | "thats7s"
  | "end";

  export interface StepDefinition {
    id: StepId;
    label: string;
    translationKey: string;
  }

  export const STEPS: StepDefinition[] = [
    { id: "welcome", label: "Welcome", translationKey: "stepWelcome" },
    { id: "party", label: "The Party", translationKey: "stepParty" },
    { id: "star", label: "Be a Star 67", translationKey: "stepStar" },
    { id: "rsvp", label: "RSVP", translationKey: "stepRsvp" },
    { id: "thats60s", label: "That's 60s", translationKey: "step60s" },
    { id: "thats7s", label: "That's 7s", translationKey: "step7s" },
    { id: "end", label: "End", translationKey: "stepEnd" },
  ];

  export function createStepperState(): StepperState {
    return {
      currentStep: "welcome",
      completedSteps: [],
    };
  }

  export function getStepper(

    stepper: StepperState,
  ): StepperState {
    // if (!req.session.stepper) {
    //   req.session.stepper = createStepperState();
    // }

    if (!stepper) stepper = createStepperState();

    // return req.session.stepper;
    return stepper;
  }

async function updateStepper(
    currentStep: string,
    completedSteps: string[],
): Promise<void> {
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

function refreshStepper(stepper: StepperState): void {
  document.querySelectorAll<HTMLElement>(".stepper-step").forEach((element) => {
    const stepId = element.dataset.stepId;

    element.classList.toggle("active", stepId === stepper.currentStep);

    element.classList.toggle(
      "completed",
      stepper.completedSteps.includes(stepId ?? ""),
    );
  });
}

