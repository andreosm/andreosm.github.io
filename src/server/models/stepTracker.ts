export type StepId =
  | "welcome"
  | "party"
  | "star"
  | "rsvp"
  | "thats60s"
  | "thats7s"
  | "end";

export type StepTrackerId =
  | "welcome"
  | "party"
  | "star"
  | "rsvp"
  | "thats60s"
  | "thats7s"
  | "end";

export interface StepDefinition {
  id: StepId;
  label: string;
  url: string;
}
