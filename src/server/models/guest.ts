/*
2- guestParms
    2.1 identified | methods: isGuestIdentified
    2.2 guest | methods: isFinished | hasRSVP | hasStar | hasSongs
*/

// import { PageParams } from "./pageTracker.js";
// import { StepId } from "./stepTracker.js";
import { DEFAULT_LANGUAGE, Language } from "./language.js";

export interface Guest {
  guid: string;
  language: "en" | "it" | "pt";
  preferredLanguage: "en" | "it" | "pt" | null;
  accessCode: string | null;
  gender: string | null;
  fullName: string | null;
  salutation: string | null;
  relationship: string | null;
  firstName: string | null;
  lastName: string | null;
  showDisclaimer: boolean;
  sent: boolean;
  partySize: number;
  partySizeEst: number;
  partySizeConf: number;
  outOfTown: boolean;
  wantsRecom: boolean;
  star: string | null;
  presenting: string | null;
  song0: boolean;
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
  gender: "",
  fullName: "",
  salutation: "",
  relationship: "",
  firstName: "",
  lastName: "",
  showDisclaimer: false,
  sent: false,
  partySize: -1,
  partySizeEst: -1,
  partySizeConf: -1,
  outOfTown: false,
  wantsRecom: false,
  star: "",
  presenting: "",
  song0: false,
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

// export interface GuestState {
//   guid: string;

//   identified: boolean;
//   translation: string;
//   finished: boolean;
//   pageParams: PageParams;
//   displayGuest: Guest | null;
// }

// export interface GuestParms {
//   guest: Guest;
// }

export interface GuestState { 
  identified: boolean;
  finished: boolean;
  translation: string;
  curGuest: Guest;
}

export function getGuestState(guest: Guest): GuestState { 
  const identified = isIdentified(guest);
  const finished = isFinished(guest);
  const translation = translateTo(guest);
  let curGuest: Guest;

  if (identified) { 
    curGuest = guest;
  } else {
    curGuest = noGuest;
  }

  return { identified, finished, translation: translation, curGuest };
}

export function translateTo(guest: Guest): Language { 
  if (!guest && guest === undefined) return DEFAULT_LANGUAGE;

  return guest.preferredLanguage || guest.language;
}

export function isIdentified(guest: Guest): boolean { 
  if (!guest && guest === undefined) return false;

  const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

  return Boolean(guest.guid) && guest.guid.toLowerCase() !== EMPTY_GUID;
}

export function isFinished(guest: Guest): boolean { 
  if (!isIdentified(guest)) {
    return false;
  }

  return (hasRsvp(guest) && hasStar(guest) && hasSongs(guest)) || hasDeclined(guest); 
}

export function hasDeclined(guest: Guest): boolean { 
  return guest.partySizeEst === 0;
}

export function isAttending(guest: Guest): boolean { 
  return guest.partySizeEst > 0;
}

export function hasRsvp(guest: Guest): boolean {
  if (!isIdentified(guest)) {
    return false;
  }
  return (guest?.partySizeEst ?? 0) >= 0 || (guest?.partySizeConf ?? 0) >= 0;
}

export function hasStar(guest: Guest): boolean { 
  if (!isIdentified(guest)) {
    return false;
  }

    const star = typeof guest?.star === "string" ? guest?.star : "";

    return star.trim() !== "";
}

export function hasSongs(guest: Guest): boolean {
  if (!isIdentified(guest)) {
    return false;
  }
  
    const hasSongs = [
      guest.song1,
      guest.song2,
      guest.song3,
      guest.song4,
      guest.song5,
      guest.song6,
      guest.song7,
    ].some((song) => String(song ?? "").trim().length > 0);
  
  const optOut = guest?.song0;

  return hasSongs || (!hasSongs && optOut);
 }

export function showDisclaimer(guest: Guest): boolean {
  if (!isIdentified(guest)) {
    return false;
  }

  return guest.showDisclaimer;
}