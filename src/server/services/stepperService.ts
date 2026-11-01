import type { Request } from "express";
import type { StepId, StepperState } from "../models/stepTracker";

function initializeStepper(req: Request): StepperState {
  if (!req.session.stepper) {
    req.session.stepper = {
      currentStep: "welcome",
      completedSteps: [],
    };
  }

  return req.session.stepper;
}

export function getStepper(req: Request): StepperState {
  return initializeStepper(req);
}

export function setCurrentStep(req: Request, step: StepId): void {
  const stepper = initializeStepper(req);
    stepper.currentStep = step;
    
    if (step === "end") {
      completeStep(req, step);
    }
}

export function completeStep(req: Request, step: StepId): void {
  const stepper = initializeStepper(req);

  if (!stepper.completedSteps.includes(step)) {
    stepper.completedSteps.push(step);
  }
}

export function resetStepper(req: Request): void {
  req.session.stepper = {
    currentStep: "welcome",
    completedSteps: [],
  };
}

// import type { Request } from "express";

// import {
//   Stepper,
//   type StepId,
//   type StepperState,
// } from "../models/stepTracker.js";

// const stepper: Stepper = {
//   currentStep: 0,
//   steps: [
//     {
//       id: "welcome",
//       label: "Welcome",
//       url: "/",
//       completed: false,
//       enabled: true,
//     },
//     {
//       id: "party",
//       label: "The Party",
//       url: "/party",
//       completed: false,
//       enabled: true,
//     },
//     {
//       id: "star",
//       label: "Be a Star 67",
//       url: "/star",
//       completed: false,
//       enabled: true,
//     },
//     {
//       id: "rsvp",
//       label: "RSVP",
//       url: "/rsvp",
//       completed: false,
//       enabled: true,
//     },
//     {
//       id: "sixties",
//       label: "That's 60s",
//       url: "/sixties",
//       completed: false,
//       enabled: true,
//     },
//     {
//       id: "sevens",
//       label: "That's 7s",
//       url: "/sevens",
//       completed: false,
//       enabled: true,
//     },
//     { id: "end", label: "End", url: "/end", completed: false, enabled: true },
//   ],
// };

// export function setCurrentStep(req: Request): StepperState {
//   const stepper = getStepper(req);

//   //   stepper.currentStep = step;

//   return stepper;
// }

// export function isStepCompleted(req: Request, step: StepId): boolean {
//   return getStepper(req).completedSteps.includes(step);
// }

// export function getStepper(req: Request): StepperState {
//   //   if (!req.session.stepper) {
//   //     req.session.stepper = createStepperState();
//   //   }

//   //   if (!stepper) stepper = createStepperState();

//   // return req.session.stepper;
//   return {
//     currentStep: "welcome",
//     completedSteps: [],
//   };
// }
