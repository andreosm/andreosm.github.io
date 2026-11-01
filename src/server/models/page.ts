/*
Page has 
1- url
    1.1 path
        1.1.1 page name | methods: isValidPage
    1.2 query
        1.2.1 panel number | methods: isValidPanel

2- guestParms
    2.1 identified | methods: isGuestIdentified
    2.2 guest | methods: isFinished | hasRSVP | hasStar | hasSongs

3- navigation
    3.1 navbar
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

4- stepper
    4.1 current step
    4.2 completed steps
*/
import { NAVFLOW } from "../services/navigationService.js";

export type PageName =
  | "index"
  | "party"
  | "star"
  | "rsvp"
  | "finish"
  | "search"
  | "venue"
    | "food"
    | "not-found";

export type GuidedPageName = "index" | "party" | "star" | "rsvp";

export type PanelNumber = 0 | 1 | 2 | 3;

export interface PageState {
  pageName: PageName;
  panelNumber: PanelNumber;
}

const validPages: ReadonlySet<string> = new Set<PageName>([
  "index",
  "party",
  "star",
  "rsvp",
  "finish",
  "search",
  "venue",
    "food",
  "not-found",
]);

const guidedPages: ReadonlySet<string> = new Set<GuidedPageName>([
  "index",
  "party",
  "star",
  "rsvp",
]);

export function isPageName(value: string): value is PageName {
  return validPages.has(value);
}

export function isGuidedPage(value: PageName): value is GuidedPageName {
  return guidedPages.has(value);
}

// export function isGuidedPage(
//   pageName: PageName,
//   panelNumber: PanelNumber,
// ): boolean {
//   return NAVFLOW.some(
//     (flow) =>
//       flow.pageState.pageName === pageName &&
//       flow.pageState.panelNumber === panelNumber,
//   );
// }

export function isPanelNumber(value: number): value is PanelNumber {
  return value === 0 || value === 1 || value === 2 || value === 3;
}

export function parsePanelNumber(value: unknown): PanelNumber | null {
  if (value === undefined) {
    return 0;
  }

  if (typeof value !== "string" || !/^[0-3]$/.test(value)) {
    return null;
  }

  const panel = Number(value);

  return isPanelNumber(panel) ? panel : null;
}













// export function getPageState(pageParms: PageParms): PageState {
//   let pageNavigation: boolean = false;
//   let pageName: PageName = "index";
//   let panelNumber: PanelNumber = 0;

//   // console.debug("page name is " + pageParms.pageName);

//   if (isPageName(pageParms.pageName)) {
//     pageNavigation = true;

//     switch (pageParms.pageName) {
//       case "party":
//         pageName = "party";
//         break;
//       case "star":
//         pageName = "star";
//         break;
//       case "rsvp":
//         pageName = "rsvp";
//         break;
//       case "finish":
//         pageName = "finish";
//         break;
//     }
//   }

//   if (
//     isNumber(pageParms.panelNumber) &&
//     isPanelNumber(Number(pageParms.panelNumber))
//   ) {
//     switch (pageParms.panelNumber) {
//       case "1":
//         panelNumber = 1;
//         break;
//       case "2":  
//         panelNumber = 2;
//         break;
//       case "3":
//         panelNumber = 3;
//         break;
//     }
//   }
//   // console.debug("page state is " + pageName + " and " + pageNavigation);

//   return { pageName, panelNumber, pageNavigation };
// }

// export interface PageParms {
//   pageName: string;
//   panelNumber: string;
// }

// const validPages: readonly PageName[] = ["index", "party", "star", "rsvp", "finish"];
// const validPanels: readonly PanelNumber[] = [0, 1, 2, 3];

// function isPageName(value: string): value is PageName {
//   return validPages.some((page) => page === value);
// }

// export function isPageName(value: string): value is PageName {
//   return validPages.has(value);
// }

// export function isNumber(value: string): boolean {
//   if (!value && value !== undefined && value !== "") {
//     return false;
//   }

//   try {
//     const number = Number(value);
//     return true;
//   } catch {
//     return false;
//   }
// }

// export function isPanelNumber(value: number): value is PanelNumber {
//   return validPanels.some((panel) => panel === value);
// }

// function isPanelNumber(value: number): value is PanelNumber {
//   return value === 0 || value === 1 || value === 2 || value === 3;
// }