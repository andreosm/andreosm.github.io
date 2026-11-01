import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

import { Guest, isFinished } from "../models/guest";

const CSV_PATH = path.join(process.cwd(), "data", "guests.csv");

interface GuestCsvRow {
  GUID: string;
  Language: string;
  PreferredLanguage: string;
  AccessCode: string;
  Gender: string;
  FullName: string;
  Salutation: string;
  Relationship: string;
  FirstName: string;
  LastName: string;
  ShowDisclaimer: string;
  Sent: string;
  PartySize: string;
  PartySizeEst: string;
  PartySizeConf: string;
  OutOfTown: string;
  WantsRecom: string;
  Star: string;
  Presenting: string;
  Song0: string;
  Song1: string;
  Song2: string;
  Song3: string;
  Song4: string;
  Song5: string;
  Song6: string;
  Song7: string;
  Finished: string;
}

function nullableNumber(value: string): number | null {
  if (!value?.trim()) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function defaultPartySize(value: string): number { 
  if (!value?.trim()) {
    return -1;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : -1;
}

function mapRowToGuest(row: GuestCsvRow): Guest {
  const language =
    row.Language === "it" || row.Language === "pt" ? row.Language : "en";
  
  const preferredLanguage =
    row.PreferredLanguage === "it" ||
    row.PreferredLanguage === "pt" ||
    row.PreferredLanguage === "en"
      ? row.PreferredLanguage
      : null;
  
  return {
    guid: row.GUID,
    language,
    preferredLanguage,
    accessCode: row.AccessCode,
    gender: row.Gender,
    fullName: row.FullName,
    salutation: row.Salutation,
    relationship: row.Relationship,
    firstName: row.FirstName,
    lastName: row.LastName,
    showDisclaimer: row.ShowDisclaimer.trim().toLowerCase() === "true",
    sent: row.Sent.trim().toLocaleLowerCase() === "true",
    partySize: defaultPartySize(row.PartySize),
    partySizeEst: defaultPartySize(row.PartySizeEst),
    partySizeConf: defaultPartySize(row.PartySizeConf),
    outOfTown: row.OutOfTown.trim().toLowerCase() === "true",
    wantsRecom: row.WantsRecom.trim().toLowerCase() === "true",
    star: row.Star,
    presenting: row.Presenting,
    song0: row.Song0.trim().toLowerCase() === "true",
    song1: row.Song1,
    song2: row.Song2,
    song3: row.Song3,
    song4: row.Song4,
    song5: row.Song5,
    song6: row.Song6,
    song7: row.Song7,
    finished: row.Finished.trim().toLowerCase() === "true",
  };
}

async function readRows(): Promise<GuestCsvRow[]> {
  const csv = await fs.readFile(CSV_PATH, "utf8");

  return parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as GuestCsvRow[];
}

export async function findGuest(
  guid: string | null,
  firstName: string | null,
  lastName: string | null,
): Promise<Guest | null> {
  const rows = await readRows();
  let row: GuestCsvRow | undefined;

  if (guid) {
    const normalizedGuid = guid.trim().toLowerCase();
    row = rows.find((r) => r.GUID.trim().toLowerCase() === normalizedGuid);
  }
    
  if (firstName && lastName) {
    const normalizedFirstName = normalizeName(firstName);
    const normalizedLastName = normalizeName(lastName);

    row = rows.find((r) => {
      const csvFirstName = normalizeName(r.FirstName);
      const csvLastName = normalizeName(r.LastName);

      return (
        csvFirstName === normalizedFirstName && csvLastName === normalizedLastName
      );
    });
  }

  if (!row) {
    return null;
  }

  const mappedGuest = mapRowToGuest(row);

  //console.debug("Reading CSV file with these properties: ");

  // for (const [key, value] of Object.entries(mappedGuest)) {
  //   console.log(`${key}: ${value}`);
  // }

  return mapRowToGuest(row);
}

// export async function findGuestByGuid(guid: string): Promise<Guest | null> {
//   const rows = await readRows();

//   const normalizedGuid = guid.trim().toLowerCase();

//   const row = rows.find((r) => r.GUID.trim().toLowerCase() === normalizedGuid);

//   if (!row) {
//     return null;
//   }

//   return mapRowToGuest(row);
// }

// export async function findGuestByName(
//   firstName: string,
//   lastName: string,
// ): Promise<Guest | null> {
//   const rows = await readRows();

//   const normalizedFirstName = normalizeName(firstName);

//   const normalizedLastName = normalizeName(lastName);

//   const row = rows.find((row) => {
//     const csvFirstName = normalizeName(row.FirstName);

//     const csvLastName = normalizeName(row.LastName);

//     return (
//       csvFirstName === normalizedFirstName && csvLastName === normalizedLastName
//     );
//   });

//   if (!row) {
//     return null;
//   }

//   return mapRowToGuest(row);
// }

export async function updateGuest(key: string, guest: Guest): Promise<void> {
  const rows = await readRows();
  const normalizedGuid = guest.guid.trim().toLowerCase();

  const row = rows.find((r) => r.GUID.trim().toLowerCase() === normalizedGuid);

  if (!row) {
    throw new Error("Guest GUID was not found.");
  }

//  console.debug("updating guest, key: " + key);
  switch (key) {
    case "rsvp":
      row.PartySizeEst = String(guest.partySizeEst);
      row.PartySizeConf = String(guest.partySizeConf);
  //    console.debug("updating guest, PartySizeEst: " + guest.partySizeEst);
      break;
    case "star":
      row.Star = String(guest.star);
      row.Presenting = String(guest.presenting);
      break;
    case "songs":
      row.Song0 = String(guest.song0);
      row.Song1 = String(guest.song1);
      row.Song2 = String(guest.song2);
      row.Song3 = String(guest.song3);
      row.Song4 = String(guest.song4);
      row.Song5 = String(guest.song5);
      row.Song6 = String(guest.song6);
      row.Song7 = String(guest.song7);
      break;
    case "language":
      row.PreferredLanguage = String(guest.preferredLanguage);
      break;
    default:
      throw new Error(`Invalid key: ${key}`);
  }

  row.Finished = isFinished(guest) ? "true" : "false";

  await writeFile(rows);

  //console.debug("CSV file written with these properties: ");

  // for (const [key, value] of Object.entries(guest)) {
  //   console.log(`${key}: ${value}`);
  // }
}

// export async function guestIsFinished(guest: Guest): Promise<boolean> { 
//   const songs = [guest.song0, guest.song1, guest.song2, guest.song3, guest.song4, guest.song5, guest.song6, guest.song7];
  
//   return (
//     ((guest?.partySizeEst ?? 0) >= 0 || (guest?.partySizeConf ?? 0) >= 0) &&
//     guest?.star != null &&
//     guest?.star.trim().length > 0 &&
//     songs.some((song) => String(song ?? "").trim().length > 0)
//   );
// }

// export async function updateGuest(
//     guest: Guest,
// ): Promise<void> {
//     const rows = await readRows();

//     const normalizedGuid = guest.guid.trim().toLowerCase();

//     const row = rows.find(
//         (r) => r.GUID.trim().toLowerCase() === normalizedGuid,
//     );

//     if (!row) {
//         throw new Error("Guest GUID was not found.");
//     }
  
//     const isFinished = guestIsFinished(guest);

//     row.PartySizeEst = String(guest.partySizeEst);
//     row.PartySizeConf = String(guest.partySizeConf);
//     row.WantsRecom = String(guest.wantsRecom);
//     row.Star = String(guest.star);
//     row.Presenting = String(guest.presenting);
//     row.Song1 = String(guest.song1);
//     row.Song2 = String(guest.song2);
//     row.Song3 = String(guest.song3);
//     row.Song4 = String(guest.song4);
//     row.Song5 = String(guest.song5);
//     row.Song6 = String(guest.song6);
//     row.Song7 = String(guest.song7);
//   row.Finished = String(isFinished);
  
//   await writeFile(rows);

  /*
    const output = stringify(rows, {
      header: true,
      columns: [
        "GUID",
        "Language",
        "PreferredLanguage",
        "AccessCode",
        "FullName",
        "Salutation",
        "Relationship",
        "FirstName",
        "LastName",
        "ShowDisclaimer",
        "Sent",
        "PartySize",
        "PartySizeEst",
        "PartySizeConf",
        "OutOfTown",
        "WantsRecom",
        "Star",
        "Presenting",
        "Song0",
        "Song1",
        "Song2",
        "Song3",
        "Song4",
        "Song5",
        "Song6",
        "Song7",
        "Finished",
      ],
    });

   const temporaryPath = `${CSV_PATH}.tmp`;

    await fs.writeFile(temporaryPath, output, "utf8");

    await fs.rename(temporaryPath, CSV_PATH); */
// }

// export async function updateGuestPreferredLanguage(
//   guid: string,
//   language: Language,
// ): Promise<void> {
//   const rows = await readRows();

//   const normalizedGuid = guid.trim().toLowerCase();

//   const row = rows.find((r) => r.GUID.trim().toLowerCase() === normalizedGuid);

//   if (!row) {
//     throw new Error("Guest GUID was not found.");
//   }

//   row.PreferredLanguage = String(language);

//   writeFile(rows);

  /*
  const output = stringify(rows, {
    header: true,
    columns: [
      "GUID",
      "Language",
      "PreferredLanguage",
      "AccessCode",
      "FullName",
      "Salutation",
      "Relationship",
      "FirstName",
      "LastName",
      "ShowDisclaimer",
      "Sent",
      "PartySize",
      "PartySizeEst",
      "PartySizeConf",
      "OutOfTown",
      "WantsRecom",
      "Star",
      "Presenting",
      "Song0",
      "Song1",
      "Song2",
      "Song3",
      "Song4",
      "Song5",
      "Song6",
      "Song7",
      "Finished",
    ],
  });

  const temporaryPath = `${CSV_PATH}.tmp`;

  await fs.writeFile(temporaryPath, output, "utf8");

  await fs.rename(temporaryPath, CSV_PATH); */
// }

  /*
export async function updatePartySizeEstimate(
  guid: string,
  partySize: number,
): Promise<void> {
  const rows = await readRows();

  const normalizedGuid = guid.trim().toLowerCase();

  const row = rows.find((r) => r.GUID.trim().toLowerCase() === normalizedGuid);

  if (!row) {
    throw new Error("Guest GUID was not found.");
  }

  row.PartySizeEst = String(partySize);

  const isFinished =
    row?.Star?.trim() != "" && Number((row?.PartySizeEst ?? "-1") > "-1")
      ? true
      : false;
    
    
  row.Finished = String(isFinished);
  
  writeFile(rows);


  const output = stringify(rows, {
    header: true,
    columns: [
      "GUID",
      "Language",
      "PreferredLanguage",
      "AccessCode",
      "FullName",
      "Salutation",
      "Relationship",
      "FirstName",
      "LastName",
      "ShowDisclaimer",
      "Sent",
      "PartySize",
      "PartySizeEst",
      "PartySizeConf",
      "OutOfTown",
      "WantsRecom",
      "Star",
      "Presenting",
      "Song1",
      "Song2",
      "Song3",
      "Song4",
      "Song5",
      "Song6",
      "Song7",
      "Finished",
    ],
  });

  const temporaryPath = `${CSV_PATH}.tmp`;

  await fs.writeFile(temporaryPath, output, "utf8");

  await fs.rename(temporaryPath, CSV_PATH); 
}*/

// function guestIsFinished(guest: Guest | undefined): boolean {
//   if (!guest || guest == null || guest == undefined) {
//     return false;
//   }

//   const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

//   if (guest.guid.toLowerCase() === EMPTY_GUID) { 
//     return false;
//   }

// const hasRsvp =
//   (guest?.partySizeEst ?? 0) >= 0 || (guest?.partySizeConf ?? 0) >= 0;

// const star = typeof guest?.star === "string" ? guest?.star : "";

//   const hasStar = star.trim() !== "";
  
//   const hasSongs = [
//     guest.song0,
//     guest.song1,
//     guest.song2,
//     guest.song3,
//     guest.song4,
//     guest.song5,
//     guest.song6,
//     guest.song7,
//   ].some((song) => String(song ?? "").trim().length > 0);

//   return (
//     (hasRsvp && hasStar && hasSongs) || guest.finished
//   );
// }

function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function writeFile(rows: GuestCsvRow[]): Promise<void> {
  const output = stringify(rows, {
    header: true,
    columns: [
      "GUID",
      "Language",
      "PreferredLanguage",
      "AccessCode",
      "Gender",
      "FullName",
      "Salutation",
      "Relationship",
      "FirstName",
      "LastName",
      "ShowDisclaimer",
      "Sent",
      "PartySize",
      "PartySizeEst",
      "PartySizeConf",
      "OutOfTown",
      "WantsRecom",
      "Star",
      "Presenting",
      "Song0",
      "Song1",
      "Song2",
      "Song3",
      "Song4",
      "Song5",
      "Song6",
      "Song7",
      "Finished",
    ],
  });

  const temporaryPath = `${CSV_PATH}.tmp`;

  await fs.writeFile(temporaryPath, output, "utf8");

  await fs.rename(temporaryPath, CSV_PATH);
}