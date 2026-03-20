const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvgrdzja";

const form = document.getElementById("waitlist-form");
const statusEl = document.getElementById("form-status");
const submitBtn = form?.querySelector('button[type="submit"]');
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (form && statusEl && submitBtn) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const applicationFor = String(formData.get("application_for") || "").trim();

    if (!email) {
      renderStatus("Please enter your email.", "error");
      return;
    }

    submitBtn.setAttribute("disabled", "true");
    submitBtn.textContent = "Submitting...";
    renderStatus("", "");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          application_for: applicationFor
        })
      });

      if (!response.ok) {
        throw new Error("Failed request");
      }

      form.reset();
      renderStatus("You are on the waitlist. We will be in touch soon.", "success");
    } catch (error) {
      renderStatus(
        "Could not submit right now. Please try again in a minute.",
        "error"
      );
    } finally {
      submitBtn.removeAttribute("disabled");
      submitBtn.textContent = "Join waitlist";
    }
  });
}

function renderStatus(message, type) {
  statusEl.textContent = message;
  statusEl.classList.remove("success", "error");

  if (type) {
    statusEl.classList.add(type);
  }
}
