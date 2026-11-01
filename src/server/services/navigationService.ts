import type { Request } from "express";

// import {
//   NavigationState,
//   NavigationButton,
//   NavBarItem,
//   NextAction,
// } from "../models/navigation.js";

// import { GuestParams } from "../models/guest.js";

// import {
//   PanelNumber,
//   PageName,
//   PageTrackerDefinition,
//   PageParams,
// } from "../models/pageTracker.js";

// import { STEPS } from "../models/stepTracker.js";

// import type { StepId, StepperState } from "../models/stepTracker";

// import {
//   getStepper,
//   setCurrentStep,
//   completeStep,
//   resetStepper,
// } from "./stepperService.js";

// export interface NavigationParams {
//   guest: Guest;
//   trackers: Tracker[];
// }

// import {
//   StepTrackerId,
// } from "../models/stepTracker.js";

// export type FlowId =
//   | "welcome"
//   | "party"
//   | "star"
//   | "rsvp"
//   | "thats60s"
//   | "thats7s"
//   | "end";

//   export interface Flow {
//     id: FlowId;
//     label: string;
//     url: string;
//   }

// export const FLOW: Flow[] = [
//   { id: "welcome", label: "Welcome", url: "/index" },
//   { id: "party", label: "The Party", url: "/party" },
//   { id: "star", label: "Be a Star", url: "/star?panel=1" },
//   { id: "rsvp", label: "RSVP", url: "/rsvp" },
//   { id: "thats60s", label: "That's 60s", url: "/star?panel=2" },
//   { id: "thats7s", label: "That's 7s", url: "/star?panel=3" },
//   { id: "end", label: "End", url: "/finish-line" },
// ];

import { PageState } from "../models/page.js";
import { NavigationState } from "../models/navigation.js";

import { GuestState } from "../models/guest.js";


import { StepId, StepTracker, StepperState } from "../models/stepTracker"; 

export interface PageNavigationDefinition {
  stepId: StepId;
  stepLabel: string;
  translationKey: string;
  pageState: PageState;
  navState: NavigationState;

  // completedSteps: StepId[];
}

export const NAVFLOW: readonly PageNavigationDefinition[] = [
  {
    stepId: "welcome",
    stepLabel: "Welcome",
    translationKey: "step1",

    pageState: {
      pageName: "index",
      panelNumber: 0,
    },

    navState: {
      navBar: {
        visible: false,
        active: "",
      },
      logout: {
        visible: false,
        active: "",
      },
      next: {
        visible: true,
        url: "/party",
        panel: 0,
        action: "navigate",
      },
      back: {
        visible: false,
        url: "",
        panel: 0,
        action: "none",
      },
      submit: {
        enabled: true,
      },
      active: {
        visible: false,
        active: "",
      },
    },
  },
  {
    stepId: "party",
    stepLabel: "Party",
    translationKey: "step2",

    pageState: {
      pageName: "party",
      panelNumber: 0,
    },

    navState: {
      navBar: {
        visible: false,
        active: "",
      },
      logout: {
        visible: true,
        active: "",
      },
      next: {
        visible: true,
        url: "/star?sp=1",
        panel: 1,
        action: "navigate",
      },
      back: {
        visible: true,
        url: "/index",
        panel: 0,
        action: "navigate",
      },
      submit: {
        enabled: true,
      },
      active: {
        visible: false,
        active: "",
      },
    },
  },
  {
    stepId: "star",
    stepLabel: "Star",
    translationKey: "step3",

    pageState: {
      pageName: "star",
      panelNumber: 1,
    },

    navState: {
      navBar: {
        visible: false,
        active: "",
      },
      logout: {
        visible: true,
        active: "",
      },
      next: {
        visible: true,
        url: "/rsvp",
        panel: 0,
        action: "navigate",
      },
      back: {
        visible: true,
        url: "/party",
        panel: 0,
        action: "navigate",
      },
      submit: {
        enabled: true,
      },
      active: {
        visible: false,
        active: "",
      },
    },
  },
  {
    stepId: "rsvp",
    stepLabel: "RSVP",
    translationKey: "step4",

    pageState: {
      pageName: "rsvp",
      panelNumber: 0,
    },

    navState: {
      navBar: {
        visible: false,
        active: "",
      },
      logout: {
        visible: true,
        active: "",
      },
      next: {
        visible: true,
        url: "star?sp=2",
        panel: 0,
        action: "toggle",
      },
      back: {
        visible: true,
        url: "star?sp=1",
        panel: 1,
        action: "navigate",
      },
      submit: {
        enabled: true,
      },
      active: {
        visible: false,
        active: "",
      },
    },
  },
  {
    stepId: "thats60s",
    stepLabel: "That's 60",
    translationKey: "step5",

    pageState: {
      pageName: "star",
      panelNumber: 2,
    },

    navState: {
      navBar: {
        visible: false,
        active: "",
      },
      logout: {
        visible: true,
        active: "",
      },
      next: {
        visible: true,
        url: "star?sp=3",
        panel: 3,
        action: "toggle",
      },
      back: {
        visible: true,
        url: "/rsvp",
        panel: 0,
        action: "navigate",
      },
      submit: {
        enabled: true,
      },
      active: {
        visible: false,
        active: "",
      },
    },
  },
  {
    stepId: "thats7s",
    stepLabel: "That's 7",
    translationKey: "step6",

    pageState: {
      pageName: "star",
      panelNumber: 3,
    },

    navState: {
      navBar: {
        visible: false,
        active: "",
      },
      logout: {
        visible: true,
        active: "",
      },
      next: {
        visible: true,
        url: "finish",
        panel: 0,
        action: "navigate",
      },
      back: {
        visible: true,
        url: "/star?sp=2",
        panel: 2,
        action: "navigate",
      },
      submit: {
        enabled: true,
      },
      active: {
        visible: false,
        active: "",
      },
    },
  },
  {
    stepId: "end",
    stepLabel: "End",
    translationKey: "step7",

    pageState: {
      pageName: "finish",
      panelNumber: 0,
    },

    navState: {
      navBar: {
        visible: true,
        active: "",
      },
      logout: {
        visible: true,
        active: "",
      },
      next: {
        visible: false,
        url: "",
        panel: 0,
        action: "none",
      },
      back: {
        visible: false,
        url: "",
        panel: 0,
        action: "none",
      },
      submit: {
        enabled: true,
      },
      active: {
        visible: true,
        active: "",
      },
    },
  },
];

// function button(
//   visible: boolean,
//   url: string | null = null,
//   args: string | null = null,
//   action: NextAction = "none",
// ): NavigationButton {
//   if (args) url = url + args;
//   return { visible, url, action };
// }

// export function getPageNavigationFlowIndex(tracker: PageTrackerDefinition): number {
//   return NAVFLOW.findIndex((flow) => flow.stepId === tracker.stepId);
// }

// function getPageTrackerDefinition(pageName: PageName, panel: PanelNumber = 0,): PageTrackerDefinition {

//   const tracker = NAVFLOW.find(
//     (p) => p.pageName === pageName && p.panelNumber === panel,
//   );

//   if (!tracker) return NAVFLOW[0];

//   return tracker;
// }

// export function getNavigationState(req: Request, guestParams: GuestParams, ): NavigationState {
  // const identified = guestParams.identified;
  // const complete = guestParams.finished; // isProcessComplete(progress);

  // const tracker = getPageTrackerDefinition(
  //   guestParams.pageParams.pageName,
  //   guestParams.pageParams.panelNumber,
  // );

  // console.log("tracker: " + tracker.pageName + "|" + tracker.panelNumber + "|" + identified + "|" + complete);

  // const currentStep = getStepFromPage(guestParams.pageParams.pageName);

  // const displayGuest = guestParams.displayGuest;

  // console.debug("is it completed" + complete);

  // console.debug("guest parms: " + guestParams.pageParams.pageName);

  // const logout: NavBarItem = {
  //   visible: identified,
  //   activeItem: "",
  // };

  // const misc: NavBarItem = {
  //   visible: complete,
  //   activeItem: "",
  // };

  // const active: NavBarItem = {
  //   visible: true,
  //   activeItem: guestParams.pageParams.pageName,
  // };

  // const guidedMode = !complete;

  // // const index = getStepIndex(currentStep);
  // const index = getFlowIndex(tracker!);

  //console.debug("the index is: " + index);

  // const previous =
  //   index == 0 ? null : NAVFLOW[index]?.backUrl ? NAVFLOW[index] : null;
  // const next =
  //   index < NAVFLOW.length - 1
  //     ? NAVFLOW[index]?.nextUrl
  //       ? NAVFLOW[index]
  //       : null
  //     : null;

  // // let stepper: StepperState = NAVFLOW[index].stepper;

  // let backButton: NavigationButton;
  // let nextButton: NavigationButton;

  // if (guidedMode) {
  //   backButton = button(
  //     previous != null,
  //     previous?.backUrl,
  //     previous?.backUrlParm ?? null,
  //     previous?.action,
  //   );

  //   //const submitBeforeNext: StepTrackerId[] = ["rsvp", "thats60s", "thats7s"];

  //   nextButton = button(
  //     next != null,
  //     next?.nextUrl,
  //     next?.nextUrlParm ?? null,
  //     next?.action,
  //   );
  // } else {
  //   backButton = button(false);
  //   nextButton = button(false);
  // }

  // res.render("party", {
  //   stepper: getStepper(req),
  //   steps: STEPS,
  // });

  // if (guidedMode) {
    // backButton = button(
    //   previous !== null,
    //   previous?.url ?? null,
    //   previous ? "navigate" : "none",
    // );
    // RSVP and the two later Star panels save before advancing.
    // nextButton = button(
    //   next !== null,
    //   next?.url ?? null,
    //   !next
    //     ? "none"
    //     : submitBeforeNext.includes(currentStep)
    //       ? "submit-navigate"
    //       : "navigate",
    // );
  // } else {
    // backButton = button(false);

    // switch (currentStep) {
    //   case "welcome":
    //     nextButton = button(true, "/party", "navigate");
    //     break;

    //   case "rsvp":
    //   case "thats7s":
    //     // Save and show feedback without leaving the page.
    //     nextButton = button(true, null, "submit");
    //     break;

    //   case "star":
    //     nextButton = button(true, "/star?panel=2", "navigate");
    //     break;

    //   case "thats60s":
    //     nextButton = button(true, "/star?panel=3", "submit-navigate");
    //     break;

    //   default:
    //     nextButton = button(false);
    // }
  // }

  // console.debug(backButton);
  // console.debug(nextButton);

  // const steps: StepView[] = STEPS.map((step) => ({
  //   ...step,
  //   active: step.id === currentStep,
  //   completed: complete || progress.completedSteps.includes(step.id),
  // }));

  // const navButtons: NavButtons = {
  //   showNext: nextButton.visible,
  //   showNextLink: nextButton.action === "navigate",
  //   showBack: backButton.visible,
  //   showRsvp: complete,
  //   showStar: complete,
  //   showLogout: false,
  //   nextUrl: nextButton.url,
  //   backUrl: backButton.url,
  // };
  // console.debug(tracker);
  // console.debug(displayGuest);

  // setCurrentStep(req, NAVFLOW[index].stepId);
  // console.debug("iteration " + index);

  // for (let i = 0; i <= index; i++) {
  //   completeStep(req, NAVFLOW[i].stepId);
  // }

  // return {
  //   logout,
  //   misc,
  //   active,
  //   identified,
  //   finished: complete,
  //   back: backButton,
  //   next: nextButton,
  //   tracker,
  //   stepper: getStepper(req),
  //   displayGuest: req.session.guest!,

  //   //   guestParams,
  //   //   pageParms,

  //   //   showLogout: identified,

  //   //   //   pitStop,
  //   //   // guidedMode,

  //   //   navButtons,
  //   //   steps,
  //   //   stepper: {
  //   //     currentStep,
  //   //     completedSteps: steps
  //   //       .filter((step) => step.completed)
  //   //       .map((step) => step.id),
  //   //   },
  // };
// }

// export function getNavigationState(
//   progress: GuestProgress,
//   currentStep: StepId,
// ): NavigationState {
//   const complete = isProcessComplete(progress);
//   const guidedMode = !complete;
//   const index = getStepIndex(currentStep);

//   const previous = index > 0 ? STEPS[index - 1] : null;
//   const next = index < STEPS.length - 1 ? STEPS[index + 1] : null;

//   let backButton: NavigationButton;
//   let nextButton: NavigationButton;

//   if (guidedMode) {
//     backButton = button(
//       previous !== null,
//       previous?.url ?? null,
//       previous ? "navigate" : "none",
//     );

//     // RSVP and the two later Star panels save before advancing.
//     const submitBeforeNext: StepId[] = ["rsvp", "thats60s", "thats7s"];

//     nextButton = button(
//       next !== null,
//       next?.url ?? null,
//       !next
//         ? "none"
//         : submitBeforeNext.includes(currentStep)
//           ? "submit-navigate"
//           : "navigate",
//     );
//   } else {
//     backButton = button(false);

//     switch (currentStep) {
//       case "rsvp":
//       case "thats7s":
//         // Save and show feedback without leaving the page.
//         nextButton = button(true, null, "submit");
//         break;

//       case "star":
//         nextButton = button(true, "/star?panel=2", "navigate");
//         break;

//       case "thats60s":
//         nextButton = button(true, "/star?panel=3", "submit-navigate");
//         break;

//       default:
//         nextButton = button(false);
//     }
//   }

//   const steps: StepView[] = STEPS.map((step) => ({
//     ...step,
//     active: step.id === currentStep,
//     completed: complete || progress.completedSteps.includes(step.id),
//   }));

//   const navButtons: NavButtons = {
//     showNext: nextButton.visible,
//     showNextLink: nextButton.action === "navigate",
//     showBack: backButton.visible,
//     showRsvp: complete,
//     showStar: complete,
//     showLogout: progress.identified,
//     nextUrl: nextButton.url,
//     backUrl: backButton.url,
//   };

//   return {
//     showNavbar: complete,
//     guidedMode,
//     back: backButton,
//     next: nextButton,
//     navButtons,
//     steps,
//     stepper: {
//       currentStep,
//       completedSteps: steps
//         .filter((step) => step.completed)
//         .map((step) => step.id),
//     },
//   };
// }
