export function showFeedback(feedbackId, feedbackTextId, type, key) {
    const feedback = document.getElementById(feedbackId);
    const feedbackText = document.getElementById(feedbackTextId);
    if (!feedback || !feedbackText) {
        return;
    }
    feedback.className = `alert alert-${type}`;
    feedbackText.innerHTML = window.translate(key);
    feedback.classList.remove("d-none");
}
export function clearFeedback(feedbackId, feedbackTextId) {
    const feedback = document.getElementById(feedbackId);
    const feedbackText = document.getElementById(feedbackTextId);
    if (!feedback || !feedbackText) {
        return;
    }
    feedback.className = "alert d-none";
    feedbackText.innerHTML = "";
}
