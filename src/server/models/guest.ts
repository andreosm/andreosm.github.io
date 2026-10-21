import { PageParams } from "./pageTracker.js";
import { StepId } from "./stepTracker.js";

export interface Guest {
  guid: string;
  language: "en" | "it" | "pt";
  preferredLanguage: "en" | "it" | "pt" | null;
  accessCode: string | null;
  fullName: string | null;
  salutation: string | null;
  relationship: string | null
  firstName: string | null;
  lastName: string | null;
  showDisclaimer: boolean;
  sent: string | null;
  partySize: number;
  partySizeEst: number;
  partySizeConf: number;
  outOfTown: string | null;
  wantsRecom: string | null;
  star: string | null;
  presenting: string | null;
  song0: string | null;
  song1: string | null;
  song2: string | null;
  song3: string | null;
  song4: string | null;
  song5: string | null;
  song6: string | null;
  song7: string | null;
  finished: boolean;
}

export const noGuest: Guest = {
  guid: "00000000-0000-0000-0000-000000000000",
  language: "en",
  preferredLanguage: "en",
  accessCode: "",
  fullName: "",
  salutation: "",
  relationship: "",
  firstName: "",
  lastName: "",
  showDisclaimer: false,
  sent: "",
  partySize: -1,
  partySizeEst: -1,
  partySizeConf: -1,
  outOfTown: ",",
  wantsRecom: "",
  star: "",
  presenting: "",
  song0: "",
  song1: "",
  song2: "",
  song3: "",
  song4: "",
  song5: "",
  song6: "",
  song7: "",
  finished: false,
};

// export interface DisplayGuest { 
//   firstName: string;
//   lastName: string;
//   relationship: string;
//   showDisclaimer: boolean;
// }

export interface GuestParams {
  identified: boolean;
  translation: string;
  finished: boolean;
  pageParams: PageParams;
  displayGuest: Guest | null;
}

export interface GuestProgress {
  identified: boolean;
  completedSteps: StepId[];
}