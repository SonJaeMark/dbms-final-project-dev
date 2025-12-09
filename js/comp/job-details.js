import { tokens } from "../core/design-token.js";
import { formatSalary, getJobImage } from "../db-logic/job-handler.js";

class JobDetails extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.jobData = null;
    this.render();
  }

  connectedCallback() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector("#close-btn");
    const overlay = this.shadowRoot.querySelector("#overlay");
    
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }
    
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          this.close();
        }
      });
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });
  }

  set data(value) {
    this.jobData = value;
    if (value) {
      this.renderContent();
    }
  }

  get data() {
    return this.jobData;
  }

  open() {
    this.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }

  close() {
    this.removeAttribute("open");
    document.body.style.overflow = "";
    this.dispatchEvent(new CustomEvent("job-details-closed"));
  }

  isOpen() {
    return this.hasAttribute("open");
  }

  renderContent() {
    if (!this.jobData) return;

    const $ = (sel) => this.shadowRoot.querySelector(sel);
    const job = this.jobData;

    // Set title
    if ($("#job-title")) {
      $("#job-title").textContent = job.title || "Untitled Job";
    }

    // Set description
    if ($("#job-description")) {
      $("#job-description").textContent = job.description || "No description provided.";
    }

    // Set details
    if ($("#job-category")) {
      $("#job-category").textContent = job.category || "N/A";
    }
    if ($("#job-work-type")) {
      $("#job-work-type").textContent = job.work_type || "N/A";
    }
    if ($("#job-location")) {
      $("#job-location").textContent = job.location || "N/A";
    }
    if ($("#job-schedule")) {
      $("#job-schedule").textContent = job.work_schedule || "Not specified";
    }
    if ($("#job-salary")) {
      const salary = formatSalary(job.rate_amount, job.rate_type, job.salary_notes);
      $("#job-salary").textContent = salary;
    }
    if ($("#job-vacancies")) {
      $("#job-vacancies").textContent = job.vacancies_available || "Not specified";
    }
    if ($("#job-skills")) {
      $("#job-skills").textContent = job.required_skills || "Not specified";
    }
    if ($("#job-status")) {
      const status = job.status || "draft";
      $("#job-status").textContent = status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
    }

    // Format dates
    if (job.created_at && $("#job-created")) {
      const createdDate = new Date(job.created_at);
      $("#job-created").textContent = createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    if (job.updated_at && $("#job-updated")) {
      const updatedDate = new Date(job.updated_at);
      $("#job-updated").textContent = updatedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Render images
    const imagesContainer = $("#job-images");
    if (imagesContainer) {
      imagesContainer.innerHTML = "";
      if (job.images && job.images.length > 0) {
        const sortedImages = [...job.images].sort((a, b) => 
          (a.display_order || 0) - (b.display_order || 0)
        );
        sortedImages.forEach((img, index) => {
          const imgEl = document.createElement("img");
          imgEl.src = img.file_url;
          imgEl.alt = img.caption || `Job image ${index + 1}`;
          imgEl.loading = "lazy";
          imagesContainer.appendChild(imgEl);
        });
      } else {
        const noImage = document.createElement("div");
        noImage.className = "no-images";
        noImage.textContent = "No images available";
        imagesContainer.appendChild(noImage);
      }
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: none;
          font-family: ${tokens.fonts.body};
        }

        :host([open]) {
          display: block;
        }

        #overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 9998;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: ${tokens.spacing.lg};
          overflow-y: auto;
        }

        .modal {
          background: white;
          border-radius: ${tokens.radius.lg};
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          z-index: 9999;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          padding: ${tokens.spacing.xl};
          border-bottom: 2px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: white;
          z-index: 1;
        }

        .modal-header h2 {
          margin: 0;
          color: ${tokens.colors.text};
          font-size: 1.8rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f0f0f0;
          color: ${tokens.colors.text};
        }

        .modal-content {
          padding: ${tokens.spacing.xl};
        }

        .job-images {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: ${tokens.spacing.md};
          margin-bottom: ${tokens.spacing.xl};
        }

        .job-images img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: ${tokens.radius.md};
          border: 2px solid #f0f0f0;
        }

        .no-images {
          grid-column: 1 / -1;
          text-align: center;
          padding: ${tokens.spacing.xl};
          color: #666;
          font-style: italic;
        }

        .job-description {
          margin-bottom: ${tokens.spacing.xl};
          line-height: 1.6;
          color: ${tokens.colors.text};
        }

        .job-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: ${tokens.spacing.lg};
          margin-bottom: ${tokens.spacing.xl};
        }

        .detail-item {
          padding: ${tokens.spacing.md};
          background: #f8f9fa;
          border-radius: ${tokens.radius.md};
        }

        .detail-label {
          font-weight: 600;
          color: #666;
          font-size: 0.9rem;
          margin-bottom: ${tokens.spacing.xs};
        }

        .detail-value {
          color: ${tokens.colors.text};
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .modal {
            max-width: 100%;
            margin: ${tokens.spacing.md};
          }

          .modal-header {
            padding: ${tokens.spacing.md};
          }

          .modal-content {
            padding: ${tokens.spacing.md};
          }

          .job-details-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <div id="overlay">
        <div class="modal">
          <div class="modal-header">
            <h2 id="job-title">Job Details</h2>
            <button id="close-btn" class="close-btn" aria-label="Close">×</button>
          </div>
          <div class="modal-content">
            <div class="job-images" id="job-images"></div>
            <div class="job-description" id="job-description"></div>
            <div class="job-details-grid">
              <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value" id="job-category"></div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Work Type</div>
                <div class="detail-value" id="job-work-type"></div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Location</div>
                <div class="detail-value" id="job-location"></div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Work Schedule</div>
                <div class="detail-value" id="job-schedule"></div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Salary</div>
                <div class="detail-value" id="job-salary"></div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Vacancies Available</div>
                <div class="detail-value" id="job-vacancies"></div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Required Skills</div>
                <div class="detail-value" id="job-skills"></div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value" id="job-status"></div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Created At</div>
                <div class="detail-value" id="job-created"></div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Last Updated</div>
                <div class="detail-value" id="job-updated"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("job-details", JobDetails);
export { JobDetails };

