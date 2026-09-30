function updatePartyCountdown() {
  // Party starts July 18, 2027 at noon in São Paulo
  const partyDate = new Date("2027-07-18T12:00:00-03:00");

  const now = new Date();
  const difference = partyDate - now;

  if (difference <= 0) {
    document.getElementById("countdown").textContent =
      "The celebration has begun!";

    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

  const minutes = Math.floor((difference / (1000 * 60)) % 60);

  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById("countdownDays").textContent = days;
  document.getElementById("countdownHours").textContent = hours;
  document.getElementById("countdownMinutes").textContent = minutes;
  document.getElementById("countdownSeconds").textContent = seconds;
}

updatePartyCountdown();

setInterval(updatePartyCountdown, 1000);