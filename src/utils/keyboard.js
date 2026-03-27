export function getBoardNavigationDelta(key) {
  if (key === "ArrowUp") {
    return { dx: 0, dy: -1 };
  }

  if (key === "ArrowDown") {
    return { dx: 0, dy: 1 };
  }

  if (key === "ArrowLeft") {
    return { dx: -1, dy: 0 };
  }

  if (key === "ArrowRight") {
    return { dx: 1, dy: 0 };
  }

  return null;
}

export function isBoardConfirmKey(key) {
  return key === "Enter" || key === " " || key === "Spacebar";
}

export function isRotateKey(key) {
  return typeof key === "string" && key.toLowerCase() === "r";
}
