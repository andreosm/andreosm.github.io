import type { Request } from "express";

import { PageName, PanelNumber, PageState } from "../models/page.js";
import { Guest, getGuestState, hasDeclined, hasRsvp, hasStar, hasSongs, isAttending } from "../models/guest.js";
import {
  PageNavigationState,
  ButtonItem,
  SubmitButton,
} from "../models/navigation.js";
import { PageNavigationDefinition, NAVFLOW } from "./navigationService.js";

import {
  getStepper,
  setCurrentStep,
  completeStep,
} from "./stepperService.js";
import { STEPS } from "../models/stepTracker";

export function getPageNavigationState(
  req: Request,
  pageState: PageState,
  guest: Guest,
): PageNavigationState {
  const guestState = getGuestState(guest);
  const complete = guestState.finished;

  // Find the requested page/panel in the guided sequence.
  const curFlow = NAVFLOW.find(
    (flow) =>
      flow.pageState.pageName === pageState.pageName &&
      flow.pageState.panelNumber === pageState.panelNumber,
  );

  // Guided mode is active only for unfinished guests
  // visiting a page/panel defined in NAVFLOW.
   
  const isFinishPage = pageState.pageName === "finish";

  const guidedMode = curFlow !== undefined && (!complete || isFinishPage);

  if (guidedMode) {
    const curFlowIndex = NAVFLOW.indexOf(curFlow);

    getStepper(req);
    setCurrentStep(req, curFlow.stepId);

    for (let i = 0; i < curFlowIndex; i++) {
      completeStep(req, NAVFLOW[i].stepId);
    }

    // guests who have previously finished any steps but not gone to the end
    // stepper should reflect the completed steps
    if (hasRsvp(guest)) {
      completeStep(req, "rsvp");
    }
    if (hasStar(guest) && hasSongs(guest)) { 
      completeStep(req, "star");
      completeStep(req, "thats60s");
      completeStep(req, "thats7s");
     }
    if (hasStar(guest)) {
      completeStep(req, "thats60s")
    }
    if (hasSongs(guest)) {
      completeStep(req, "thats7s")
    }

    return {
      step: curFlow.translationKey,
      page: pageState,
      guest: guestState,
      stepper: getStepper(req),
      nav: curFlow.navState,
      steps: STEPS,
    };
  }

  //
  /* 
    Outside guided mode, 
    ** if the user has completed all steps:
      1- The navbar becomes visible
      2- The stepper and Back/Next buttons become hidden

          Exceptions: 
          1- In Star 1, where the next button is visible navigates to Star 2
          2- In Star 2, there is no next button; instead a Continue button that submits and navigate to Star 3, unless
            2.1- The user has previously declined the RSVP, then
                  Display feedback and disable the Continue button
          3- In Star 3, there is no next button; instead a Continue button that submits and displays feedback, unless
            3.1- The user has previously declined the RSVP, then
                  Display feedback and disable the Continue button
    ** if user has not completed all steps:
      1- The navbar is not visible
      2- Back/Next buttons are visible and will behave as in the guided mode
      3- The stepper will show the steps previously completed
  */

  let nextBtn: ButtonItem = {
    visible: false,
    url: "",
    panel: 0,
    action: "none",
  };

  let submitBtn: SubmitButton = {
    enabled: true,
  }

  if (pageState.pageName == "star") { 
    if (pageState.panelNumber == 1) { 
      nextBtn.visible = true;
      nextBtn.url = "star?sp=2";
      nextBtn.panel = 2;
      nextBtn.action = "navigate";
    }

    if (pageState.panelNumber == 2 || pageState.panelNumber == 3) {
      if (hasDeclined(guest)) {
        submitBtn.enabled = false;
      }

      if (isAttending(guest)) { 
        nextBtn.url = pageState.panelNumber == 2 ? "star?sp=3" : "";
      }
    }
  } 
    


  return {
    step: "",
    page: pageState,
    guest: guestState,
    stepper: null,

    nav: {
      navBar: {
        visible: complete,
        active: "",
      },

      logout: {
        visible: complete,
        active: "",
      },

      active: {
        visible: complete,
        active: complete ? pageState.pageName : "",
      },

      back: {
        visible: false,
        url: "",
        panel: 0,
        action: "none",
      },

      submit: submitBtn,

      next: nextBtn,

      // next: {
      //   visible: false,
      //   url: "",
      //   panel: 0,
      //   action: "none",
      // },
    },

    steps: STEPS,
  };
}

/*
export function getPageNavigationState(
  req: Request,
  pageState: PageState,
  guest: Guest,
): PageNavigationState {
  const guestState = getGuestState(guest);

  const identified = guestState.identified;
  const complete = guestState.finished;
  const guidedMode = !complete && pageState.pageNavigation;

  if (guidedMode) {
    const curFlow = getCurrentNavFlow(
      pageState.pageName!,
      pageState.panelNumber,
    );
    const curFlowIndex = getCurrentNavFlowIndex(curFlow);

    setCurrentStep(req, curFlow.stepId);

    for (let i = 0; i <= curFlowIndex; i++) {
      completeStep(req, NAVFLOW[i].stepId);
    }

    let nextButton: ButtonItem;
      const step = curFlow.translationKey;
      
      // console.debug("\n=== Start debugging from guidade mode ===");

      // console.debug("\nStarting new section: STEP");
      // console.debug(curFlow.translationKey);
      
      // console.debug("\nStarting new section: PAGE");
      // logObject(pageState);

      // console.debug("\nStarting new section: GUEST");
      // logObject(guestState);

      // console.debug("\nStarting new section: STEPPER");
      // logObject(getStepper(req));
      
      // console.debug("\nStarting new section: NAV");
      // logObject(curFlow.navState);

      // console.debug("\n=== End of debugging ===");

    return {
      step: step,
      page: pageState,
      guest: guestState,
      stepper: getStepper(req),
      nav: curFlow.navState,
      steps: STEPS,
    };
  } else {
  
    // console.debug("\n=== Start debugging not guidade mode ===");
    // console.debug("\n=== Start debugging Page ===");
    // logObject(pageState);
    // console.debug("\nStarting new section: GUEST");
    // logObject(guestState);

    return {
      step: "",
      page: pageState,
      guest: guestState,
      stepper: null,
      nav: {
        navBar: {
          visible: true,
          active: "",
        },
        logout: {
          visible: true,
          active: "",
        },
        active: {
          visible: true,
          active: pageState.pageName as string,
        },
        back: {
          visible: false,
          url: "",
          panel: 0,
          action: "none",
        },
        next: {
          visible: false,
          url: "",
          panel: 0,
          action: "none",
        },
      },
      steps: STEPS,
    };
  }
}
*/

function getCurrentNavFlow(page: PageName, panel: PanelNumber) {
  const curFlow = NAVFLOW.find(
    (f) => f.pageState.pageName === page && f.pageState.panelNumber === panel,
  );

  if (!curFlow) return NAVFLOW[0];

  return curFlow;
}

function getCurrentNavFlowIndex(tracker: PageNavigationDefinition): number {
  return NAVFLOW.findIndex((flow) => flow.stepId === tracker.stepId);
}

export function logObject(obj: unknown, prefix = ""): void {
  if (typeof obj !== "object" || obj === null) {
    return;
  }

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      logObject(value, path);
    } else {
      console.debug(`${path}: ${value}`);
    }
  }
}