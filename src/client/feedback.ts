export function showFeedback(
  feedbackId: string,
  feedbackTextId: string,
  type: "success" | "danger" | "warning" | "info",
  key: string,
): void {
  const feedback = document.getElementById(feedbackId);
  const feedbackText = document.getElementById(feedbackTextId);

  if (!feedback || !feedbackText) {
    return;
  }

  feedback.className = `alert alert-${type}`;

  feedbackText.innerHTML = window.translate(key);

  feedback.classList.remove("d-none");
}

export function clearFeedback(feedbackId: string, feedbackTextId: string): void {
  const feedback = document.getElementById(feedbackId);
  const feedbackText = document.getElementById(feedbackTextId);

 if (!feedback || !feedbackText) {
   return;
 }

    feedback.className = "alert d-none";
    feedbackText.innerHTML = "";
}
