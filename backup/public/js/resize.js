"use strict";
// ============================================================
// CONFIGURATION
// ============================================================
const MOBILE_BREAKPOINT = 700;
// Values shared with CSS are read from :root so CSS remains
// the single source of truth for desktop geometry.
function getCssNumber(variableName) {
    const rawValue = getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
    const value = Number.parseFloat(rawValue);
    if (Number.isNaN(value)) {
        throw new Error(`CSS variable ${variableName} is not a numeric value.`);
    }
    return value;
}
function cssCollisionGap() {
    return getCssNumber("--collision-gap");
}
function cssContentMinDist() {
    return getCssNumber("--content-min-dist");
}
function cssRightArtMaxNavGap() {
    return getCssNumber("--right-art-max-nav-gap");
}
function cssPostcardStripSize() {
    return getCssNumber("--postcard-strip-size");
}
// ============================================================
// PAGE ELEMENTS
// ============================================================
function requireElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Required element #${id} was not found.`);
    }
    return element;
}
const pageContent = requireElement("pageContent");
// LEFT ARTWORK
const dateStamp = requireElement("dateStamp");
const shadowLeaf = requireElement("shadowLeaf");
const greenLeaf = requireElement("greenLeaf");
//const fadedPostcard = requireElement<HTMLImageElement>("fadedPostcard");
// RIGHT ARTWORK
const alegriaStamp = requireElement("alegriaStamp");
const boaMusica = requireElement("boaMusica");
// BOTTOM ARTWORK
const skyline = requireElement("skyline");
// NAVIGATION
const desktopNav = requireElement("desktopNav");
const hamburgerButton = requireElement("hamburgerButton");
const mobileNav = requireElement("mobileNav");
const mobileNavClose = requireElement("mobileNavClose");
// ============================================================
// ELEMENT GROUPS
// ============================================================
const LEFT_OBJECTS = [
    dateStamp,
    shadowLeaf,
    greenLeaf,
    // fadedPostcard,
];
const RIGHT_OBJECTS = [alegriaStamp, boaMusica];
const ALL_ARTWORK = [...LEFT_OBJECTS, ...RIGHT_OBJECTS];
// ============================================================
// GEOMETRY HELPERS
// ============================================================
function getRect(element) {
    return element.getBoundingClientRect();
}
function isMobileLayout() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
}
function rectanglesTouch(a, b, gap = cssCollisionGap()) {
    return (a.right + gap >= b.left &&
        a.left - gap <= b.right &&
        a.bottom + gap >= b.top &&
        a.top - gap <= b.bottom);
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
function showDesktopNavigation() {
    desktopNav.classList.remove("desktop-nav-hidden");
    hamburgerButton.style.display = "none";
    closeMobileNavigation();
}
function showHamburgerNavigation() {
    desktopNav.classList.add("desktop-nav-hidden");
    hamburgerButton.style.display = "block";
}
// ============================================================
// PAGE CONTENT VERTICAL POSITION
// ============================================================
//
// CSS supplies the normal vertical position. TypeScript only
// intervenes when the natural top would rise above the minimum
// allowed top gap.
//
// Horizontal centering is entirely CSS-driven.
// ============================================================
function positionPageContentVertically() {
    const contentMinTop = cssContentMinDist();
    // Restore the normal CSS transform first.
    pageContent.style.transform = "";
    const rect = getRect(pageContent);
    if (rect.top >= contentMinTop) {
        return;
    }
    const correction = contentMinTop - rect.top;
    /*
         The normal CSS transform is:
             translate(-50%, -50%)
  
         Because an inline transform replaces the stylesheet
         transform, preserve the horizontal and vertical centering
         and add only the required downward correction.
      */
    pageContent.style.transform = `translate(-50%, calc(-50% + ${correction}px))`;
}
// ============================================================
// HORIZONTAL ARTWORK PLACEMENT
// ============================================================
/*
   Center an object inside a horizontal corridor.

   The object must remain at least COLLISION_GAP away from both
   boundaries. If it cannot fit, false is returned.
*/
function centerArtworkInCorridor(artwork, leftBoundary, rightBoundary) {
    const collisionGap = cssCollisionGap();
    const artworkWidth = getRect(artwork).width;
    const usableLeft = leftBoundary + collisionGap;
    const usableRight = rightBoundary - collisionGap;
    const usableWidth = usableRight - usableLeft;
    if (usableWidth < artworkWidth) {
        return false;
    }
    const left = usableLeft + (usableWidth - artworkWidth) / 2;
    artwork.style.left = `${left}px`;
    artwork.style.right = "auto";
    return true;
}
/*
   Place a right-side object between a central object and the
   navbar.

   Preferred position:
       centered in the available corridor.

   Additional rule:
       its right edge should be no more than 70px from the
       navbar whenever the available space permits it.

   As the window narrows, the 70px preferred gap is allowed to
   shrink all the way down to COLLISION_GAP.
*/
function positionRightArtwork(artwork, skylineRight, navbarLeft) {
    const minimumDistance = cssContentMinDist();
    const artworkWidth = getRect(artwork).width;
    // Available horizontal corridor:
    //
    //     SKYLINE RIGHT  <---------- space ---------->  NAVBAR LEFT
    //
    const availableWidth = navbarLeft - skylineRight;
    // If the object itself cannot fit in the corridor, hide it.
    if (availableWidth < artworkWidth) {
        return false;
    }
    // First center the artwork between the skyline and navbar.
    let artworkLeft = skylineRight + (availableWidth - artworkWidth) / 2;
    let artworkRight = artworkLeft + artworkWidth;
    // Measure the gap from the artwork's RIGHT edge to the
    // navbar's LEFT edge.
    const gapToNavbar = navbarLeft - artworkRight;
    // If centering leaves more than the normal minimum distance
    // (40px) to the navbar, move the artwork right until its
    // right edge is exactly that distance from the navbar.
    if (gapToNavbar > minimumDistance) {
        artworkRight = navbarLeft - minimumDistance;
        artworkLeft = artworkRight - artworkWidth;
    }
    artwork.style.left = `${artworkLeft}px`;
    artwork.style.right = "auto";
    return true;
}
// ============================================================
// DATE STAMP POSITION
// ============================================================
//
// The date stamp occupies the horizontal space between the
// postcard strip and page content.
//
// Its vertical top remains controlled by CSS at 40px.
// ============================================================
function positionDateStamp(contentRect) {
    return centerArtworkInCorridor(dateStamp, cssPostcardStripSize(), contentRect.left);
}
// ============================================================
// NAVIGATION STATE
// ============================================================
//
// The centered page content never moves to make room for the
// navbar.
//
// Instead, the desktop navbar switches to the hamburger when
// the navbar reaches the centered content.
// ============================================================
function shouldUseHamburger(contentRect, navRect) {
    return navRect.left - cssCollisionGap() <= contentRect.right;
}
// ============================================================
// DESKTOP ARTWORK COLLISION CHECKS
// ============================================================
function leftArtworkFits(artwork, contentRect, skylineRect) {
    const artworkRect = getRect(artwork);
    const collisionGap = cssCollisionGap();
    if (artworkRect.right + collisionGap >= contentRect.left) {
        return false;
    }
    if (rectanglesTouch(artworkRect, skylineRect)) {
        return false;
    }
    return true;
}
// ============================================================
// DESKTOP LAYOUT
// ============================================================
function handleDesktopLayout() {
    // --------------------------------------------------------
    // 1. Restore natural visibility/position for measurement
    // --------------------------------------------------------
    ALL_ARTWORK.forEach(showElement);
    showElement(skyline);
    desktopNav.classList.remove("desktop-nav-hidden");
    // Clear JS horizontal positioning before measuring.
    dateStamp.style.left = "";
    dateStamp.style.right = "";
    alegriaStamp.style.left = "auto";
    alegriaStamp.style.right = "0px";
    boaMusica.style.left = "auto";
    boaMusica.style.right = "0px";
    // --------------------------------------------------------
    // 2. Position content vertically
    // --------------------------------------------------------
    positionPageContentVertically();
    // --------------------------------------------------------
    // 3. Measure the fixed central composition
    // --------------------------------------------------------
    const contentRect = getRect(pageContent);
    const skylineRect = getRect(skyline);
    const navRect = getRect(desktopNav);
    // --------------------------------------------------------
    // 4. Determine navigation state
    // --------------------------------------------------------
    const useHamburger = shouldUseHamburger(contentRect, navRect);
    // --------------------------------------------------------
    // 5. DATE STAMP
    // --------------------------------------------------------
    const dateStampHasSpace = positionDateStamp(contentRect);
    const dateStampFits = dateStampHasSpace && leftArtworkFits(dateStamp, contentRect, skylineRect);
    if (dateStampFits) {
        showElement(dateStamp);
    }
    else {
        hideElement(dateStamp);
    }
    // --------------------------------------------------------
    // 6. SHADOW LEAF
    // --------------------------------------------------------
    //
    // CSS anchors it:
    //   left = 30px
    //   top  = halfway down the 500px left strip
    //
    // It remains there until it reaches content or skyline.
    // --------------------------------------------------------
    if (leftArtworkFits(shadowLeaf, contentRect, skylineRect)) {
        showElement(shadowLeaf);
    }
    else {
        hideElement(shadowLeaf);
    }
    // --------------------------------------------------------
    // 7. GREEN LEAF
    // --------------------------------------------------------
    //
    // CSS anchors it:
    //   left   = 0
    //   bottom = bottom strip + collision gap
    // --------------------------------------------------------
    if (leftArtworkFits(greenLeaf, contentRect, skylineRect)) {
        showElement(greenLeaf);
    }
    else {
        hideElement(greenLeaf);
    }
    // --------------------------------------------------------
    // 8. FADED POSTCARD
    // --------------------------------------------------------
    //
    // Preserve its page-specific CSS positioning and normal
    // collision behavior.
    // --------------------------------------------------------
    // if (leftArtworkFits(fadedPostcard, contentRect, skylineRect)) {
    //   //showElement(fadedPostcard);
    // } else {
    //   //hideElement(fadedPostcard);
    // }
    // --------------------------------------------------------
    // 9. ALEGRIA
    // --------------------------------------------------------
    //
    // Vertical:
    //   top = 40px
    //
    // Horizontal:
    //   between skyline right edge and navbar left edge
    //   center in that corridor first
    //   if its right edge is more than --content-min-dist from
    //   the navbar, move it right to exactly that distance
    // --------------------------------------------------------
    const alegriaFits = positionRightArtwork(alegriaStamp, skylineRect.right, navRect.left);
    if (alegriaFits) {
        showElement(alegriaStamp);
    }
    else {
        hideElement(alegriaStamp);
    }
    // --------------------------------------------------------
    // 10. BOA MUSICA
    // --------------------------------------------------------
    //
    // Vertical:
    //   bottom = bottom strip + collision gap
    //
    // Horizontal:
    //   same rule as alegriaStamp:
    //   between skyline right edge and navbar left edge
    //   center first, then cap the navbar gap at
    //   --content-min-dist
    // --------------------------------------------------------
    const boaMusicaFits = positionRightArtwork(boaMusica, skylineRect.right, navRect.left);
    if (boaMusicaFits) {
        showElement(boaMusica);
    }
    else {
        hideElement(boaMusica);
    }
    // --------------------------------------------------------
    // 11. SKYLINE
    // --------------------------------------------------------
    //
    // The skyline is now the visual anchor.
    // It remains centered on the VIEWPORT and is no longer
    // moved or hidden merely because of the navbar.
    //
    // Preserve the vertical content collision rule.
    // --------------------------------------------------------
    const skylineTouchesContent = rectanglesTouch(skylineRect, contentRect);
    if (skylineTouchesContent) {
        hideElement(skyline);
    }
    else {
        showElement(skyline);
    }
    // --------------------------------------------------------
    // 12. APPLY NAVIGATION STATE LAST
    // --------------------------------------------------------
    if (useHamburger) {
        showHamburgerNavigation();
    }
    else {
        showDesktopNavigation();
    }
}
// ============================================================
// MOBILE LAYOUT
// ============================================================
function handleMobileLayout() {
    /*
         At <= 700px CSS owns the page layout.
  
         Desktop artwork is hidden and mobile artwork is in normal
         document flow. Do not run desktop collision calculations.
      */
    desktopNav.classList.add("desktop-nav-hidden");
    hamburgerButton.style.display = "block";
    // Remove any desktop correction from pageContent.
    pageContent.style.transform = "";
    // Remove desktop JS positions so a later return to desktop
    // starts from clean CSS geometry.
    dateStamp.style.left = "";
    dateStamp.style.right = "";
    alegriaStamp.style.left = "";
    alegriaStamp.style.right = "";
    boaMusica.style.left = "";
    boaMusica.style.right = "";
}
// ============================================================
// MAIN RESIZE HANDLER
// ============================================================
function handleWindowResize() {
    if (isMobileLayout()) {
        handleMobileLayout();
        return;
    }
    handleDesktopLayout();
}
// ============================================================
// RESIZE OPTIMIZATION
// ============================================================
let resizeFrame = null;
function requestResize() {
    if (resizeFrame !== null) {
        return;
    }
    resizeFrame = window.requestAnimationFrame(() => {
        handleWindowResize();
        resizeFrame = null;
    });
}
// ============================================================
// EVENT HANDLERS
// ============================================================
// window.addEventListener("resize", requestResize);
// window.addEventListener("DOMContentLoaded", handleWindowResize);
hamburgerButton.addEventListener("click", openMobileNavigation);
mobileNavClose.addEventListener("click", closeMobileNavigation);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileNavigation();
    }
});
mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNavigation);
});
