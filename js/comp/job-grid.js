import "../comp/job-card.js"; // make sure job-card is imported
import { getPublishedJobs } from "../db-logic/job-handler.js";

class JobGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentPage = 1;
    this.pageSize = 12;
    this.pagination = null;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --gap: 24px;
          width: 100%;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--gap);
          width: 100%;
          padding: 20px 0;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .error {
          text-align: center;
          padding: 40px;
          color: red;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 30px;
          padding: 20px 0;
        }

        .pagination button {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
        }

        .pagination button:hover:not(:disabled) {
          background: #f5f5f5;
        }

        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          margin: 0 10px;
          color: #666;
        }
        @media (max-width: 768px) {
          :host { --gap: 16px; }
          .grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            padding: 12px 0;
          }
          .pagination {
            flex-direction: column;
            gap: 8px;
          }
          .pagination button {
            width: 100%;
          }
          .pagination-info {
            margin: 4px 0;
          }
        }
      </style>
      <div class="grid">
        <slot></slot> <!-- optional fallback if you use static job-card elements -->
      </div>
      <div class="pagination" id="pagination" style="display: none;"></div>
    `;

    this.gridContainer = this.shadowRoot.querySelector(".grid");
    this.paginationContainer = this.shadowRoot.querySelector("#pagination");
  }

  connectedCallback() {
    // Auto-load jobs when component is connected
    if (!this._data) {
      this.loadJobs();
    }
  }

  // --- Programmatic data binding ---
  set data(jobs) {
    this._data = jobs;
    this.render();
  }

  get data() {
    return this._data;
  }

  async loadJobs(page = 1) {
    this.currentPage = page;
    
    // Show loading state
    // this.gridContainer.innerHTML = '<div class="loading">Loading jobs...</div>';
    this.paginationContainer.style.display = "none";

    const result = await getPublishedJobs(page, this.pageSize);

    if (!result.success) {
      const errorMsg = result.error || "Failed to load jobs";
      console.error("Failed to load jobs:", result);
      this.gridContainer.innerHTML = `
        <div class="error">
          <p><strong>Error loading jobs:</strong></p>
          <p>${errorMsg}</p>
          <p style="font-size: 0.9em; margin-top: 10px; color: #666;">
            Please check the browser console for more details.
          </p>
        </div>
      `;
      return;
    }

    if (!result.data || result.data.length === 0) {
      this.gridContainer.innerHTML = '<div class="loading">No jobs available at the moment.</div>';
      this.paginationContainer.style.display = "none";
      return;
    }

    // Store pagination info
    this.pagination = result.pagination;

    // Render jobs
    this._data = result.data;
    this.render();
    this.renderPagination();
    this.dispatchEvent(new CustomEvent("page-changed", { detail: { page: this.currentPage }, bubbles: true, composed: true }));
  }

  setPage(page) {
    this.loadJobs(page);
  }

  render() {
    if (!this._data) return;

    // Clear existing cards (but keep slot)
    const slot = this.shadowRoot.querySelector("slot");
    const existingCards = Array.from(this.gridContainer.children).filter(
      (child) => child.tagName !== "SLOT" && !child.classList.contains("loading") && !child.classList.contains("error")
    );
    existingCards.forEach((card) => card.remove());

    // Add each job as a <job-card>
    this._data.forEach(job => {
      const card = document.createElement("job-card");
      card.data = job;
      this.gridContainer.appendChild(card);
    });
  }

  renderPagination() {
    if (!this.pagination || this.pagination.total_pages <= 1) {
      this.paginationContainer.style.display = "none";
      return;
    }

    this.paginationContainer.style.display = "flex";
    this.paginationContainer.innerHTML = `
      <button id="prev-btn" ${this.currentPage === 1 ? 'disabled' : ''}>Previous</button>
      <span class="pagination-info">
        Page ${this.currentPage} of ${this.pagination.total_pages} (${this.pagination.total_count} jobs)
      </span>
      <button id="next-btn" ${this.currentPage >= this.pagination.total_pages ? 'disabled' : ''}>Next</button>
    `;

    // Add event listeners
    const prevBtn = this.shadowRoot.querySelector("#prev-btn");
    const nextBtn = this.shadowRoot.querySelector("#next-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (this.currentPage > 1) {
          this.loadJobs(this.currentPage - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (this.currentPage < this.pagination.total_pages) {
          this.loadJobs(this.currentPage + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }
}

customElements.define("job-grid", JobGrid);
export { JobGrid };
