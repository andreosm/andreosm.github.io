import express from "express";
import path from "path";
import session from "express-session";

import { Request, Response, NextFunction } from "express";
// import {
//   PageParms,
//   isPageName,
//   isPanelNumber,
//   isNumber,
//   PanelNumber,
// } from "./models/page.js";

// import { Guest, noGuest, isIdentified, GuestParms } from "./models/guest.js";

// 

// import { PageParams  } from "./models/pageTracker.js";

// import { getNavigationState } from "./services/navigationService.js";

// 

// 

// import {
//   getStepper,
//   setCurrentStep,
//   completeStep,
//   resetStepper,
// } from "./services/stepperService.js";
// import { getPageNavigationState } from "./services/pageNavigation.js";

import {PageState, parsePanelNumber, isPageName, 
} from "./models/page.js";

import {
  getPageNavigationState,
  logObject,
} from "./services/pageNavigation.js";

import { Guest, noGuest, isFinished } from "./models/guest.js";
import { findGuest, updateGuest } from "./services/guestCsvService.js";

import { STEPS } from "./models/stepTracker.js";
import { getStepper, setCurrentStep, completeStep, resetStepper } from "./services/stepperService.js"; 

import { Language } from "./models/language.js";

const app = express();

function requireGuest(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.guest) {
    req.session.returnTo = req.originalUrl;
   // console.debug("original url from server.ts: " + req.originalUrl);
    res.redirect("/search?reason=search");
    return;
  }

  next();
}

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "development-only-secret",
    // TODO: For production, set SESSION_SECRET as an environment variable rather than putting it in source control.

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",

      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  }),
);


app.use((req, res, next) => {
  const path = req.path.replace(/^\/|\/$/g, "");
  const guest = req.session.guest ?? noGuest;

  res.locals.guest = guest;

  // Leave static resources, APIs and other requests to their handlers.
  if (req.method !== "GET" || !isPageName(path)) {
    return next();
  }

  // Validate the panel query parameter.
  const panelNumber = parsePanelNumber(req.query.sp);

  if (panelNumber === null) {
    return res.sendStatus(404);
  }

  // Construct a fully validated PageState.
  // const pageState: PageState = {
  //   pageName: path,
  //   panelNumber,
  // };

  // console.debug("\n=== Page State ===");
  // logObject(pageState);

  // const navigation = getPageNavigationState(req, pageState, guest);

  // req.session.navigation = navigation;
  // res.locals.navigation = navigation;

  // res.locals.stepper = !guest.finished && pageState.pageNavigation ? getStepper(req) : null;

  const pageState: PageState = {
    pageName: path,
    panelNumber,
  };

  const navigation = getPageNavigationState(req, pageState, guest);

  req.session.navigation = navigation;

  res.locals.navigation = navigation;
  res.locals.stepper = navigation.stepper;

  console.debug("\n=== Start debugging from middleware ===");
  console.debug("\nStarting new section: navigation");
  logObject(navigation);

  next();
});

// const PAGE_NAMES = ["index", "party", "rsvp", "star", "finish"] as const;

// type PageList = (typeof PAGE_NAMES)[number];

// function getPageName(value: string): PageList {
//   return (PAGE_NAMES as readonly string[]).includes(value)
//     ? (value as PageList)
//     : "index";
// }

// function isPanelNumber(value: number): value is PanelNumber {
//   return Number.isInteger(value) && value >= 0 && value <= 3;
// }





/*
app.use((req, res, next) => {  
  const path = req.path.replace(/^\/|\/$/g, "");
  const query = req.query.sp as string;
  console.debug("path is " + path);
  const guest = req.session.guest ?? noGuest;
  res.locals.guest = guest; 

  console.debug("METHOD:", req.method);
  console.debug("PATH:", JSON.stringify(path));
  console.debug("IS PAGE NAME:", isPageName(path));

  if (req.method === "GET" && isPageName(path)) {
    let panelNumber = 0 as PanelNumber;

    if (isNumber(query) && isPanelNumber(Number(query))) {
      panelNumber = Number(query) as PanelNumber;
    }
    console.debug("path is " + path);
    
    const pageState: PageState = {
      pageName: path,
      panelNumber,
      pageNavigation: true
    }
    
    console.debug("\n=== Start debugging from server.ts ===");
    console.debug("\nStarting new section: PAGE");
    logObject(pageState);

    res.locals.stepper = getStepper(req);

    const navigation = getPageNavigationState(req, pageState, guest);
    
    req.session.navigation = navigation;
    res.locals.navigation = navigation;

    console.debug(navigation);
    
  } else { 
    res.locals.stepper = null;
    const pageState: PageState = {
      pageName: null,
      panelNumber: 0,
      pageNavigation: false
    }
    const navigation = getPageNavigationState(req, pageState, guest);
    req.session.navigation = navigation;
    res.locals.navigation = navigation;

    console.debug(navigation);
  }

  // console.debug("pageState: " + pageState.pageName + ", " + pageState.panelNumber + ", " + pageState.pageNavigation);
 
  // const path = req.path === "/" ? "index" : req.path.slice(1);
  

  // console.debug("\n=== Start debugging from server.ts ===");

  // console.debug("path is  " + path);

  // console.debug("query is  " + query);
  // console.debug("method is  " + req.method);



  // console.debug("page parms is " + pageParms);

 



  
  

  

  //console.debug("\n=== Start debugging from server.ts ===");
  //console.debug(navigation);
  //console.debug("\n=== End of debugging from server.ts ===");

  // const page = req.path.replace(/^\/|\/$/g, "");

  // console.log("METHOD:", req.method);
  // console.log("PATH:", req.path);
  // console.log("PAGE:", page);
  // console.log("VALID:", validPages.includes(page));

  // if (req.method === "GET" && validPages.includes(page)) {
  //   console.log("PAGE RECOGNIZED:", page);
  // }

  next();
  
  
  
  
  
 // console.debug("guest is: " + guest.guid);

  
  //console.debug("isIdentified: " + isIdentified);

  

  
  

  // const pageValue: PageName = getPageName(path);
  // let panelValue: PanelNumber = 0;

  // if (typeof query === "string" && query.trim() !== "") { 
  //   const value = Number(query);

  //    if (isPanelNumber(value)) {
  //      panelValue = value;
  //    }    
  // }

  // const pageParams: PageParams = {
  //   pageName: pageValue,
  //   panelNumber: panelValue,
  // }

  // let display!: Guest;

  // if (isIdentified) {
  //   display = guest
  // }

  // const displayGuest = isIdentified ? display : null;
  // let translation: string = "";
  // let finished: boolean = false;

  // if (isIdentified) { 
  //   translation = (display.preferredLanguage !== null && display.preferredLanguage !== undefined) ? display.preferredLanguage : display.language;
  //   finished = display.finished === undefined ? false : display.finished;
  // }

  // const guestParams: GuestParams = {
  //    identified: isIdentified,
  //    translation, // display.preferredLanguage !== null ? display.preferredLanguage : display.language,
  //    finished,
  //     pageParams: pageParams,
  //   displayGuest: display!,
      
  // };
  
  // console.debug("language is " + display?.preferredLanguage!);
  // console.debug("finished " + display?.finished!);

  


});
*/

const PORT = process.env.PORT || 3000;

// ============================================================
// PATHS
// ============================================================

// Public directory is located at the project root.
const publicPath = path.join(process.cwd(), "public");

// EJS views are located under src/views.
const viewsPath = path.join(process.cwd(), "src", "views");

// ============================================================
// VIEW ENGINE
// ============================================================

app.set("view engine", "ejs");

app.set("views", viewsPath);

// ============================================================
// STATIC FILES
// ============================================================

// Serve everything under /public.
app.use(express.static(publicPath));

// Serve Bootstrap Icons.
app.use(
  "/bootstrap-icons",
  express.static(path.join(process.cwd(), "node_modules", "bootstrap-icons")),
);


// ============================================================
// ROUTES GET
// ============================================================

app.get("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Could not clear session.");
    }

    res.clearCookie("connect.sid");
    return res.redirect("/index");
  });
});

app.get(
  "/invite/:guid",
  async (req: Request<{ guid: string }>, res: Response) => {
    try {
      // Replace the previous session with a completely new one.
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      const guest = await getGuest(req, req.params.guid, null, null);

      if (!guest) {
        res.redirect("/search?reason=notfound");
        return;
      }

      res.redirect("/index");
    } catch (error) {
      console.error(error);

      return res.status(500).send("Unable to load invitation.");
    }
  },
);

app.get("/search", async (req: Request, res: Response) => {
  const reason =
    typeof req.query.reason === "string" ? req.query.reason : "false";
  const redirectTo = req.session.returnTo;
  
  // Replace the previous session with a completely new one.
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
  
  req.session.returnTo = redirectTo;

  res.render("search", {
    reason,
  });
});

app.get("/index", (req: Request, res: Response) => {
  
  //  completeStep(req, "welcome");
  //  setCurrentStep(req, "welcome");

   res.render("index", {
    //  steps: STEPS,
   });
  
});

app.get("/party", requireGuest, (req: Request, res: Response) => {
  res.render("party", {
    steps: STEPS,
  });
});

app.get("/rsvp", requireGuest, (req: Request, res: Response) => {
  res.render("rsvp", {
    steps: STEPS,
  });
});

app.get("/star", requireGuest, (req: Request, res: Response) => {
  res.render("star", {
    starOptions,
    steps: STEPS,
  });
});

app.get("/finish", (req: Request, res: Response) => {
  // setCurrentStep(req, "end");
  // completeStep(req, "end");

  res.render("finish", {
    steps: STEPS,
  });
});

// ============================================================
// ROUTES POST
// ============================================================

app.post("/search", async (req, res) => {
  try {
      
      const firstName = String(req.body.firstName ?? "");
      const lastName = String(req.body.lastName ?? "");
  
      if (!firstName.trim() || !lastName.trim()) {
        return res.status(400).json({
          success: false,
          key: "nullFirstOrLastName",
        });
      }
  
    const guest = await getGuest(req, null, firstName.trim(), lastName.trim());
  
      if (!guest) {
        return res.status(404).json({
          success: false,
          key: "searchByNameNotFound",
        });
      }
  
      /*
       Guest successfully identified.
      */
  
      delete req.session.pendingGuest;
      req.session.pendingGuest = guest;
  
      //const navButtons = getNavButtons(req);
        //const StepperState = getNewStep(req);
  
      return res.json({
        success: true,
        // firstName: guest.firstName,
        //stepper: getStepper(req),
        //steps: STEPS,
      });
    } catch (error) {
      console.error("Guest identification failed:", error);
  
      return res.status(500).render("search", {
        error: "We were unable to search for your invitation.",
      });
    }
});

app.post("/search/access-code", async (req: Request, res: Response) => {
  try {
    const accessCode = String(req.body.accessCode ?? "");

    if (!accessCode.trim) {
      return res.status(400).json({
        success: false,
        key: "nullAccessCode",
      });
    }

    const guest = req.session.pendingGuest!;
    const redirectUrl = req.session.returnTo || "/";

    if (!guest || guest.accessCode! !== accessCode) {
      return res.status(400).json({
        success: false,
        key: "unmatchedAccessCode",
      });
    }

    if (guest && guest.accessCode === accessCode) {
      // Replace the previous session with a completely new one.
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      req.session.guest = guest;      

      return res.status(200).json({
        success: true,
        redirectUrl,
      });
    }
  } catch (error) {
    console.error("Access code verification failed:", error);

    return res.status(500).render("search", {
      error: "We were unable to verify your information.",
    });
  }
});

app.post("/rsvp", requireGuest, async (req: Request, res: Response) => {
  const guest = req.session.guest;
  if (!guest) return;

  const partySizeEst = req.body?.partySizeEst;

  guest.partySizeEst = partySizeEst;

  const savedGuest = await putGuest(req, "rsvp") as Guest;

  if (partySizeEst == 0) {
    // completeStep(req, "thats60s");
    // completeStep(req, "thats7s");
    // completeStep(req, "end");

    return res.json({
      success: true,
      feedbackType: "info",
      feedbackKey: "rsvpDeclined",
    });
  }

  const finished = isFinished(savedGuest);

    return res.json({
      success: true,
      finished,
      feedbackType: "success",
      feedbackKey: "rsvpAccepted",
    });

  
}
);
  
  
  
  // return res.status(400).json({
  //       success: false,
  //       feedbackType: "warning",
  //       feedbackKey: "rsvpAttendanceRequired",
  //     });
    // const identified = guestIsIdentified(guest);

    // if (!identified) { 
    //   return res.status(401).json({
    //     success: false,
    //     key: "guestNotIdentified",
    //   });
    // }

    //console.debug("1- guest guid is: " + guest.guid);
    //const attending = req.body.attending;

    //let partySize: number;

    // -------------------------
    // NO
    // -------------------------

    // if (attending === "no") {
    //   partySize = 0;
    // }

    // -------------------------
    // YES
    // -------------------------
    // else if (attending === "yes") {
    //   const submittedSize = Number(req.body.partySize);

    //   if (!Number.isInteger(submittedSize) || submittedSize <= 0) {

    //     });
    //   }

    //   partySize = submittedSize;
    // }

    // -------------------------
    // INVALID
    // -------------------------
    // else {
    //   return res.status(400).json({
    //     success: false,
    //     feedbackType: "warning",
    //     feedbackKey: "rsvpAttendanceRequired",
    //   });
    // }

    // -------------------------
    // UPDATE CSV
    // -------------------------
    
    //console.debug("attending = " + partySize);
    //guest.finished = guestIsFinished(guest);

    

    // -------------------------
    // SUCCESS FEEDBACK
    // -------------------------

 


  // } catch (error) {
  //   console.error("RSVP update failed:", error);

  //   return res.status(500).json({
  //     success: false,
  //     feedbackType: "danger",
  //     feedbackKey: "rsvpSaveError",
  //   });
  // }
// });

app.post("/star", requireGuest, async (req: Request, res: Response) => {
  const guest = req.session.guest;
  if (!guest) return;
  // const identified = guestIsIdentified(guest);

  // if (!identified || guest === undefined) {
  //   return res.status(401).json({
  //     success: false,
  //     key: "guestNotIdentified",
  //   });
  // }

  
  const whichForm = req.body.whichForm;
  let whichUpdate: "star" | "songs" = "star";

  //console.debug("updating star");
  // --------------------------------------------------------
  // Validate
  // --------------------------------------------------------

  if (whichForm === "1") {
    // const { star, presenting } = req.body;
    const star = req.body?.star;
    const presenting = req.body?.presenting;

    if (typeof star !== "string" || !star.trim()) {
      return res.status(400).json({
        success: false,
        key: "starSelectionRequired",
      });
    }

    guest.star = star.trim();
    guest.presenting = typeof presenting === "string" ? presenting.trim() : "";
    whichUpdate = "star";
  }

  if (whichForm === "2") {
    const songs: unknown = req.body?.songs;

    // Validate that songs is an array of exactly 7 strings
    if (
      !Array.isArray(songs) ||
      songs.length !== 7 ||
      !songs.every((song) => typeof song === "string")
    ) {
      return res.status(400).json({
        success: false,
        key: "starSaveError",
      });
    }

    // Assign each song to its corresponding CSV field
    guest.song1 = songs[0].trim();
    guest.song2 = songs[1].trim();
    guest.song3 = songs[2].trim();
    guest.song4 = songs[3].trim();
    guest.song5 = songs[4].trim();
    guest.song6 = songs[5].trim();
    guest.song7 = songs[6].trim();

    // Check whether at least one song was entered
    const hasAtLeastOneSong = songs.some((song) => song.trim() !== "");

    // Set song0 accordingly
    guest.song0 = !hasAtLeastOneSong;

    whichUpdate = "songs";
  }

  // --------------------------------------------------------
  // Update Guest/Session
  // --------------------------------------------------------

  try {
    //guest.finished = guestIsFinished(guest);

    const savedGuest = await putGuest(req, whichUpdate) as Guest;
    const finished = savedGuest.finished;

    return res.json({
      success: true,
      finished,
      key: "starSaved",
    });
  } catch (error) {
    console.error("Error saving Star information:", error);

    return res.status(500).json({
      success: false,
      key: "starSaveError",
    });
  }
});

app.post(
  "/api/guest/language",
  requireGuest,
  async (req: Request, res: Response) => {
    const guest = req.session.guest;
    if (!guest) return;
    
    const { language } = req.body;

    // Validate language
    if (!["en", "pt", "it"].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
      });
    }

    try {
      // Update the guest's preferred language

      // Persist to CSV and refresh session
      console.debug("updating language from api 2 logs")
      console.debug(req.session.guest?.preferredLanguage);

      let saveGuest = await getGuest(req, req.session.guest?.guid as string, req.session.guest?.firstName as string, req.session.guest?.lastName as string)
      if (saveGuest) { 
        saveGuest.preferredLanguage = language;
      }
      req.session.guest = saveGuest as Guest; //replace session with a temp obj and revert in catch if not saved

      await putGuest(req, "language");
      console.debug(req.session.guest?.preferredLanguage);

      return res.json({
        success: true,
        preferredLanguage: language,
      });
    } catch (error) {
      console.error("Error updating guest language:", error);

      req.session.guest = guest;

      return res.status(500).json({
        success: false,
        message: "Unable to save preferred language",
      });
    }
  },
);

// ============================================================
//  CATCH ALL 404
// ============================================================
app.use((req: Request, res: Response, next: NextFunction) => {
  console.debug("Reached end of routes:", req.originalUrl);
  next();
});

// app.use((req: Request, res: Response) => {
//   // res.status(404).send("404 - Page not found"); 
//   res.status(404).render("not-found");
// });

app.use((req: Request, res: Response) => {
  const pageState: PageState = {
    pageName: "not-found",
    panelNumber: 0,
  };

  const guest = req.session.guest ?? noGuest;

  const navigation = getPageNavigationState(req, pageState, guest);

  res.status(404).render("not-found", {
    navigation,
  });
});


// ============================================================
//  HELPER FUNCTIONS
// ============================================================

async function getGuest(
  req: Request,
  uid: string | null,
  firstName: string | null,
  lastName: string | null,
): Promise<Guest | null> {
  const guest = await findGuest(uid, firstName, lastName);

  if (!guest) return null;

  delete req.session.guest;
  req.session.guest = guest;

  return guest;
}

async function putGuest(req: Request, key: string): Promise<Guest | null> {
  const guest = req.session.guest ?? null;

  if (!guest) return null;

  console.debug("from putGuest, 3 logs ")
  console.debug(req.session.guest?.preferredLanguage);
  await updateGuest(key, guest);

  const savedGuest = await findGuest(guest.guid, guest.firstName, guest.lastName);

  req.session.guest = savedGuest ?? undefined;
  console.debug(savedGuest?.preferredLanguage);
  console.debug(req.session.guest?.preferredLanguage);

  return savedGuest;
}

/* function guestIsIdentified(guest: Guest | undefined): boolean {
  if (!guest) return false;

  const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

  return Boolean(guest.guid) && guest.guid.toLowerCase() !== EMPTY_GUID;
}

function guestShowDisclaimer(guest: Guest | undefined): boolean {
  if (guest == null) {
    return false;
  }

  return guest?.showDisclaimer ?? false;
}

function guestHasRsvp(guest: Guest | undefined): boolean {
  if (guest == null) {
    return false;
  }

  // const partySizeEst = Number(guest?.partySizeEst ?? -1);

  const hasRsvp =
    (guest?.partySizeEst ?? 0) >= 0 || (guest?.partySizeConf ?? 0) >= 0;

  return hasRsvp;
}

function guestHasStar(guest: Guest | undefined): boolean {
  if (guest == null) {
    return false;
  }

  const star = typeof guest?.star === "string" ? guest?.star : "";

  return star.trim() !== "";
}

function guestHasSongs(guest: Guest | undefined): boolean {
  if (guest == null) {
    return false;
  }

  const hasSongs = [
    guest.song0,
    guest.song1,
    guest.song2,
    guest.song3,
    guest.song4,
    guest.song5,
    guest.song6,
    guest.song7,
  ].some((song) => String(song ?? "").trim().length > 0);

  return hasSongs;
}
  
function guestIsFinished(guest: Guest | undefined): boolean {
  if (guest === null || guest === undefined || !guestIsIdentified(guest)) {
    return false;
  }

  return guestHasRsvp(guest) && guestHasStar(guest) && guestHasSongs(guest);
} */


const starOptions = [
  { value: "absolutely", key: "starAbsolutely" },
  { value: "yes", key: "starYes" },
  { value: "maybe", key: "starMaybe" },
  { value: "probably", key: "starProbably" },
  { value: "considering", key: "starConsidering" },
  { value: "think", key: "starThink" },
  { value: "encouragement", key: "starEncouragement" },
  { value: "convince", key: "starConvince" },
  { value: "ideas", key: "starIdeas" },
  { value: "secretIdea", key: "starSecretIdea" },
  { value: "shyInterested", key: "starShyInterested" },
  { value: "reallyShy", key: "starReallyShy" },
  { value: "oneDrink", key: "starOneDrink" },
  { value: "fewDrinks", key: "starFewDrinks" },
  { value: "severalDrinks", key: "starSeveralDrinks" },
  { value: "friends", key: "starFriends" },
  { value: "backupSingers", key: "starBackupSingers" },
  { value: "backupDancers", key: "starBackupDancers" },
  { value: "howbigStage", key: "starHowBigStage" },
  { value: "discuss", key: "starDiscuss" },
  { value: "negotiate", key: "starNegotiate" },
  { value: "sixtySeconds", key: "starSixtySeconds" },
  { value: "lipSync", key: "starLipSync" },
  { value: "noTalent", key: "starNoTalent" },
  { value: "zeroTalent", key: "starZeroTalent" },
  { value: "defineStar", key: "starDefineStar" },
  { value: "audience", key: "starAudience" },
  { value: "photos", key: "starPhotos" },
  { value: "video", key: "starVideo" },
  { value: "confiscatePhones", key: "starConfiscatePhones" },
  { value: "disguise", key: "starDisguise" },
  { value: "leaveCountry", key: "starLeaveCountry" },
  { value: "excuses", key: "starExcuses" },
  { value: "noNo", key: "starNoNo" },
  { value: "whereIsNo", key: "starWhereIsNo" },
  { value: "stillNo", key: "starStillNo" },
  { value: "talkAtParty", key: "starTalkAtParty" },
  { value: "notSure", key: "starNotSure" },
  { value: "no", key: "starNo" },
];

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`Party website running at http://localhost:${PORT}`);
});