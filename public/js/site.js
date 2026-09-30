

function handleWindowResize() {
  const contentRect = getRect(pageContent);

  // ========================================================
  // LEFT SIDE
  // ========================================================

  LEFT_OBJECTS.forEach((element) => {
    if (leftObjectTouchesContent(element, contentRect)) {
      hideElement(element);
    } else {
      showElement(element);
    }
  });

  // ========================================================
  // RIGHT SIDE ARTWORK
  // ========================================================

  RIGHT_OBJECTS.forEach((element) => {
    if (rightObjectTouchesContent(element, contentRect)) {
      hideElement(element);
    } else {
      showElement(element);
    }
  });

  // ========================================================
  // SKYLINE
  // ========================================================

  if (skylineTouchesContent(contentRect)) {
    hideElement(skyline);
  } else {
    showElement(skyline);
  }

  // ========================================================
  // NAVIGATION
  // ========================================================

  if (navbarTouchesContent(contentRect)) {
    showHamburgerNavigation();
  } else {
    showDesktopNavigation();
  }
}