import type { Request } from "express";

import {
  STEPS,
  createStepperState,
  GuestProgress,
  type StepId,
  type StepperState,
} from "../models/stepper";

export function setCurrentStep(req: Request): StepperState {
  const stepper = getStepper(req);

//   stepper.currentStep = step;

  return stepper;
}

export function isStepCompleted(req: Request, step: StepId): boolean {
  return getStepper(req).completedSteps.includes(step);
}

export function getStepper(req: Request): StepperState {
//   if (!req.session.stepper) {
//     req.session.stepper = createStepperState();
//   }

//   if (!stepper) stepper = createStepperState();

  // return req.session.stepper;
    return {
        currentStep: "welcome",
        completedSteps: []
  };
}