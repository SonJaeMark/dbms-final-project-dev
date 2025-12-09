import { tokens } from "../core/design-token.js";
import { formatSalary, getJobImage } from "../db-logic/job-handler.js";
import { updateJob, deleteJobReturn } from "../db-logic/job-lister-handler.js";

class JobCardLister extends HTMLElement {
  static get observedAttributes() {
    return ["image", "title", "start-date", "salary", "lister", "location", "button-text", "job-id"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.data = {};
    this.render();
  }

  connectedCallback() {
    this.updateUI();
    this.setupButtons();
  }

  setupButtons() {
    const viewBtn = this.shadowRoot.querySelector("#view-btn");
    const editBtn = this.shadowRoot.querySelector("#edit-btn");
    const deleteBtn = this.shadowRoot.querySelector("#delete-btn");

    if (viewBtn) {
      viewBtn.addEventListener("click", () => this.handleView());
    }

    if (editBtn) {
      editBtn.addEventListener("click", () => this.handleEdit());
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => this.handleDelete());
    }
  }

  handleView() {
    const jobId = this.getAttribute("job-id");
    if (jobId) {
      this.dispatchEvent(new CustomEvent("view-job", {
        detail: { jobId, jobData: this.data },
        bubbles: true
      }));
    }
  }

  handleEdit() {
    const jobId = this.getAttribute("job-id");
    if (jobId) {
      this.dispatchEvent(new CustomEvent("edit-job", {
        detail: { jobId, jobData: this.data },
        bubbles: true
      }));
    }
  }

  async handleDelete() {
    const jobId = this.getAttribute("job-id");
    if (!jobId) return;

    // Get current user
    let listerId = null;
    try {
      const userStr = localStorage.getItem("auth_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        listerId = user.id;
      }
    } catch (err) {
      console.error("Error getting user:", err);
    }

    if (!listerId) {
      this.showMessage("Please log in to delete jobs.", "error");
      return;
    }

    // Confirm deletion
    const confirmed = confirm("Are you sure you want to delete this job? This action cannot be undone.");
    if (!confirmed) return;

    // Show loading state
    const deleteBtn = this.shadowRoot.querySelector("#delete-btn");
    const originalText = deleteBtn.textContent;
    deleteBtn.disabled = true;
    deleteBtn.textContent = "Deleting...";

    try {
      const result = await deleteJobReturn(jobId, listerId);

      if (!result.success) {
        this.showMessage(result.error || "Failed to delete job.", "error");
        deleteBtn.disabled = false;
        deleteBtn.textContent = originalText;
        return;
      }

      // Success - dispatch event for parent to handle
      this.dispatchEvent(new CustomEvent("job-deleted", {
        detail: { jobId },
        bubbles: true
      }));

      // Remove the card from DOM
      this.remove();
    } catch (err) {
      console.error("Error deleting job:", err);
      this.showMessage("An error occurred while deleting the job.", "error");
      deleteBtn.disabled = false;
      deleteBtn.textContent = originalText;
    }
  }

  showMessage(text, type) {
    // You can implement a toast notification here
    alert(text);
  }

  attributeChangedCallback() {
    this.updateUI();
  }

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
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --primary: ${tokens.colors.primary};
          --secondary: ${tokens.colors.secondary};
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

        .button-group {
          display: flex;
          gap: var(--spacing-sm);
          flex-direction: column;
        }

        .view-btn, .edit-btn, .delete-btn {
          display: inline-block;
          text-align: center;
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          cursor: pointer;
          text-decoration: none;
          transition: 0.2s;
          border: none;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: var(--font-body);
        }

        .view-btn {
          background: var(--secondary);
          color: white;
        }

        .view-btn:hover {
          opacity: 0.9;
        }

        .edit-btn {
          background: var(--primary);
          color: white;
        }

        .edit-btn:hover {
          opacity: 0.9;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
        }

        .delete-btn:hover {
          background: #c82333;
        }

        .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

          <div class="button-group">
            <button class="view-btn" id="view-btn">View</button>
            <button class="edit-btn" id="edit-btn">Edit</button>
            <button class="delete-btn" id="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("job-card-lister", JobCardLister);
export { JobCardLister };

