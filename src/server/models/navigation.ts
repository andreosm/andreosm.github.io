/*
3- navigation
    3.1 nav
        3.1.1 navbaritem
    3.2 logout
        3.2.1 navbaritem
    3.3 active
      3.3.1 navbaritem
    3.3 next
      3.3.1 ButtonItem
    3.4 back
      3.4.1 ButtonItem
    
      3.5 NavBarItem
        3.5.1 is visible
        3.5.2 PageName | ""
    
    3.6 ButtonItem
        3.6.1 is visible
        3.6.2 url
        3.6.3 panel
        3.6.4 action
*/
// import { Guest } from "./guest";
import { StepTracker, StepperState, STEPS } from "./stepTracker";
import { PageName, PanelNumber, PageState } from "./page.js";
import { GuestState } from "./guest.js";

export type ButtonAction = "navigate" | "submit" | "toggle" | "submit-navigate" | "none";

export interface NavBarItem {
  visible: boolean;
  active: string;
}

export interface ButtonItem {
  visible: boolean;
  url: string;
  panel: PanelNumber;
  action: ButtonAction;
}

export interface SubmitButton { 
  enabled: boolean;
}

export interface PageNavigationState {
  step: string;
  stepper: StepperState | null;
  nav: NavigationState;
  guest: GuestState;
  steps: typeof STEPS;
  page: PageState;
}

export interface NavigationState {
  navBar: NavBarItem | null;
  logout: NavBarItem | null;
  next: ButtonItem | null;
  back: ButtonItem | null;
  submit: SubmitButton | null;
  active: NavBarItem | null;
}

// export interface GuestParams2 {
//   identified: boolean;
//   showLogout: NavBarParams;
//     showOthers: boolean;
//     pageParams: PageParams;
// }






// export interface NavBarParams {
//   logout: NavBarItem;
//   misc: NavBarItem;
//   active: NavBarItem;
// }



// export interface NavBarActiveItem { 
//     itemName: PageName
// }



// export interface NavBarParams {
//   item: NavBarItem;
// }





// export interface StepperState {
//   currentStep: StepId;
//   completedSteps: StepId[];
// }

// export interface PitStopState { 
//     currentPage: PageName;
//     activeMenuItem: string;
//     currentStep: StepId;
// }

// export interface GuestProgress {
//   identified: boolean;
//   completedSteps: StepId[];
// }



// export interface StepView extends StepDefinition {
//   active: boolean;
//   completed: boolean;
// }




// export interface NavButtons {
//   showNext: boolean;
//   showNextLink: boolean;
//   showBack: boolean;
//   showRsvp: boolean;
//   showStar: boolean;
//   showLogout: boolean;
//   nextUrl: string | null;
//   backUrl: string | null;
// }









// export interface FlowDefinition {
//   id: StepId;
//   url: string;
// }

// export const FLOW: readonly FlowDefinition[] = [
//   { id: "welcome", url: "/" },
//   { id: "party", url: "/party" },
//   { id: "star", url: "/star?panel=1" },
//   { id: "rsvp", url: "/rsvp" },
//   { id: "thats60s", url: "/star?panel=2" },
//   { id: "thats7s", url: "/star?panel=3" },
//   { id: "end", url: "/finish" },
// ];

  // guestParams: GuestParams;
  // pageParms: PageParams;
  // showNavbar: boolean;
  // showLogout: boolean;

  //   showNavbar: boolean;
  //     showLogout: boolean;
  // pitStop: PitStopState;
  //   guidedMode: boolean;
  //   back: NavigationButton;
  //   next: NavigationButton;
  //   navButtons: NavButtons;
  //   steps: StepView[];
  //   stepper: StepperState;


// export const STEPS: readonly StepDefinition[] = [
//   { id: "welcome", label: "Welcome", url: "/" },
//   { id: "party", label: "The Party", url: "/party" },
//   { id: "star", label: "Be a Star", url: "/star?panel=1" },
//   { id: "rsvp", label: "RSVP", url: "/rsvp" },
//   { id: "thats60s", label: "That's 60s", url: "/star?panel=2" },
//   { id: "thats7s", label: "That's 7s", url: "/star?panel=3" },
//   { id: "end", label: "End", url: "/finish" },
// ];

// export const RESTRICTED_PATHS = new Set([
//   "/party",
//   "/star",
//   "/rsvp",
//   "/finish",
// ]);

// export function isRestrictedPage(path: string): boolean {
//   const normalized = path.replace(/\/+$/, "") || "/";
//   return RESTRICTED_PATHS.has(normalized);
// }

// export function isProcessComplete(progress: GuestProgress): boolean {
//   return (
//     progress.identified &&
//     STEPS.every((step) => progress.completedSteps.includes(step.id))
//   );
// }

// export function resolveStarPanel(value: unknown): PanelNumber {
//   const panel = Number(value);
//   return panel === 2 || panel === 3 ? panel : 1;
// }

// export function getStepFromPage(path: string, panel: PanelNumber = 1): StepId {
//   switch (path) {
//     case "/":
//     case "/index":
//       return "welcome";
//     case "/party":
//       return "party";
//     case "/rsvp":
//       return "rsvp";
//     case "/finish":
//       return "end";
//     case "/star":
//       return panel === 1 ? "star" : panel === 2 ? "thats60s" : "thats7s";
//     default:
//       return "welcome";
//   }
// }


// export function getStepIndex(id: StepId): number {
//   return STEPS.findIndex((step) => step.id === id);
// }







