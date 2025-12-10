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
    const prevBtn = this.shadowRoot.querySelector('#prev-btn');
    const nextBtn = this.shadowRoot.querySelector('#next-btn');
    
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

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (!this._images || this._images.length === 0) return;
        this._currentIndex = (this._currentIndex - 1 + this._images.length) % this._images.length;
        this.updateCarousel();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!this._images || this._images.length === 0) return;
        this._currentIndex = (this._currentIndex + 1) % this._images.length;
        this.updateCarousel();
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

    const imgs = Array.isArray(job.images) ? [...job.images] : [];
    imgs.sort((a,b) => (a.display_order || 0) - (b.display_order || 0));
    this._images = imgs;
    this._currentIndex = 0;
    this.updateCarousel();
  }

  updateCarousel() {
    const imgEl = this.shadowRoot.querySelector('#carousel-image');
    const dotsEl = this.shadowRoot.querySelector('#carousel-dots');
    const hasImages = this._images && this._images.length > 0;
    if (imgEl) {
      imgEl.src = hasImages ? (this._images[this._currentIndex]?.file_url || '') : '';
      imgEl.alt = hasImages ? (this._images[this._currentIndex]?.caption || 'Job image') : 'No image';
      imgEl.style.display = hasImages ? 'block' : 'none';
    }
    if (dotsEl) {
      dotsEl.innerHTML = '';
      if (hasImages) {
        this._images.forEach((_, i) => {
          const dot = document.createElement('span');
          dot.className = 'dot' + (i === this._currentIndex ? ' active' : '');
          dot.addEventListener('click', () => {
            this._currentIndex = i;
            this.updateCarousel();
          });
          dotsEl.appendChild(dot);
        });
      } else {
        const no = document.createElement('div');
        no.className = 'no-images';
        no.textContent = 'No images available';
        dotsEl.appendChild(no);
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

        .carousel { position: relative; width: 100%; height: 320px; border-radius:${tokens.radius.md}; overflow:hidden; margin-bottom:${tokens.spacing.xl}; background:#eee; }
        .carousel img { width:100%; height:100%; object-fit:cover; display:block; }
        .nav-btn { position:absolute; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:#fff; border:none; border-radius:50%; width:36px; height:36px; cursor:pointer; }
        #prev-btn { left:12px; }
        #next-btn { right:12px; }
        .carousel-dots { position:absolute; bottom:10px; left:50%; transform:translateX(-50%); display:flex; gap:6px; }
        .carousel-dots .dot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.6); cursor:pointer; }
        .carousel-dots .dot.active { background:#fff; }

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
            <div class="carousel" id="carousel">
              <img id="carousel-image" src="" alt="Job image">
              <button class="nav-btn" id="prev-btn" aria-label="Previous">‹</button>
              <button class="nav-btn" id="next-btn" aria-label="Next">›</button>
              <div class="carousel-dots" id="carousel-dots"></div>
            </div>
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

