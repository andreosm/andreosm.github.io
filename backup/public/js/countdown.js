"use strict";
function updatePartyCountdown() {
    // Party starts July 18, 2027 at noon in São Paulo
    const partyDate = new Date("2027-07-18T12:00:00-03:00");
    const now = new Date();
    const difference = partyDate.getTime() - now.getTime();
    const countdown = document.getElementById("countdown");
    const countdownDays = document.getElementById("countdownDays");
    const countdownHours = document.getElementById("countdownHours");
    const countdownMinutes = document.getElementById("countdownMinutes");
    const countdownSeconds = document.getElementById("countdownSeconds");
    if (difference <= 0) {
        if (countdown) {
            countdown.textContent = "The celebration has begun!";
        }
        return;
    }
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    if (countdownDays) {
        countdownDays.textContent = days.toString();
    }
    if (countdownHours) {
        countdownHours.textContent = hours.toString();
    }
    if (countdownMinutes) {
        countdownMinutes.textContent = minutes.toString();
    }
    if (countdownSeconds) {
        countdownSeconds.textContent = seconds.toString();
    }
}
updatePartyCountdown();
window.setInterval(updatePartyCountdown, 1000);
