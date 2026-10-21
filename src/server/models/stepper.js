export const STEPS = [
    { id: "welcome", label: "Welcome", translationKey: "stepWelcome" },
    { id: "party", label: "The Party", translationKey: "stepParty" },
    { id: "star", label: "Be a Star 67", translationKey: "stepStar" },
    { id: "rsvp", label: "RSVP", translationKey: "stepRsvp" },
    { id: "thats60s", label: "That's 60s", translationKey: "step60s" },
    { id: "thats7s", label: "That's 7s", translationKey: "step7s" },
    { id: "end", label: "End", translationKey: "stepEnd" },
];
export function createStepperState() {
    return {
        currentStep: "welcome",
        completedSteps: [],
    };
}
