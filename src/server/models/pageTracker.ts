import { StepTrackerId } from "./stepTracker.js";
import { NextAction } from "./navigation.js"

export type PanelNumber = 0 | 1 | 2 | 3;

export type PageName = "" | "index" | "party" | "rsvp" | "star" | "finish";

export type PageTrackerId = "" | "index" | "party" | "rsvp" | "star" | "finish";

export type StepId =
  | "welcome"
  | "party"
  | "star"
  | "rsvp"
  | "thats60s"
  | "thats7s"
  | "end";

export interface PageTrackerDefinition {
  stepId: StepTrackerId;
  stepLabel: string;
  translationKey: string;
  pageName: PageTrackerId;
  panelNumber: PanelNumber;
  nextUrl: PageTrackerId;
  nextUrlParm: string;
  backUrl: PageTrackerId;
  backUrlParm: string;
  action: NextAction;
}

export interface PageParams {
  pageName: PageName;
  panelNumber: PanelNumber;
}

