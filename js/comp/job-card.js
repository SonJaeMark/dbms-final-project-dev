import { tokens } from "../core/design-token.js";
import { formatSalary, getJobImage } from "../db-logic/job-handler.js";

class JobCard extends HTMLElement {
  static get observedAttributes() {
    return ["image", "title", "start-date", "salary", "lister", "location", "button-text", "job-id"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.data = {}; // for programmatic assignment

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --primary: ${tokens.colors.primary};
          --text: ${tokens.colors.text};
          --bg: white;

          --spacing-sm: ${tokens.spacing.sm};
          --spacing-md: ${tokens.spacing.md};
          --spacing-lg: ${tokens.spacing.lg};

          --radius-md: ${tokens.radius.md};
          --font-body: ${tokens.fonts.body};

          display: block;
        }

        .card {
          width: 100%;
          max-width: 340px;
          background: var(--bg);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          font-family: var(--font-body);
          transition: transform .15s ease;
        }

        .card:hover {
          transform: translateY(-3px);
        }

        .image-wrapper {
          width: 100%;
          height: 180px;
          overflow: hidden;
        }

        .image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .content {
          padding: var(--spacing-md);
        }

        .title {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: var(--spacing-sm);
          color: var(--text);
        }

        .details {
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text);
          margin-bottom: var(--spacing-md);
        }

        .row {
          margin-bottom: var(--spacing-xs);
        }

        .view-btn {
          display: inline-block;
          text-align: center;
          width: 100%;
          background: var(--primary);
          color: white;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          cursor: pointer;
          text-decoration: none;
          transition: 0.2s;
        }

        .view-btn:hover {
          opacity: 0.9;
        }
      </style>

      <div class="card">
        <div class="image-wrapper">
          <img id="job-image" src="" alt="Job Image">
        </div>

        <div class="content">
            <div class="title" id="job-title"></div>

            <div class="details">
                <div class="row"><strong>Start Date:</strong> <span id="job-date"></span></div>
                <div class="row"><strong>Salary:</strong> <span id="job-salary"></span></div>
                <div class="row"><strong>Lister:</strong> <span id="job-lister"></span></div>
                <div class="row"><strong>Location:</strong> <span id="job-location"></span></div>
            </div>

            <button class="view-btn" id="view-btn">
                <slot name="button">View</slot>
            </button>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.updateUI();
    this.setupViewButton();
  }

  setupViewButton() {
    const viewBtn = this.shadowRoot.querySelector("#view-btn");
    if (viewBtn) {
      viewBtn.addEventListener("click", () => {
        const jobId = this.getAttribute("job-id");
        if (jobId) {
          this.dispatchEvent(new CustomEvent("view-job", {
            detail: { jobId, jobData: this._data },
            bubbles: true,
            composed: true
          }));
        }
      });
    }
  }

  attributeChangedCallback() {
    this.updateUI();
  }

  // --- PROGRAMMATIC BINDING ---
  set data(value) {
    this._data = value;
    if (!value) return;
    
    // Support both old format (direct attributes) and new format (RPC response)
    if (value.id) {
      // New format from RPC - map the fields
      this.setAttributeSafe("job-id", value.id);
      this.setAttributeSafe("title", value.title);
      this.setAttributeSafe("location", value.location);
      
      // Get image from images array
      const imageUrl = getJobImage(value.images);
      this.setAttributeSafe("image", imageUrl);
      
      // Format salary from rate_amount and rate_type
      const salary = formatSalary(value.rate_amount, value.rate_type, value.salary_notes);
      this.setAttributeSafe("salary", salary);
      
      // Format start date from created_at
      if (value.created_at) {
        const date = new Date(value.created_at);
        const formattedDate = date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
        this.setAttributeSafe("start-date", formattedDate);
      }
      
      // For lister, we might need to fetch the lister name separately
      // For now, use category or work_type as placeholder
      this.setAttributeSafe("lister", value.category || value.work_type || "Company");
      
      this.setAttributeSafe("button-text", "View Job");
    } else {
      // Old format - direct attributes
      this.setAttributeSafe("image", value.image);
      this.setAttributeSafe("title", value.title);
      this.setAttributeSafe("start-date", value.startDate || value["start-date"]);
      this.setAttributeSafe("salary", value.salary);
      this.setAttributeSafe("lister", value.lister);
      this.setAttributeSafe("location", value.location);
      this.setAttributeSafe("button-text", value.buttonText || value["button-text"]);
      this.setAttributeSafe("job-id", value.id);
    }
  }

  get data() {
    return this._data;
  }

  // Helper to avoid null values
  setAttributeSafe(name, value) {
    if (value !== undefined && value !== null) {
      this.setAttribute(name, value);
    }
  }

  updateUI() {
    const $ = (sel) => this.shadowRoot.querySelector(sel);

    $("#job-image").src = this.getAttribute("image") || "";
    $("#job-title").textContent = this.getAttribute("title") || "Untitled Job";
    $("#job-date").textContent = this.getAttribute("start-date") || "N/A";
    $("#job-salary").textContent = this.getAttribute("salary") || "N/A";
    $("#job-lister").textContent = this.getAttribute("lister") || "Unknown";
    $("#job-location").textContent = this.getAttribute("location") || "No location";

    const btn = this.getAttribute("button-text") || "View";
    // $("#view-btn").textContent = btn;
  }
}

customElements.define("job-card", JobCard);
export { JobCard };
