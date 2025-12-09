import { tokens } from "../core/design-token.js";
import { formatSalary, getJobImage } from "../db-logic/job-handler.js";

class JobAppliedCard extends HTMLElement {
  static get observedAttributes() {
    return ["image", "title", "salary", "location", "job-id", "app-id"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._data = null;
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; font-family:${tokens.fonts.body}; }
        .card { width:100%; max-width:360px; background:white; border-radius:${tokens.radius.md}; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1); }
        .image-wrapper { width:100%; height:180px; overflow:hidden; background:#eee; }
        .image-wrapper img { width:100%; height:100%; object-fit:cover; }
        .content { padding:${tokens.spacing.md}; }
        .title { font-size:1.1rem; font-weight:700; margin-bottom:${tokens.spacing.sm}; color:${tokens.colors.text}; }
        .details { font-size:0.9rem; color:${tokens.colors.text}; margin-bottom:${tokens.spacing.md}; }
        .row { margin-bottom:${tokens.spacing.xs}; }
        .button-group { display:flex; gap:${tokens.spacing.sm}; }
        .view-btn { flex:1; background:${tokens.colors.primary}; color:white; padding:${tokens.spacing.sm} ${tokens.spacing.md}; border-radius:${tokens.radius.md}; cursor:pointer; border:none; }
        .cancel-btn { flex:1; background:#dc3545; color:white; padding:${tokens.spacing.sm} ${tokens.spacing.md}; border-radius:${tokens.radius.md}; cursor:pointer; border:none; }
      </style>

      <div class="card">
        <div class="image-wrapper"><img id="job-image" src="" alt="Job Image"></div>
        <div class="content">
          <div class="title" id="job-title"></div>
          <div class="details">
            <div class="row"><strong>Salary:</strong> <span id="job-salary"></span></div>
            <div class="row"><strong>Location:</strong> <span id="job-location"></span></div>
          </div>
          <div class="button-group">
            <button class="view-btn" id="view-btn">View</button>
            <button class="cancel-btn" id="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.updateUI();
    this.setupButtons();
  }

  attributeChangedCallback() {
    this.updateUI();
  }

  set data(value) {
    this._data = value;
    if (!value) return;
    this.setAttributeSafe("job-id", value.id);
    this.setAttributeSafe("title", value.title);
    this.setAttributeSafe("location", value.location);
    const imageUrl = getJobImage(value.images);
    this.setAttributeSafe("image", imageUrl);
    const salaryText = formatSalary(value.rate_amount, value.rate_type, value.salary_notes);
    this.setAttributeSafe("salary", salaryText);
    this.updateUI();
  }

  get data() { return this._data; }

  setAttributeSafe(name, value) {
    if (value !== undefined && value !== null) this.setAttribute(name, value);
  }

  updateUI() {
    const $ = (sel) => this.shadowRoot.querySelector(sel);
    $("#job-image").src = this.getAttribute("image") || "";
    $("#job-title").textContent = this.getAttribute("title") || "Untitled Job";
    $("#job-salary").textContent = this.getAttribute("salary") || "N/A";
    $("#job-location").textContent = this.getAttribute("location") || "No location";
  }

  setupButtons() {
    const viewBtn = this.shadowRoot.querySelector("#view-btn");
    const cancelBtn = this.shadowRoot.querySelector("#cancel-btn");
    if (viewBtn) {
      viewBtn.addEventListener("click", () => {
        const jobId = this.getAttribute("job-id");
        this.dispatchEvent(new CustomEvent("view-job", { detail: { jobId }, bubbles: true, composed: true }));
      });
    }
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        const appId = this.getAttribute("app-id");
        this.dispatchEvent(new CustomEvent("cancel-application", { detail: { appId }, bubbles: true, composed: true }));
      });
    }
  }
}

customElements.define("job-applied-card", JobAppliedCard);
export { JobAppliedCard };
