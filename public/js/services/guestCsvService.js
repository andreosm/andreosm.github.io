import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
const CSV_PATH = path.join(process.cwd(), "data", "guests.csv");

function isFinished(guest) {
    const finished =
        typeof guest?.finished === "string"
                ? guest?.finished
                : "";

    const isFinished = finished === "true";
    
    return isFinished;
}

function nullableNumber(value) {
    if (!value?.trim()) {
        return null;
    }
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}
function mapRowToGuest(row) {
    const language = row.Language === "it" || row.Language === "pt" ? row.Language : "en";
    return {
        guid: row.GUID,
        accessCode: row.AccessCode,
        language,
        fullName: row.FullName,
        salutation: row.Salutation,
        relationship: row.Relationship,
        firstName: row.FirstName,
        lastName: row.LastName,
        showDisclaimer: row.ShowDisclaimer.trim().toLowerCase() === "true",
        sent: row.Sent,
        partySize: nullableNumber(row.PartySize),
        partySizeEst: nullableNumber(row.PartySizeEst),
        partySizeConf: nullableNumber(row.PartySizeConf),
        outOfTown: row.OutOfTown,
        wantsRecom: row.WantsRecom,
        star: row.Star,
        presenting: row.Presenting,
        song1: row.Song1,
        song2: row.Song2,
        song3: row.Song3,
        song4: row.Song4,
        song5: row.Song5,
        song6: row.Song6,
        song7: row.Song7,
        finished: row.Finished,
    };
}
async function readRows() {
    const csv = await fs.readFile(CSV_PATH, "utf8");
    return parse(csv, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
}
export async function findGuestByGuid(guid) {
    const rows = await readRows();
    const normalizedGuid = guid.trim().toLowerCase();
    const row = rows.find((r) => r.GUID.trim().toLowerCase() === normalizedGuid);
    if (!row) {
        return null;
    }
    return mapRowToGuest(row);
}
export async function findGuestByName(firstName, lastName) {
    const rows = await readRows();
    const normalizedFirstName = normalizeName(firstName);
    const normalizedLastName = normalizeName(lastName);
    const row = rows.find((row) => {
        const csvFirstName = normalizeName(row.FirstName);
        const csvLastName = normalizeName(row.LastName);
        return (csvFirstName === normalizedFirstName && csvLastName === normalizedLastName);
    });
    if (!row) {
        return null;
    }
    return mapRowToGuest(row);
}
export async function updateGuest(guest) {
    const rows = await readRows();
    const normalizedGuid = guest.guid.trim().toLowerCase();
    const row = rows.find((r) => r.GUID.trim().toLowerCase() === normalizedGuid);
    if (!row) {
        throw new Error("Guest GUID was not found.");
    }
    const isFinished = Number(guest.partySizeEst) == 0 ||
        Number(guest.partySizeConf) == 0 ||
        (Number(guest.partySizeEst) > 0 && guest?.star != "") ||
        (Number(guest.partySizeConf) > 0 && guest?.star != "");
    row.PartySizeEst = String(guest.partySizeEst);
    row.PartySizeConf = String(guest.partySizeConf);
    row.WantsRecom = String(guest.wantsRecom);
    row.Star = String(guest.star);
    row.Presenting = String(guest.presenting);
    row.Song1 = String(guest.song1);
    row.Song2 = String(guest.song2);
    row.Song3 = String(guest.song3);
    row.Song4 = String(guest.song4);
    row.Song5 = String(guest.song5);
    row.Song6 = String(guest.song6);
    row.Song7 = String(guest.song7);
    row.Finished = String(isFinished);
    const output = stringify(rows, {
        header: true,
        columns: [
            "GUID",
            "AccessCode",
            "Language",
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
            "Finished"
        ],
    });
    const temporaryPath = `${CSV_PATH}.tmp`;
    await fs.writeFile(temporaryPath, output, "utf8");
    await fs.rename(temporaryPath, CSV_PATH);
}
export async function updatePartySizeEstimate(guid, partySize) {
    const rows = await readRows();
    const normalizedGuid = guid.trim().toLowerCase();
    const row = rows.find((r) => r.GUID.trim().toLowerCase() === normalizedGuid);
    if (!row) {
        throw new Error("Guest GUID was not found.");
    }
    row.PartySizeEst = String(partySize);
    

    row.Finished = isFinished();
    const output = stringify(rows, {
        header: true,
        columns: [
            "GUID",
            "AccessCode",
            "Language",
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
    /*
          Write a temporary file first.
  
          This is safer than directly overwriting
          guests.csv.
      */
    const temporaryPath = `${CSV_PATH}.tmp`;
    await fs.writeFile(temporaryPath, output, "utf8");
    await fs.rename(temporaryPath, CSV_PATH);
}
function normalizeName(value) {
    return value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
