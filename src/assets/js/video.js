document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.getElementById("playButtonContainer");

  if (!playButton) return;

  playButton.addEventListener("click", function () {
    const videoModal = document.createElement("div");
    videoModal.id = "videoModal";
    videoModal.setAttribute("role", "dialog");
    videoModal.setAttribute("aria-modal", "true");
    videoModal.setAttribute("aria-label", "Open Podcast product video");
    videoModal.style.cssText =
      "position:fixed; z-index:1000; inset:0; background-color:rgba(0,0,0,0.9);";

    const videoPlayer = document.createElement("video");
    videoPlayer.id = "videoPlayer";
    videoPlayer.controls = true;
    videoPlayer.style.cssText =
      "position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); max-width:90%; max-height:90%;";

    const closeButton = document.createElement("button");
    closeButton.id = "closeButton";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close video");
    closeButton.innerHTML = "&times;";
    closeButton.style.cssText =
      "position:absolute; top:15px; right:35px; color:white; font-size:40px; font-weight:bold; cursor:pointer;";

    const pathSegments = window.location.pathname
      .split("/")
      .filter((segment) => segment);
    const firstSegment = pathSegments[0];
    const locale = firstSegment === "en" ? "en" : "de";

    videoPlayer.src = `/videos/openpodcast-${locale}.mp4`;
    videoPlayer.addEventListener("error", function () {
      if (locale !== "de") videoPlayer.src = "/videos/openpodcast-de.mp4";
    });

    videoModal.appendChild(videoPlayer);
    videoModal.appendChild(closeButton);
    document.body.appendChild(videoModal);
    document.body.style.overflow = "hidden";
    closeButton.focus();
    videoPlayer.play().catch(function () {
      // The user can start playback manually if the browser blocks autoplay.
    });

    closeButton.addEventListener("click", closeModal);
    videoModal.addEventListener("click", function (event) {
      if (event.target === videoModal) closeModal();
    });
    document.addEventListener("keydown", handleKeydown);

    function handleKeydown(event) {
      if (event.key === "Escape") closeModal();
    }

    function closeModal() {
      videoPlayer.pause();
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
      videoModal.remove();
      playButton.focus();
    }
  });
});
