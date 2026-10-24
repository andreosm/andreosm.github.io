/*
4- stepper
    4.1 current step
        4.1.1 StepId
    4.2 completed steps
        4.2.1 StepId

    4.3 StepId
    4.4 STEPS
*/
// import { PageName, PanelNumber } from "./pageTracker.js";

export type StepId = (typeof STEPS)[number]["id"];

export const STEPS = [
  { id: "welcome", label: "Welcome", translationKey: "stepWelcome" },
  { id: "party", label: "The Party", translationKey: "stepParty" },
  { id: "star", label: "Be a Star 67", translationKey: "stepStar" },
  { id: "rsvp", label: "RSVP", translationKey: "stepRsvp" },
  { id: "thats60s", label: "That's 60s", translationKey: "step60s" },
  { id: "thats7s", label: "That's 7s", translationKey: "step7s" },
  { id: "end", label: "Finish", translationKey: "stepEnd" },
] as const;

export interface StepperState {
  currentStep: StepId;
  completedSteps: StepId[];
}

export interface StepTracker { //former PageTracker
  stepId: StepId;
  stepLabel: string;
  translationKey: string;
  stepper: StepperState;
  //   nextUrl: PageName;
  //   nextUrlParm: string;
  //   backUrl: PageName;
  //   backUrlParm: string;
  //   action: NextAction;
  // stepper: StepperState;
}









// export type StepId =
//   | "welcome"
//   | "party"
//   | "star"
//   | "rsvp"
//   | "thats60s"
//   | "thats7s"
//   | "end";

// export type StepTrackerId =
//   | "welcome"
//   | "party"
//   | "star"
//   | "rsvp"
//   | "thats60s"
//   | "thats7s"
//   | "end";

// export interface StepDefinition {
//   id: StepId;
//   label: string;
//   translationKey: string;
// }

// export interface Stepper {
//   currentStep: number;
//   steps: StepperStep[];
// }

// export interface StepperState {
//   currentStep: StepId;
//   completedSteps: StepId[];
// }

// export interface StepperStep {
//   id: string;
//   label: string;
//   url: string;
//   completed: boolean;
//   enabled: boolean;
// }
