import "express-session";

import type { Guest } from "../models/guest";
// import type { NavButtons } from "../models/navButtons";
import type { Language } from "../models/language";
// import type { StepperState } from "../models/stepper";
import { NavigationState } from "../models/navigation";

declare module "express-session" {
  interface SessionData {
    guest?: Guest;
    pendingGuest?: Guest;
    returnTo?: string;
    navigation?: NavigationState;
    // navButtons?: NavButtons;
    // effectiveLanguage: Language;
    // stepper?: StepperState;
    // stepTracker?: StepperState;
  }
}

export {};