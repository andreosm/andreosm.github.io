import {
  NavigationState,
  NavigationButton,
  NavBarItem,
  NextAction,
} from "../models/navigation.js";

import { 
  GuestParams,
  DisplayGuest,
  GuestProgress,
} from "../models/guest.js";

import {
  PanelNumber,
  PageName,
  PageTrackerDefinition,
} from "../models/pageTracker.js";

import {
  StepTrackerId,
} from "../models/stepTracker.js";

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

  

const NAVFLOW: readonly PageTrackerDefinition[] = [
  {
    stepId: "welcome",
    stepLabel: "Welcome",
    translationKey: "step1",
    pageName: "index",
    panelNumber: 0,
    nextUrl: "party",
    nextUrlParm: "",
    backUrl: "",
    backUrlParm: "",
    action: "navigate",
  },
  {
    stepId: "party",
    stepLabel: "Party",
    translationKey: "step2",
    pageName: "party",
    panelNumber: 0,
    nextUrl: "star",
    nextUrlParm: "?sp=1",
    backUrl: "index",
    backUrlParm: "",
    action: "navigate",
  },
  {
    stepId: "star",
    stepLabel: "Star",
    translationKey: "step3",
    pageName: "star",
    panelNumber: 1,
    nextUrl: "rsvp",
    nextUrlParm: "",
    backUrl: "party",
    backUrlParm: "",
    action: "navigate",
  },
  {
    stepId: "rsvp",
    stepLabel: "RSVP",
    translationKey: "step4",
    pageName: "rsvp",
    panelNumber: 0,
    nextUrl: "star",
    nextUrlParm: "?sp=2",
    backUrl: "star",
    backUrlParm: "?sp=1",
    action: "toggle",
  },
  {
    stepId: "thats60s",
    stepLabel: "That's 60",
    translationKey: "step5",
    pageName: "star",
    panelNumber: 2,
    nextUrl: "star",
    nextUrlParm: "?sp=3",
    backUrl: "star",
    backUrlParm: "?sp=2",
    action: "submit-navigate",
  },
  {
    stepId: "thats7s",
    stepLabel: "That's 7",
    translationKey: "step6",
    pageName: "star",
    panelNumber: 3,
    nextUrl: "finish",
    nextUrlParm: "",
    backUrl: "",
    backUrlParm: "",
    action: "submit-navigate",
  },
  {
    stepId: "end",
    stepLabel: "End",
    translationKey: "step7",
    pageName: "finish",
    panelNumber: 0,
    nextUrl: "",
    nextUrlParm: "",
    backUrl: "",
    backUrlParm: "",
    action: "none",
  },
];
  


// const FLOW: readonly StepDefinition[] = [
//   { id: "welcome", label: "Welcome", url: "/" },
//   { id: "party", label: "The Party", url: "/party" },
//   { id: "star", label: "Be a Star", url: "/star?panel=1" },
//   { id: "rsvp", label: "RSVP", url: "/rsvp" },
//   { id: "thats60s", label: "That's 60s", url: "/star?panel=2" },
//   { id: "thats7s", label: "That's 7s", url: "/star?panel=3" },
//   { id: "end", label: "End", url: "/finish" },
// ];

function button(
  visible: boolean,
  url: string | null = null,
  args: string | null = null,
  action: NextAction = "none",
): NavigationButton {
  if (args) url = url + args;
  return { visible, url, action };
}

function getFlowIndex(tracker: PageTrackerDefinition): number {
  return NAVFLOW.findIndex((flow) => flow.stepId === tracker.stepId);
}

function getPageTrackerDefinition(
  pageName: PageName,
  panel: PanelNumber = 0,
): PageTrackerDefinition {

  //  for (let i = 0; i < NAVFLOW.length; i++) {
  //    console.debug("for index: " + i + " we have this flow: " + NAVFLOW[i].translationKey)     
  //  }

  const tracker = NAVFLOW.find((p) => p.pageName === pageName && p.panelNumber === panel);

  if (!tracker) return NAVFLOW[0];

  return tracker;
}

export function getNavigationState(
  guestParams: GuestParams,
  // progress: GuestProgress,
  //     currentStep: StepId,
): NavigationState {
  const identified = guestParams.identified;
  const complete = guestParams.finished; // isProcessComplete(progress);
  // const currentStep = getStepFromPage(guestParams.pageParams.pageName);
  const tracker = getPageTrackerDefinition(
    guestParams.pageParams.pageName,
    guestParams.pageParams.panelNumber,
  );

  const displayGuest = guestParams.displayGuest!;

  console.debug("i am at service");
  
  console.debug("guest parms: " + guestParams.pageParams.pageName);

  const logout: NavBarItem = {
    visible: identified,
    activeItem: "",
  };

  const misc: NavBarItem = {
    visible: complete,
    activeItem: "",
  };

  const active: NavBarItem = {
    visible: true,
    activeItem: guestParams.pageParams.pageName,
  };

  const guidedMode = !complete;

  // const index = getStepIndex(currentStep);
  const index = getFlowIndex(tracker!);

  console.debug("the index is: " + index);

  // const previous = index > 0 ? NAVFLOW[index - 1] : null;
  // const next = index < NAVFLOW.length - 1 ? NAVFLOW[index + 1] : null;
  const previous = index == 0 ? null : (NAVFLOW[index]?.backUrl ? NAVFLOW[index] : null);
  const next = index < NAVFLOW.length - 1 ? (NAVFLOW[index]?.nextUrl ? NAVFLOW[index] : null) : null

  //const pitStop = getPitStopFromPage(pageParms.pageName, pageParms.panelNumber);
  console.debug("previous:" + previous?.backUrl + previous?.backUrlParm);
  console.debug("next:" + next?.nextUrl + next?.nextUrlParm);


  let backButton: NavigationButton;
  let nextButton: NavigationButton;

  if (guidedMode) {
    backButton = button(
      previous != null,
      previous?.backUrl,
      previous?.backUrlParm ?? null,
      previous?.action,
    );

    const submitBeforeNext: StepTrackerId[] = ["rsvp", "thats60s", "thats7s"];

    nextButton = button(
      next != null,
      next?.nextUrl,
      next?.nextUrlParm ?? null,
      next?.action,
    );
  } else { 
    backButton = button(false);
    nextButton = button(false);
  }

  if (guidedMode) {
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
    
  } else {
    backButton = button(false);

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
  }

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
  console.debug(tracker);
  console.debug(displayGuest);

  return {
    logout,
    misc,
    active,
    identified,
    finished: complete,
    back: backButton,
    next: nextButton,
    tracker,
    displayGuest

    //   guestParams,
    //   pageParms,

    //   showLogout: identified,

    //   //   pitStop,
    //   // guidedMode,

    //   navButtons,
    //   steps,
    //   stepper: {
    //     currentStep,
    //     completedSteps: steps
    //       .filter((step) => step.completed)
    //       .map((step) => step.id),
    //   },
  };
}

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
