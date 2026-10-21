"use strict";
// ============================================================
// CONFIGURATION
// ============================================================
const MOBILE_BREAKPOINT = 700;
/*
    ============================================================
    SCALE-1 REFERENCE DESIGN
    ============================================================

    Reference viewport:

        2560 x 1440

    At Scale 1:

        Preferred gap       = 30px
        Collision gap       = 10px
        Strip size          = 30px
        Navbar width        = 200px
        Green Leaf width    = 200px
        Shadow Leaf width   = 200px
        Skyline inset       = 230px
        Alegria width       = 200px

    The responsive scale, compression from 30px to 10px,
    artwork scaling and disappearance rules will be added
    after the Scale-1 composition is visually confirmed.
*/
const DESIGN = {
    width: 2560,
    height: 1440,
    stripSize: 30,
    collisionGap: 10,
    gap: 30,
    navbarWidth: 200,
    greenLeafWidth: 200,
    shadowLeafWidth: 200,
    skylineInset: 230,
    alegriaWidth: 200,
};
// ============================================================
// CSS HELPERS
// ============================================================
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
const LEFT_OBJECTS = [dateStamp, shadowLeaf, greenLeaf];
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
function rectanglesTouch(a, b, gap = DESIGN.collisionGap) {
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
// RESET DESKTOP INLINE GEOMETRY
// ============================================================
//
// This is important when returning from mobile layout.
//
// We deliberately DO NOT reset Alegria or Boa Música to
// right: 0px. That was the source of the previous horizontal
// jumping behavior.
//
// ============================================================
function resetDesktopGeometry() {
    pageContent.style.left = "";
    pageContent.style.right = "";
    pageContent.style.top = "";
    pageContent.style.bottom = "";
    pageContent.style.width = "";
    pageContent.style.height = "";
    pageContent.style.transform = "";
    dateStamp.style.left = "";
    dateStamp.style.right = "";
    shadowLeaf.style.left = "";
    shadowLeaf.style.right = "";
    shadowLeaf.style.width = "";
    greenLeaf.style.left = "";
    greenLeaf.style.right = "";
    greenLeaf.style.width = "";
    alegriaStamp.style.left = "";
    alegriaStamp.style.right = "";
    alegriaStamp.style.width = "";
    boaMusica.style.left = "";
    boaMusica.style.right = "";
    skyline.style.left = "";
    skyline.style.right = "";
    skyline.style.width = "";
    skyline.style.transform = "";
    desktopNav.style.left = "";
    desktopNav.style.right = "";
    desktopNav.style.width = "";
}
// ============================================================
// SCALE-1 NAVIGATION
// ============================================================
//
// Reference viewport:
//
//     2560px
//
// Navbar:
//
//     width = 200px
//
// Therefore:
//
//     navbar.left = 2360px
//
// ============================================================
function positionScaleOneNavbar() {
    desktopNav.style.position = "fixed";
    desktopNav.style.width = `${DESIGN.navbarWidth}px`;
    desktopNav.style.left = "auto";
    desktopNav.style.right = "0px";
    /*
          Keep the navigation between the postcard
          strips vertically.
      */
    desktopNav.style.top = `${DESIGN.stripSize}px`;
    desktopNav.style.bottom = `${DESIGN.stripSize}px`;
}
// ============================================================
// SCALE-1 GREEN LEAF
// ============================================================
//
// Rule E:
//
//     left  = 0
//     width = 200
//
// Therefore:
//
//     right = 200
//
// Skyline begins at:
//
//     x = 230
//
// Gap:
//
//     230 - 200 = 30px
//
// ============================================================
function positionScaleOneGreenLeaf() {
    greenLeaf.style.left = "0px";
    greenLeaf.style.right = "auto";
    greenLeaf.style.width = `${DESIGN.greenLeafWidth}px`;
    greenLeaf.style.height = "auto";
}
// ============================================================
// SCALE-1 SHADOW LEAF
// ============================================================
//
// Rule F:
//
//     left  = 30
//     width = 200
//
// Therefore:
//
//     right = 230
//
// This aligns its right side exactly with
// skyline.left.
//
// ============================================================
function positionScaleOneShadowLeaf() {
    shadowLeaf.style.left = `${DESIGN.gap}px`;
    shadowLeaf.style.right = "auto";
    shadowLeaf.style.width = `${DESIGN.shadowLeafWidth}px`;
    shadowLeaf.style.height = "auto";
}
// ============================================================
// SCALE-1 SKYLINE
// ============================================================
//
// Rule G:
//
//     skyline.left  = 230
//     skyline.right = 230 from viewport right
//
// At 2560:
//
//     width = 2560 - 230 - 230
//           = 2100
//
// ============================================================
function positionScaleOneSkyline() {
    const skylineLeft = DESIGN.skylineInset;
    const skylineRight = DESIGN.width - DESIGN.skylineInset;
    const skylineWidth = skylineRight - skylineLeft;
    skyline.style.position = "fixed";
    skyline.style.left = `${skylineLeft}px`;
    skyline.style.right = "auto";
    skyline.style.width = `${skylineWidth}px`;
    /*
          Maintain the original aspect ratio.
      */
    skyline.style.height = "auto";
    /*
          Skyline sits immediately above
          the bottom postcard strip.
      */
    skyline.style.bottom = `${DESIGN.stripSize}px`;
    /*
          The previous CSS centered the skyline with:
  
              left: 50%;
              transform: translateX(-50%);
  
          Scale-1 geometry now defines the exact left
          coordinate and width.
      */
    skyline.style.transform = "none";
}
// ============================================================
// SCALE-1 ALEGRIA
// ============================================================
//
// Rule H:
//
//     navbar.left = 2360
//
//     Alegria must be 30px from navbar:
//
//         alegria.right = 2360 - 30
//                       = 2330
//
//     alegria.width = 200
//
//         alegria.left = 2330 - 200
//                      = 2130
//
// Notice:
//
//     alegria.right = skyline.right = 2330
//
// ============================================================
function positionScaleOneAlegria() {
    const navbarLeft = DESIGN.width - DESIGN.navbarWidth;
    const alegriaRight = navbarLeft - DESIGN.gap;
    const alegriaLeft = alegriaRight - DESIGN.alegriaWidth;
    alegriaStamp.style.left = `${alegriaLeft}px`;
    alegriaStamp.style.right = "auto";
    alegriaStamp.style.width = `${DESIGN.alegriaWidth}px`;
    alegriaStamp.style.height = "auto";
    return {
        left: alegriaLeft,
        right: alegriaRight,
        width: DESIGN.alegriaWidth,
    };
}
// ============================================================
// SCALE-1 DATE STAMP
// ============================================================
//
// Rule I:
//
// Date Stamp is narrower than Alegria.
//
// We do NOT make their outside edges symmetrical.
//
// Instead, these INNER boundaries are symmetrical:
//
//     Date Stamp right = 430
//     Alegria left     = 2130
//
// Center:
//
//     1280
//
// Therefore:
//
//     1280 - 430  = 850
//     2130 - 1280 = 850
//
// The Date Stamp's left edge depends on its actual
// rendered width.
//
// ============================================================
function positionScaleOneDateStamp(alegriaLeft) {
    const dateStampRight = DESIGN.width - alegriaLeft;
    /*
          At Scale 1:
  
              2560 - 2130 = 430
      */
    const dateStampWidth = getRect(dateStamp).width;
    const dateStampLeft = dateStampRight - dateStampWidth;
    dateStamp.style.left = `${dateStampLeft}px`;
    dateStamp.style.right = "auto";
    return {
        left: dateStampLeft,
        right: dateStampRight,
        width: dateStampWidth,
    };
}
// ============================================================
// SCALE-1 PAGE CONTENT
// ============================================================
//
// Rule J:
//
// Horizontal:
//
//     Date Stamp right = 430
//
//     + 30px preferred gap
//
//     content.left = 460
//
//
//     Alegria left = 2130
//
//     - 30px preferred gap
//
//     content.right = 2100
//
//
//     content.width:
//
//         2100 - 460 = 1640
//
//
// Vertical:
//
//     top strip:
//
//         0 -> 30
//
//     preferred gap:
//
//         30 -> 60
//
//     content.top:
//
//         60
//
//     content.bottom:
//
//         skyline.top - 30
//
// Therefore the content fills the available vertical
// corridor while preserving the preferred 30px gap.
//
// ============================================================
function positionScaleOnePageContent(dateStampRight, alegriaLeft) {
    // --------------------------------------------------------
    // Horizontal
    // --------------------------------------------------------
    const contentLeft = dateStampRight + DESIGN.gap;
    const contentRight = alegriaLeft - DESIGN.gap;
    const contentWidth = contentRight - contentLeft;
    // --------------------------------------------------------
    // Vertical
    // --------------------------------------------------------
    /*
          The skyline must already have its final Scale-1
          dimensions before this measurement.
      */
    const skylineRect = getRect(skyline);
    const skylineTop = skylineRect.top;
    const contentTop = DESIGN.stripSize + DESIGN.gap;
    const contentBottom = skylineTop - DESIGN.gap;
    const contentHeight = contentBottom - contentTop;
    // --------------------------------------------------------
    // Apply
    // --------------------------------------------------------
    pageContent.style.position = "fixed";
    pageContent.style.left = `${contentLeft}px`;
    pageContent.style.right = "auto";
    pageContent.style.top = `${contentTop}px`;
    pageContent.style.bottom = "auto";
    pageContent.style.width = `${contentWidth}px`;
    pageContent.style.height = `${Math.max(0, contentHeight)}px`;
    /*
          We no longer use:
  
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
  
          The content now occupies a calculated rectangle.
      */
    pageContent.style.transform = "none";
    return {
        left: contentLeft,
        right: contentRight,
        top: contentTop,
        bottom: contentBottom,
        width: contentWidth,
        height: contentHeight,
    };
}
// ============================================================
// SCALE-1 BOA MUSICA
// ============================================================
//
// Boa Música preserves its CSS vertical position.
//
// Horizontally, its LEFT edge is positioned halfway
// through the navbar:
//
//     navbar.left = 2360
//     navbar.width = 200
//
//     boa.left = navbar.left - (navbar.width / 2)
//
//              = 2360 - 100
//              = 2260
//
// Therefore Boa Música extends into the navbar area.
// Its natural CSS width is preserved.
//
// ============================================================
function positionScaleOneBoaMusica() {
    //   const navbarLeft = DESIGN.width - DESIGN.navbarWidth;
    //   const boaWidth = getRect(boaMusica).width;
    //   /*
    //         Retained because it is currently part of the
    //         returned diagnostic geometry.
    //     */
    //   const boaRight = navbarLeft - DESIGN.gap;
    //   /*
    //         Current visually approved Scale-1 position.
    //         Boa Música's LEFT edge is positioned one-half
    //         navbar width to the left of navbar.left.
    //     */
    //   const boaLeft = navbarLeft - DESIGN.navbarWidth / 2;
    //   boaMusica.style.left = `${boaLeft}px`;
    //   boaMusica.style.right = "auto";
    //   return {
    //     left: boaLeft,
    //     right: boaRight,
    //     width: boaWidth,
    //   };
    const navbarLeft = DESIGN.width - DESIGN.navbarWidth;
    const boaWidth = getRect(boaMusica).width;
    const boaLeft = navbarLeft - (DESIGN.navbarWidth / 2);
    boaMusica.style.left = `${boaLeft}px`;
    boaMusica.style.right = "auto";
    return {
        left: boaLeft,
        width: boaWidth,
    };
}
function positionScaleOneTransparentImage() {
    const fadedPostcard = document.getElementById("fadedPostcard");
    if (!fadedPostcard)
        return;
    const containers = document.querySelectorAll("div.container");
    const totalHeight = Array.from(containers).reduce((total, container) => total + container.getBoundingClientRect().height, 0);
    //fadedPostcard.style.top = `${totalHeight}px`; 
    // const endOfContent = requireElement("endOfContent");
    // const endOfContentTop = getRect(endOfContent).top;
    // endOfContent.innerHTML = "top is " + endOfContentTop;
}
// ============================================================
// SCALE-1 DESKTOP LAYOUT
// ============================================================
//
// This is the canonical 2560 x 1440 composition.
//
// IMPORTANT:
//
// No responsive collision behavior is performed here yet.
//
// Scale 1 establishes the geometry we want to reproduce
// proportionally at other desktop resolutions.
//
// ============================================================
function renderScaleOneLayout() {
    // --------------------------------------------------------
    // 1. Restore visibility
    // --------------------------------------------------------
    ALL_ARTWORK.forEach(showElement);
    showElement(skyline);
    // --------------------------------------------------------
    // 2. Desktop navigation
    // --------------------------------------------------------
    showDesktopNavigation();
    positionScaleOneNavbar();
    // --------------------------------------------------------
    // 3. Left artwork
    // --------------------------------------------------------
    positionScaleOneGreenLeaf();
    positionScaleOneShadowLeaf();
    // --------------------------------------------------------
    // 4. Skyline
    //
    // Must happen BEFORE vertical pageContent calculation.
    // --------------------------------------------------------
    positionScaleOneSkyline();
    // --------------------------------------------------------
    // 5. Alegria
    // --------------------------------------------------------
    const alegriaGeometry = positionScaleOneAlegria();
    // --------------------------------------------------------
    // 6. Date Stamp
    //
    // Its inner boundary mirrors Alegria's inner boundary.
    // --------------------------------------------------------
    const dateGeometry = positionScaleOneDateStamp(alegriaGeometry.left);
    // --------------------------------------------------------
    // 7. Page Content
    //
    // Derived from Date Stamp, Alegria and Skyline.
    // --------------------------------------------------------
    const contentGeometry = positionScaleOnePageContent(dateGeometry.right, alegriaGeometry.left);
    // --------------------------------------------------------
    // 8. Boa Música
    // --------------------------------------------------------
    const boaGeometry = positionScaleOneBoaMusica();
    positionScaleOneTransparentImage();
    // --------------------------------------------------------
    // 9. Diagnostic output
    // --------------------------------------------------------
    const skylineRect = getRect(skyline);
    console.log("Birthday Website - Scale 1", {
        referenceViewport: {
            width: DESIGN.width,
            height: DESIGN.height,
        },
        preferredGap: DESIGN.gap,
        collisionGap: DESIGN.collisionGap,
        navbar: {
            left: DESIGN.width - DESIGN.navbarWidth,
            right: DESIGN.width,
            width: DESIGN.navbarWidth,
        },
        greenLeaf: {
            left: 0,
            right: DESIGN.greenLeafWidth,
            width: DESIGN.greenLeafWidth,
        },
        shadowLeaf: {
            left: DESIGN.gap,
            right: DESIGN.gap + DESIGN.shadowLeafWidth,
            width: DESIGN.shadowLeafWidth,
        },
        skyline: {
            left: DESIGN.skylineInset,
            right: DESIGN.width - DESIGN.skylineInset,
            width: DESIGN.width - DESIGN.skylineInset * 2,
            top: skylineRect.top,
        },
        dateStamp: dateGeometry,
        alegria: alegriaGeometry,
        boaMusica: boaGeometry,
        pageContent: contentGeometry,
    });
}
// ============================================================
// MOBILE LAYOUT
// ============================================================
//
// <= 700px:
//
// CSS owns the mobile layout.
//
// Desktop artwork is hidden by the existing CSS/mobile rules
// and mobile artwork remains in normal document flow.
//
// ============================================================
function handleMobileLayout() {
    desktopNav.classList.add("desktop-nav-hidden");
    hamburgerButton.style.display = "block";
    // --------------------------------------------------------
    // Remove desktop pageContent geometry
    // --------------------------------------------------------
    pageContent.style.left = "";
    pageContent.style.right = "";
    pageContent.style.top = "";
    pageContent.style.bottom = "";
    pageContent.style.width = "";
    pageContent.style.height = "";
    pageContent.style.transform = "";
    // --------------------------------------------------------
    // Remove desktop Date Stamp geometry
    // --------------------------------------------------------
    dateStamp.style.left = "";
    dateStamp.style.right = "";
    // --------------------------------------------------------
    // Remove desktop leaf geometry
    // --------------------------------------------------------
    shadowLeaf.style.left = "";
    shadowLeaf.style.right = "";
    shadowLeaf.style.width = "";
    shadowLeaf.style.height = "";
    greenLeaf.style.left = "";
    greenLeaf.style.right = "";
    greenLeaf.style.width = "";
    greenLeaf.style.height = "";
    // --------------------------------------------------------
    // Remove desktop Alegria geometry
    // --------------------------------------------------------
    alegriaStamp.style.left = "";
    alegriaStamp.style.right = "";
    alegriaStamp.style.width = "";
    alegriaStamp.style.height = "";
    // --------------------------------------------------------
    // Remove desktop Boa Música geometry
    // --------------------------------------------------------
    boaMusica.style.left = "";
    boaMusica.style.right = "";
    // --------------------------------------------------------
    // Remove desktop skyline geometry
    // --------------------------------------------------------
    skyline.style.left = "";
    skyline.style.right = "";
    skyline.style.width = "";
    skyline.style.height = "";
    skyline.style.bottom = "";
    skyline.style.transform = "";
    // --------------------------------------------------------
    // Remove desktop navbar geometry
    // --------------------------------------------------------
    desktopNav.style.left = "";
    desktopNav.style.right = "";
    desktopNav.style.width = "";
    desktopNav.style.top = "";
    desktopNav.style.bottom = "";
}
// ============================================================
// DESKTOP LAYOUT
// ============================================================
//
// FOR THIS PHASE:
//
// Scale 1 is intended to be inspected at 2560 x 1440.
//
// We are deliberately NOT scaling this composition to the
// current viewport yet.
//
// ============================================================
function handleDesktopLayout() {
    renderScaleOneLayout();
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
window.addEventListener("resize", requestResize);
window.addEventListener("DOMContentLoaded", handleWindowResize);
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
