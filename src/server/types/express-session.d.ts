import "express-session";

import type { Guest } from "../models/guest";
import type { Language } from "../models/language";
import type { StepperState } from "../models/stepTracker";
import { PageNavigationState } from "../models/navigation.js";

declare module "express-session" {
  interface SessionData {
    guest: Guest;
    pendingGuest?: Guest;
    returnTo?: string;
    navigation?: PageNavigationState;
    stepper?: StepperState;
  }
}

export {};

declare module "express-session" {
  interface SessionData {
    stepper?: StepperState;
  }
}