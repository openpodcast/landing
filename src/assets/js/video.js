document.addEventListener("DOMContentLoaded", function () {
  const heroContainer = document.querySelector(".hero-container");
  const playButtonContainer = document.getElementById("playButtonContainer");

  if (heroContainer && playButtonContainer) {
    playButtonContainer.addEventListener("click", function () {
      // Create modal elements
      const videoModal = document.createElement("div");
      videoModal.id = "videoModal";
      videoModal.style.cssText =
        "display:none; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; background-color:rgba(0,0,0,0.9);";

      const videoPlayer = document.createElement("video");
      videoPlayer.id = "videoPlayer";
      videoPlayer.controls = true;
      videoPlayer.style.cssText =
        "position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); max-width:90%; max-height:90%;";

      const closeButton = document.createElement("button");
      closeButton.id = "closeButton";
      closeButton.innerHTML = "&times;";
      closeButton.style.cssText =
        "position:absolute; top:15px; right:35px; color:white; font-size:40px; font-weight:bold; cursor:pointer;";

      // Set video source - try locale from URL, fallback to 'de'
      const pathSegments = window.location.pathname.split('/').filter(segment => segment);
      const firstSegment = pathSegments[0];
      const locale = (firstSegment && !firstSegment.includes('.')) ? firstSegment : 'de';
      
      videoPlayer.src = `/videos/openpodcast-${locale}.mp4`;
      videoPlayer.addEventListener('error', () => {
        if (locale !== 'de') videoPlayer.src = `/videos/openpodcast-de.mp4`;
      });

      // Append elements
      videoModal.appendChild(videoPlayer);
      videoModal.appendChild(closeButton);
      document.body.appendChild(videoModal);

      // Show modal and play video
      videoModal.style.display = "block";
      videoPlayer.play();

      // Close button functionality
      closeButton.addEventListener("click", closeModal);

      // Close on clicking outside the video
      videoModal.addEventListener("click", function (event) {
        if (event.target === videoModal) {
          closeModal();
        }
      });

      // Close on pressing Escape key
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          closeModal();
        }
      });

      function closeModal() {
        videoModal.style.display = "none";
        videoPlayer.pause();
      }
    });
  }
});
