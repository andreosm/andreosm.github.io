// ============================================================
// CONFIGURATION
// ============================================================

const COLLISION_GAP = 10;

// Minimum distance between page content and top of viewport.
const CONTENT_MIN_TOP = 40;

// ============================================================
// PAGE ELEMENTS
// ============================================================

const pageContent = document.getElementById("pageContent");

// LEFT ARTWORK

const dateStamp = document.getElementById("dateStamp");
const shadowLeaf = document.getElementById("shadowLeaf");
const greenLeaf = document.getElementById("greenLeaf");
const fadedPostcard = document.getElementById("fadedPostcard");
// RIGHT ARTWORK

const alegriaStamp = document.getElementById("alegriaStamp");
const boaMusica = document.getElementById("boaMusica");

// BOTTOM ARTWORK

const skyline = document.getElementById("skyline");

// NAVIGATION

const desktopNav = document.getElementById("desktopNav");
const hamburgerButton = document.getElementById("hamburgerButton");
const mobileNav = document.getElementById("mobileNav");
const mobileNavClose = document.getElementById("mobileNavClose");

// ============================================================
// ELEMENT GROUPS
// ============================================================

const LEFT_OBJECTS = [dateStamp, shadowLeaf, greenLeaf, fadedPostcard];

const RIGHT_OBJECTS = [alegriaStamp, boaMusica];

const ALL_ARTWORK = [dateStamp, shadowLeaf, greenLeaf, fadedPostcard, alegriaStamp, boaMusica];

// ============================================================
// GEOMETRY HELPERS
// ============================================================

function getRect(element) {
  return element.getBoundingClientRect();
}

// ------------------------------------------------------------
// GENERIC RECTANGLE COLLISION
// ------------------------------------------------------------
//
// Returns true when two rectangles touch or come within
// COLLISION_GAP pixels of each other.
//
// IMPORTANT:
// We calculate geometry BEFORE changing visibility.
// ------------------------------------------------------------

function rectsTouch(a, b, gap = COLLISION_GAP) {
  return (
    a.right + gap >= b.left &&
    a.left - gap <= b.right &&
    a.bottom + gap >= b.top &&
    a.top - gap <= b.bottom
  );
}

// ------------------------------------------------------------
// LEFT OBJECT VS CONTENT
// ------------------------------------------------------------

function leftRectTouchesContent(rect, contentRect) {
  return rect.right + COLLISION_GAP >= contentRect.left;
}

// ------------------------------------------------------------
// RIGHT OBJECT VS CONTENT
// ------------------------------------------------------------

function rightRectTouchesContent(rect, contentRect) {
  return rect.left - COLLISION_GAP <= contentRect.right;
}

// ------------------------------------------------------------
// SKYLINE VS CONTENT
// ------------------------------------------------------------

function skylineRectTouchesContent(skylineRect, contentRect) {
  return (
    skylineRect.top - COLLISION_GAP <= contentRect.bottom &&
    skylineRect.bottom + COLLISION_GAP >= contentRect.top &&
    skylineRect.right + COLLISION_GAP >= contentRect.left &&
    skylineRect.left - COLLISION_GAP <= contentRect.right
  );
}

// ------------------------------------------------------------
// NAVBAR VS CONTENT
//
// This preserves your CURRENT navbar breakpoint behavior.
//
// Desktop navigation disappears when it reaches the content.
// ------------------------------------------------------------

function navbarRectTouchesContent(navRect, contentRect) {
  return navRect.left - COLLISION_GAP <= contentRect.right;
}

// ============================================================
// SHOW / HIDE
// ============================================================

function hideElement(element) {
  element.classList.add("art-hidden");
}

function showElement(element) {
  element.classList.remove("art-hidden");
}

// ============================================================
// MOBILE NAVIGATION
// ============================================================

function openMobileNavigation() {
  mobileNav.classList.add("open");

  mobileNav.setAttribute("aria-hidden", "false");

  hamburgerButton.setAttribute("aria-expanded", "true");
}

function closeMobileNavigation() {
  mobileNav.classList.remove("open");

  mobileNav.setAttribute("aria-hidden", "true");

  hamburgerButton.setAttribute("aria-expanded", "false");
}

// ------------------------------------------------------------
// SHOW DESKTOP NAVIGATION
// ------------------------------------------------------------

function showDesktopNavigation() {
  desktopNav.classList.remove("desktop-nav-hidden");

  hamburgerButton.style.display = "none";

  closeMobileNavigation();
}

// ------------------------------------------------------------
// SHOW HAMBURGER NAVIGATION
// ------------------------------------------------------------

function showHamburgerNavigation() {
  desktopNav.classList.add("desktop-nav-hidden");

  hamburgerButton.style.display = "block";
}

// ============================================================
// PAGE CONTENT VERTICAL POSITION
// ============================================================
//
// The content is normally vertically centered by your CSS.
//
// As the window becomes shorter, however, vertical centering
// could push the top of the content too close to (or above)
// the top of the viewport.
//
// We therefore allow normal CSS centering until the content
// reaches 40px from the top.
//
// At that point it remains at 40px.
// ============================================================

function positionPageContent() {
  // First remove any correction from a previous resize so
  // the browser can calculate the natural CSS position.

  pageContent.style.transform = "";

  const rect = getRect(pageContent);

  // Content is still at least 40px from the top.
  // Let the normal CSS positioning remain in effect.

  if (rect.top >= CONTENT_MIN_TOP) {
    return;
  }

  // Determine how far downward the content must move.

  const correction = CONTENT_MIN_TOP - rect.top;

  // Move it downward just enough to maintain 40px.

  pageContent.style.transform = `translateY(${correction}px)`;
}

// ============================================================
// MAIN RESIZE HANDLER
// ============================================================

function handleWindowResize() {
  // ========================================================
  // 0. POSITION PAGE CONTENT
  // ========================================================

  positionPageContent();

  // ========================================================
  // 1. RESET ELEMENT VISIBILITY FOR MEASUREMENT
  //
  // We temporarily restore everything so that
  // getBoundingClientRect() always gives us the geometry
  // of every object.
  //
  // This prevents:
  //
  // skyline disappears
  //       ↓
  // green leaf no longer sees skyline
  //       ↓
  // green leaf incorrectly reappears
  //
  // ========================================================

  ALL_ARTWORK.forEach(showElement);

  showElement(skyline);

  desktopNav.classList.remove("desktop-nav-hidden");

  // ========================================================
  // 2. MEASURE EVERYTHING
  //
  // IMPORTANT:
  //
  // From this point onward we DO NOT change visibility
  // until all collision decisions have been calculated.
  // ========================================================

  const contentRect = getRect(pageContent);

  const dateStampRect = getRect(dateStamp);
  const shadowLeafRect = getRect(shadowLeaf);
  const greenLeafRect = getRect(greenLeaf);
  const fadedPostcardRect = getRect(fadedPostcard);

  const alegriaRect = getRect(alegriaStamp);
  const boaMusicaRect = getRect(boaMusica);

  const skylineRect = getRect(skyline);

  const navRect = getRect(desktopNav);

  const windowWidth = window.innerWidth;

  // ========================================================
  // 3. DETERMINE NAVBAR STATE
  //
  // Preserve the existing navbar behavior:
  //
  // navbar reaches page content
  //        ↓
  // desktop navbar disappears
  //        ↓
  // hamburger appears
  //
  // ========================================================

  const shouldUseHamburger = navbarRectTouchesContent(navRect, contentRect);

  // ========================================================
  // 4. DETERMINE SKYLINE STATE
  //
  // Skyline disappears when:
  //
  // A. It touches the page content vertically/horizontally.
  //
  // B. It touches the desktop navbar.
  //
  // C. There is not enough horizontal room for both the
  //    skyline and navbar.
  //
  // ========================================================

  // --------------------------------------------------------
  // A. Skyline vs page content
  // --------------------------------------------------------

  const skylineTouchesContent = skylineRectTouchesContent(
    skylineRect,
    contentRect,
  );

  // --------------------------------------------------------
  // B. Skyline vs navbar
  // --------------------------------------------------------

  const skylineTouchesNavbar = rectsTouch(skylineRect, navRect);

  // --------------------------------------------------------
  // C. Enough width for skyline + navbar?
  //
  // Skyline starts from its normal left position.
  //
  // Navbar starts at navRect.left.
  //
  // Therefore the skyline must finish at least
  // COLLISION_GAP pixels before the navbar.
  // --------------------------------------------------------

  const skylineTooWideForNavbar =
    skylineRect.right + COLLISION_GAP >= navRect.left;

  // --------------------------------------------------------
  // Final skyline decision
  // --------------------------------------------------------

  const shouldHideSkyline =
    skylineTouchesContent || skylineTouchesNavbar || skylineTooWideForNavbar;

  // ========================================================
  // 5. LEFT-SIDE ARTWORK
  //
  // ORDER OF DISAPPEARANCE:
  //
  // Date Stamp
  // Shadow Leaf
  // Green Leaf
  //
  // Each disappears if it collides with:
  //
  // - Page content
  // - Navbar
  // - Skyline
  //
  // IMPORTANT:
  //
  // We test against the skyline geometry even when the
  // skyline itself is going to disappear.
  //
  // This prevents the green leaf from reappearing.
  // ========================================================

  // --------------------------------------------------------
  // FADED POSTCARD
    // --------------------------------------------------------
    
    const hideFadedPostcard =
        leftRectTouchesContent(fadedPostcardRect, contentRect) ||
        rectsTouch(fadedPostcardRect, navRect) ||
        rectsTouch(fadedPostcardRect, skylineRect);

  // --------------------------------------------------------
  // DATE STAMP
  // --------------------------------------------------------

  const hideDateStamp =
    leftRectTouchesContent(dateStampRect, contentRect) ||
    rectsTouch(dateStampRect, navRect) ||
    rectsTouch(dateStampRect, skylineRect);

  // --------------------------------------------------------
  // SHADOW LEAF
  // --------------------------------------------------------

  const hideShadowLeaf =
    leftRectTouchesContent(shadowLeafRect, contentRect) ||
    rectsTouch(shadowLeafRect, navRect) ||
    rectsTouch(shadowLeafRect, skylineRect);

  // --------------------------------------------------------
  // GREEN LEAF
  // --------------------------------------------------------

  const hideGreenLeaf =
    leftRectTouchesContent(greenLeafRect, contentRect) ||
    rectsTouch(greenLeafRect, navRect) ||
    rectsTouch(greenLeafRect, skylineRect);

  // ========================================================
  // 6. RIGHT-SIDE ARTWORK
  //
  // Alegria
  // Boa Musica
  //
  // Each disappears if it collides with:
  //
  // - Page content
  // - Navbar
  // - Skyline
  // ========================================================

  // --------------------------------------------------------
  // ALEGRIA
  // --------------------------------------------------------

  const hideAlegria =
    rightRectTouchesContent(alegriaRect, contentRect) ||
    rectsTouch(alegriaRect, skylineRect);

  // --------------------------------------------------------
  // BOA MUSICA
  // --------------------------------------------------------

  const hideBoaMusica =
    rightRectTouchesContent(boaMusicaRect, contentRect) ||
    rectsTouch(boaMusicaRect, navRect) ||
    rectsTouch(boaMusicaRect, skylineRect);

  // ========================================================
  // 7. APPLY ARTWORK VISIBILITY
  //
  // Only NOW do we actually hide/show anything.
  // ========================================================

  // --------------------------------------------------------
  // LEFT
    // --------------------------------------------------------
    
    if (hideFadedPostcard) {
        hideElement(fadedPostcard);
    } else {
        showElement(fadedPostcard);
  }

  if (hideDateStamp) {
    hideElement(dateStamp);
  } else {
    showElement(dateStamp);
  }

  if (hideShadowLeaf) {
    hideElement(shadowLeaf);
  } else {
    showElement(shadowLeaf);
  }

  if (hideGreenLeaf) {
    hideElement(greenLeaf);
  } else {
    showElement(greenLeaf);
  }

  // --------------------------------------------------------
  // RIGHT
  // --------------------------------------------------------

  if (hideAlegria) {
    hideElement(alegriaStamp);
  } else {
    showElement(alegriaStamp);
  }

  if (hideBoaMusica) {
    hideElement(boaMusica);
  } else {
    showElement(boaMusica);
  }

  // ========================================================
  // 8. APPLY SKYLINE VISIBILITY
  // ========================================================

  if (shouldHideSkyline) {
    hideElement(skyline);
  } else {
    showElement(skyline);
  }

  // ========================================================
  // 9. APPLY NAVIGATION STATE LAST
  //
  // This is intentionally last.
  //
  // Artwork and skyline collision decisions were based on
  // the desktop navbar's ORIGINAL geometry.
  //
  // Therefore hiding the navbar cannot cause another
  // object to suddenly reappear.
  // ========================================================

  if (shouldUseHamburger) {
    showHamburgerNavigation();
  } else {
    showDesktopNavigation();
  }
}

// ============================================================
// RESIZE OPTIMIZATION
// ============================================================

let resizeFrame = null;

function requestResize() {
  if (resizeFrame !== null) {
    return;
  }

  resizeFrame = requestAnimationFrame(() => {
    handleWindowResize();

    resizeFrame = null;
  });
}

// ============================================================
// EVENT HANDLERS
// ============================================================

// ------------------------------------------------------------
// WINDOW RESIZE
// ------------------------------------------------------------

window.addEventListener("resize", requestResize);

// ------------------------------------------------------------
// INITIAL PAGE LOAD
// ------------------------------------------------------------

window.addEventListener("DOMContentLoaded", handleWindowResize);

// ------------------------------------------------------------
// OPEN MOBILE MENU
// ------------------------------------------------------------

hamburgerButton.addEventListener("click", openMobileNavigation);

// ------------------------------------------------------------
// CLOSE MOBILE MENU WITH X
// ------------------------------------------------------------

mobileNavClose.addEventListener("click", closeMobileNavigation);

// ------------------------------------------------------------
// CLOSE MOBILE MENU WITH ESCAPE KEY
// ------------------------------------------------------------

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileNavigation();
  }
});

// ------------------------------------------------------------
// CLOSE MOBILE MENU AFTER CLICKING A LINK
// ------------------------------------------------------------

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileNavigation);
});
