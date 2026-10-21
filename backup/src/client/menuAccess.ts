function updateMenuAccess(): void {
  const partyVisited = localStorage.getItem("partyVisited") === "true";

  const starVisited = localStorage.getItem("beAStarVisited") === "true";

  const partyMenuItem = document.getElementById("navTheParty");

  const starMenuItem = document.getElementById("navBeAStar");

  if (partyMenuItem) {
    partyMenuItem.style.display = partyVisited ? "" : "none";
  }

  if (starMenuItem) {
    starMenuItem.style.display = starVisited ? "" : "none";
  }   

}

    document.addEventListener("DOMContentLoaded", () => {
        localStorage.removeItem("partyVisited");
        localStorage.removeItem("beAStarVisited");
        //updateMenuAccess();
    });