import type { Request } from "express";

import { PageName, PanelNumber, PageState } from "../models/page.js";
import { Guest, getGuestState } from "../models/guest.js";
import { PageNavigationState, ButtonItem } from "../models/navigation.js";
import { PageNavigationDefinition, NAVFLOW } from "./navigationService.js";

import { getStepper, setCurrentStep, completeStep } from "./stepperService.js"; 
import { STEPS } from "../models/stepTracker";

export function getPageNavigationState(req: Request, pageState: PageState, guest: Guest): PageNavigationState {
    const guestState = getGuestState(guest);
    // const pageState = getPageState(page);

    const identified = guestState.identified;
    const complete = guestState.finished;
    const guidedMode = !complete && pageState.pageNavigation;

    if (guidedMode) {
        const curFlow = getCurrentNavFlow(
          pageState.pageName,
          pageState.panelNumber,
        );
        const curFlowIndex = getCurrentNavFlowIndex(curFlow);

          setCurrentStep(req, curFlow.stepId);
        
          for (let i = 0; i <= curFlowIndex; i++) {
            completeStep(req, NAVFLOW[i].stepId);
          }
        
        let nextButton: ButtonItem

        console.debug(curFlow.navState);

        return {
          guest: guestState,
          stepper: getStepper(req),
            nav: curFlow.navState,
          steps: STEPS,
        };

    } else {
        return {
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
              active: pageState.pageName,
            },
            back: null,
            next: null,
            },
          steps: STEPS,
        };
        
    }    
}

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