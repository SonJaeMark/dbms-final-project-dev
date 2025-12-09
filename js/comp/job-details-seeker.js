import { tokens } from "../core/design-token.js";
import { formatSalary } from "../db-logic/job-handler.js";
import { insertApplicationStatusApplied, getResumeByUser } from "../db-logic/seeker-handler.js";

class JobDetailsSeeker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.jobData = null;
    this.render();
  }

  connectedCallback() {
    this.setupEventListeners();
  }

  set data(value) {
    this.jobData = value;
    if (value) this.renderContent();
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
  }

  isOpen() {
    return this.hasAttribute("open");
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector("#close-btn");
    const overlay = this.shadowRoot.querySelector("#overlay");
    const applyForm = this.shadowRoot.querySelector("#applyModalForm");
    const prevBtn = this.shadowRoot.querySelector('#prev-btn');
    const nextBtn = this.shadowRoot.querySelector('#next-btn');

    if (closeBtn) closeBtn.addEventListener("click", () => this.close());
    if (overlay) overlay.addEventListener("click", (e) => { if (e.target === overlay) this.close(); });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) this.close();
    });

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

    if (applyForm) {
      applyForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const msg = this.shadowRoot.querySelector("#applyMsg");
        const btn = this.shadowRoot.querySelector("#applySubmitBtn");
        msg.textContent = "";
        msg.className = "message";
        btn.disabled = true;
        btn.textContent = "Applying...";
        try {
          const userStr = localStorage.getItem("auth_user");
          if (!userStr) throw new Error("Please log in as a job seeker.");
          const user = JSON.parse(userStr);
          const p_seeker_id = user.id;
          const p_job_id = this.jobData?.id;
          const p_cover_letter = this.shadowRoot.querySelector("#apply_cover_letter").value.trim();
          let p_resume_id = localStorage.getItem("last_resume_id");
          if (!p_resume_id) {
            const r = await getResumeByUser(p_seeker_id);
            const first = (r.success && Array.isArray(r.data) && r.data.length) ? r.data[0] : null;
            if (first?.id) {
              p_resume_id = first.id;
              localStorage.setItem('last_resume_id', first.id);
            }
          }
          if (!p_resume_id) throw new Error("Please provide a Resume ID.");

          const res = await insertApplicationStatusApplied({ p_cover_letter, p_job_id, p_resume_id, p_seeker_id });
          if (!res.success) throw new Error(res.error || "Failed to apply");

          const id = Array.isArray(res.data) ? res.data[0]?.insert_application_status_applied_by_job_id : null;
          msg.textContent = id ? `Applied successfully. Application ID: ${id}` : "Applied successfully.";
          msg.classList.add("success");
          this.shadowRoot.querySelector("#applyModalForm").reset();
        } catch (err) {
          msg.textContent = err.message || "Error applying.";
          msg.classList.add("error");
        } finally {
          btn.disabled = false;
          btn.textContent = "Apply";
        }
      });
    }
  }

  renderContent() {
    const $ = (sel) => this.shadowRoot.querySelector(sel);
    const job = this.jobData || {};

    if ($("#job-title")) $("#job-title").textContent = job.title || "Job Details";
    if ($("#job-description")) $("#job-description").textContent = job.description || "No description provided.";
    if ($("#job-category")) $("#job-category").textContent = job.category || "N/A";
    if ($("#job-work-type")) $("#job-work-type").textContent = job.work_type || "N/A";
    if ($("#job-location")) $("#job-location").textContent = job.location || "N/A";
    if ($("#job-schedule")) $("#job-schedule").textContent = job.work_schedule || "Not specified";
    if ($("#job-salary")) $("#job-salary").textContent = formatSalary(job.rate_amount, job.rate_type, job.salary_notes);
    if ($("#job-vacancies")) $("#job-vacancies").textContent = job.vacancies_available || "Not specified";
    if ($("#job-skills")) $("#job-skills").textContent = job.required_skills || "Not specified";

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
        :host { display: none; font-family: ${tokens.fonts.body}; }
        :host([open]) { display: block; }
        #overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 9998; display:flex; align-items:center; justify-content:center; padding: ${tokens.spacing.lg}; }
        .modal { background:white; border-radius:${tokens.radius.lg}; max-width:820px; width:100%; max-height:90vh; overflow-y:auto; position:relative; z-index:9999; box-shadow:0 10px 40px rgba(0, 0, 0, 0.3); }
        .modal-header { padding:${tokens.spacing.xl}; border-bottom:2px solid #f0f0f0; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:white; z-index:1; }
        .close-btn { background:none; border:none; font-size:2rem; cursor:pointer; color:#666; width:40px; height:40px; border-radius:50%; }
        .modal-content { padding:${tokens.spacing.xl}; }
        .carousel { position: relative; width: 100%; height: 320px; border-radius:${tokens.radius.md}; overflow:hidden; margin-bottom:${tokens.spacing.xl}; background:#eee; }
        .carousel img { width:100%; height:100%; object-fit:cover; display:block; }
        .nav-btn { position:absolute; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:#fff; border:none; border-radius:50%; width:36px; height:36px; cursor:pointer; }
        #prev-btn { left:12px; }
        #next-btn { right:12px; }
        .carousel-dots { position:absolute; bottom:10px; left:50%; transform:translateX(-50%); display:flex; gap:6px; }
        .carousel-dots .dot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.6); cursor:pointer; }
        .carousel-dots .dot.active { background:#fff; }
        .job-details-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:${tokens.spacing.lg}; margin-bottom:${tokens.spacing.xl}; }
        .detail-item { padding:${tokens.spacing.md}; background:#f8f9fa; border-radius:${tokens.radius.md}; }
        .detail-label { font-weight:600; color:#666; font-size:0.9rem; margin-bottom:${tokens.spacing.xs}; }
        .detail-value { color:${tokens.colors.text}; font-size:1rem; }
        .apply-box { padding:${tokens.spacing.md}; border:1px solid #eee; border-radius:${tokens.radius.md}; }
        .message { margin-top:${tokens.spacing.sm}; }
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
            <div class="job-details-grid">
              <div class="detail-item"><div class="detail-label">Category</div><div class="detail-value" id="job-category"></div></div>
              <div class="detail-item"><div class="detail-label">Work Type</div><div class="detail-value" id="job-work-type"></div></div>
              <div class="detail-item"><div class="detail-label">Location</div><div class="detail-value" id="job-location"></div></div>
              <div class="detail-item"><div class="detail-label">Work Schedule</div><div class="detail-value" id="job-schedule"></div></div>
              <div class="detail-item"><div class="detail-label">Salary</div><div class="detail-value" id="job-salary"></div></div>
              <div class="detail-item"><div class="detail-label">Vacancies</div><div class="detail-value" id="job-vacancies"></div></div>
              <div class="detail-item"><div class="detail-label">Required Skills</div><div class="detail-value" id="job-skills"></div></div>
            </div>

            <div class="apply-box">
              <form id="applyModalForm" style="display:grid; gap:0.5rem; grid-template-columns:1fr;">
                <textarea id="apply_cover_letter" placeholder="Cover Letter" rows="4" required style="padding:0.6rem; border:1px solid #ddd; border-radius:6px;"></textarea>
                <button type="submit" id="applySubmitBtn" style="padding:0.6rem 1rem; background:#1581BF; color:white; border-radius:6px;">Apply</button>
                <div id="applyMsg" class="message"></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("job-details-seeker", JobDetailsSeeker);
export { JobDetailsSeeker };
