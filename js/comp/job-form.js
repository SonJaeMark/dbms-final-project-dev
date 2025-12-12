import { tokens } from "../core/design-token.js";
import { addJobWithImages } from "../db-logic/job-lister-handler.js";
import { insertNotification } from "../db-logic/notification-handler.js";

class JobForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.uploadedImages = [];
    this.maxImages = 10;
    this.render();
  }

  connectedCallback() {
    this.setupForm();
    this.setupImageUpload();
    this.updateImageCount();
  }

  setupForm() {
    const form = this.shadowRoot.querySelector("#jobForm");
    if (form) {
      form.addEventListener("submit", (e) => this.handleSubmit(e));
    }

    // Get current user
    try {
      const userStr = localStorage.getItem("auth_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        this.listerId = user.id;
      }
    } catch (err) {
      console.error("Error getting user:", err);
    }
  }

  setupImageUpload() {
    const dropZone = this.shadowRoot.querySelector("#image-drop-zone");
    const fileInput = this.shadowRoot.querySelector("#image-input");

    if (!dropZone || !fileInput) return;

    // Click to select files
    dropZone.addEventListener("click", () => fileInput.click());

    // File input change
    fileInput.addEventListener("change", (e) => {
      this.handleFiles(e.target.files);
    });

    // Drag and drop events
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragover");
      this.handleFiles(e.dataTransfer.files);
    });
  }

  async handleFiles(files) {
    if (this.uploadedImages.length >= this.maxImages) {
      this.showMessage(`Maximum ${this.maxImages} images allowed.`, "error");
      return;
    }

    const remainingSlots = this.maxImages - this.uploadedImages.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (!file.type.startsWith("image/")) {
        this.showMessage(`${file.name} is not an image file.`, "error");
        continue;
      }

      if (file.size > 32 * 1024 * 1024) {
        this.showMessage(`${file.name} is too large (max 32MB).`, "error");
        continue;
      }

      await this.uploadImage(file);
    }
  }

  async uploadImage(file) {
    const dropZone = this.shadowRoot.querySelector("#image-drop-zone");
    const previewContainer = this.shadowRoot.querySelector("#image-preview-container");

    // Show loading state
    const loadingId = `loading-${Date.now()}`;
    const loadingEl = document.createElement("div");
    loadingEl.id = loadingId;
    loadingEl.className = "image-preview loading";
    loadingEl.innerHTML = `
      <div class="image-loading">
        <div class="spinner"></div>
        <p>Uploading ${file.name}...</p>
      </div>
    `;
    previewContainer.appendChild(loadingEl);

    try {
      // Convert to base64
      const base64 = await this.fileToBase64(file);

      // Upload to imgbb using FormData with base64
      const formData = new FormData();
      formData.append("key", "9ea5d3b24ab1336255999305b3cb5528");
      formData.append("image", base64);

      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "Upload failed");
      }

      // Add to uploaded images
      const imageData = {
        id: result.data.id,
        url: result.data.url,
        display_url: result.data.display_url,
        thumb_url: result.data.thumb?.url || result.data.url,
        filename: file.name,
        size: result.data.size
      };

      this.uploadedImages.push(imageData);

      // Update preview
      loadingEl.remove();
      this.renderImagePreview(imageData, previewContainer);

      this.updateImageCount();
    } catch (error) {
      console.error("Error uploading image:", error);
      loadingEl.remove();
      this.showMessage(`Failed to upload ${file.name}: ${error.message}`, "error");
    }
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  renderImagePreview(imageData, container) {
    const previewEl = document.createElement("div");
    previewEl.className = "image-preview";
    previewEl.dataset.imageId = imageData.id;
    previewEl.innerHTML = `
      <img src="${imageData.thumb_url}" alt="${imageData.filename}">
      <button type="button" class="remove-image" data-image-id="${imageData.id}">×</button>
    `;

    const removeBtn = previewEl.querySelector(".remove-image");
    removeBtn.addEventListener("click", () => this.removeImage(imageData.id));

    container.appendChild(previewEl);
  }

  removeImage(imageId) {
    this.uploadedImages = this.uploadedImages.filter(img => img.id !== imageId);
    const previewEl = this.shadowRoot.querySelector(`[data-image-id="${imageId}"]`);
    if (previewEl) {
      previewEl.remove();
    }
    this.updateImageCount();
  }

  updateImageCount() {
    const countEl = this.shadowRoot.querySelector("#image-count");
    if (countEl) {
      countEl.textContent = `${this.uploadedImages.length}/${this.maxImages}`;
    }

    const dropZone = this.shadowRoot.querySelector("#image-drop-zone");
    if (dropZone) {
      if (this.uploadedImages.length >= this.maxImages) {
        dropZone.classList.add("disabled");
      } else {
        dropZone.classList.remove("disabled");
      }
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    if (!this.listerId) {
      this.showMessage("Please log in to create a job.", "error");
      return;
    }

    const form = event.target;
    const formData = new FormData(form);
    const msgEl = this.shadowRoot.querySelector("#message");

    // Clear previous message
    msgEl.textContent = "";
    msgEl.className = "message";

    // Get form values
    const jobData = {
      p_title: formData.get("title")?.trim(),
      p_description: formData.get("description")?.trim(),
      p_category: formData.get("category")?.trim(),
      p_work_type: formData.get("work_type")?.trim(),
      p_location: formData.get("location")?.trim(),
      p_work_schedule: formData.get("work_schedule")?.trim(),
      p_rate_amount: parseFloat(formData.get("rate_amount")) || 0,
      p_rate_type: formData.get("rate_type")?.trim(),
      p_salary_notes: formData.get("salary_notes")?.trim() || "",
      p_vacancies_available: parseInt(formData.get("vacancies")) || 1,
      p_required_skills: formData.get("required_skills")?.trim() || "",
      p_status: formData.get("status")?.trim() || "draft",
      p_lister_id: this.listerId,
      p_images: this.uploadedImages.map((img, index) => ({
        file_url: img.url,
        caption: img.filename,
        display_order: index + 1
      }))
    };

    // Validation
    if (!jobData.p_title || !jobData.p_description || !jobData.p_category) {
      this.showMessage("Please fill in all required fields.", "error");
      return;
    }

    // Show loading state
    const submitBtn = this.shadowRoot.querySelector("#submitBtn");
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating...";

    // Submit job
    console.log("Submitting job with data:", jobData);
    const result = await addJobWithImages(jobData);
    console.log("Job submission result:", result);

    if (!result.success) {
      const errorMsg = result.message || "Failed to create job. Please try again.";
      console.error("Job creation failed:", result.error);
      this.showMessage(errorMsg, "error");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }

    // Success
    this.showMessage("Job created successfully!", "success");
    form.reset();
    
    // Clear images
    this.uploadedImages = [];
    const previewContainer = this.shadowRoot.querySelector("#image-preview-container");
    if (previewContainer) {
      previewContainer.innerHTML = "";
    }
    this.updateImageCount();

    // Create notification based on status
    try {
      const notificationType = jobData.p_status === "draft" ? "JOB DRAFTED" : "JOB SUBMITTED";
      const notificationMessage = jobData.p_status === "draft" 
        ? "Your job has been saved as a draft."
        : "Your job has been submitted for admin approval.";
      
      await insertNotification(
        this.listerId,
        notificationType,
        { message: notificationMessage }
      );
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
      // Don't fail the job creation if notification fails
    }

    // Dispatch event for parent to handle
    this.dispatchEvent(new CustomEvent("job-created", {
      detail: { job_id: result.job_id }
    }));

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }

  showMessage(text, type) {
    const msgEl = this.shadowRoot.querySelector("#message");
    msgEl.textContent = text;
    msgEl.className = `message ${type}`;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: ${tokens.fonts.body};
          display: block;
          width: 100%;
        }

        .form-container {
          background: white;
          padding: ${tokens.spacing.xl};
          border-radius: ${tokens.radius.lg};
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        h2 {
          margin-bottom: ${tokens.spacing.lg};
          color: ${tokens.colors.text};
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: ${tokens.spacing.md};
          margin-bottom: ${tokens.spacing.md};
        }

        .form-group {
          margin-bottom: ${tokens.spacing.md};
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        label {
          display: block;
          margin-bottom: ${tokens.spacing.sm};
          font-weight: 600;
          color: ${tokens.colors.text};
          font-size: 0.9rem;
        }

        label .required {
          color: red;
        }

        input, select, textarea {
          width: 100%;
          padding: ${tokens.spacing.sm};
          border: 1px solid #ddd;
          border-radius: ${tokens.radius.md};
          font-size: 1rem;
          font-family: ${tokens.fonts.body};
          transition: border-color 0.2s;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: ${tokens.colors.primary};
        }

        textarea {
          resize: vertical;
          min-height: 120px;
        }

        .button-group {
          display: flex;
          gap: ${tokens.spacing.md};
          margin-top: ${tokens.spacing.lg};
        }

        button {
          padding: ${tokens.spacing.md} ${tokens.spacing.xl};
          border: none;
          border-radius: ${tokens.radius.md};
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: ${tokens.fonts.body};
        }

        button[type="submit"] {
          background: ${tokens.colors.primary};
          color: white;
        }

        button[type="submit"]:hover:not(:disabled) {
          background: ${tokens.colors.secondary};
        }

        button[type="submit"]:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        button[type="reset"] {
          background: #f5f5f5;
          color: ${tokens.colors.text};
        }

        button[type="reset"]:hover {
          background: #e0e0e0;
        }

        .message {
          margin-top: ${tokens.spacing.md};
          padding: ${tokens.spacing.md};
          border-radius: ${tokens.radius.md};
          text-align: center;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .image-upload-section {
          margin-top: ${tokens.spacing.sm};
        }

        .image-drop-zone {
          border: 2px dashed #ddd;
          border-radius: ${tokens.radius.md};
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: #fafafa;
        }

        .image-drop-zone:hover {
          border-color: ${tokens.colors.primary};
          background: #f0f0f0;
        }

        .image-drop-zone.dragover {
          border-color: ${tokens.colors.primary};
          background: #e8f4f8;
        }

        .image-drop-zone.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .drop-zone-content {
          pointer-events: none;
        }

        .drop-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .drop-text {
          font-size: 1rem;
          color: ${tokens.colors.text};
          margin: 0.5rem 0;
        }

        .drop-hint {
          font-size: 0.85rem;
          color: #666;
          margin: 0.5rem 0 0 0;
        }

        .image-preview-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .image-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: ${tokens.radius.md};
          overflow: hidden;
          border: 2px solid #ddd;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-preview .remove-image {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 0, 0, 0.8);
          color: white;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .image-preview .remove-image:hover {
          background: rgba(255, 0, 0, 1);
        }

        .image-preview.loading {
          border: 2px dashed #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-loading {
          text-align: center;
        }

        .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid ${tokens.colors.primary};
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .image-preview-container {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }
        }
      </style>

      <div class="form-container">
        <h2>Create New Job Posting</h2>
        <form id="jobForm">
          <div class="form-grid">
            <div class="form-group">
              <label>Job Title <span class="required">*</span></label>
              <input type="text" name="title" required placeholder="e.g., Frontend Developer">
            </div>

            <div class="form-group">
              <label>Category <span class="required">*</span></label>
              <select name="category" required>
                <option value="">Select Category</option>
                <option value="Construction Worker">Construction Worker</option>
                    <option value="Karpintero">Karpintero</option>
                    <option value="Tubero">Tubero</option>
                    <option value="Elektrisyan">Elektrisyan</option>
                    <option value="Mekaniko (Sasakyan o Motor)">Mekaniko (Sasakyan o Motor)</option>
                    <option value="Kasambahay / Yaya">Kasambahay / Yaya</option>
                    <option value="Tagalinis / Housekeeper">Tagalinis / Housekeeper</option>
                    <option value="Drayber (Family Driver / Delivery Driver)">Drayber (Family Driver / Delivery Driver)</option>
                    <option value="Tindero / Tindera">Tindero / Tindera</option>
                    <option value="Tagapagturo / Tutor">Tagapagturo / Tutor</option>
                    <option value="Aricon Technician">Aricon Technician</option>
                    <option value="Others">Others</option>
              </select>
            </div>

            <div class="form-group">
              <label>Work Type <span class="required">*</span></label>
              <select name="work_type" required>
                <option value="">Select Work Type</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div class="form-group">
              <label>Location <span class="required">*</span></label>
              <input type="text" name="location" required placeholder="e.g., Manila, Philippines">
            </div>

            <div class="form-group">
              <label>Work Schedule</label>
              <select name="work_schedule">
                <option value="">Select Schedule</option>
                <option value="Day Shift">Day Shift</option>
                <option value="Night Shift">Night Shift</option>
                <option value="Shifting Schedule">Shifting Schedule</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div class="form-group">
              <label>Rate Amount <span class="required">*</span></label>
              <input type="number" name="rate_amount" required min="0" step="0.01" placeholder="0.00">
            </div>

            <div class="form-group">
              <label>Rate Type <span class="required">*</span></label>
              <select name="rate_type" required>
                <option value="">Select Rate Type</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
                <option value="per_project">Per Project</option>
                <option value="per_call">Per Call</option>
              </select>
            </div>

            <div class="form-group">
              <label>Vacancies Available</label>
              <input type="number" name="vacancies" min="1" value="1" placeholder="1">
            </div>

            <div class="form-group full-width">
              <label>Description <span class="required">*</span></label>
              <textarea name="description" required placeholder="Describe the job role, responsibilities, and requirements..."></textarea>
            </div>

            <div class="form-group full-width">
              <label>Required Skills</label>
              <input type="text" name="required_skills" placeholder="e.g., React, JavaScript, CSS">
            </div>

            <div class="form-group full-width">
              <label>Salary Notes</label>
              <input type="text" name="salary_notes" placeholder="e.g., Negotiable based on experience">
            </div>

            <div class="form-group full-width">
              <label>Job Images <span class="required">(Optional)</span></label>
              <div class="image-upload-section">
                <div id="image-drop-zone" class="image-drop-zone">
                  <input type="file" id="image-input" accept="image/*" multiple style="display: none;">
                  <div class="drop-zone-content">
                    <span class="drop-icon">📷</span>
                    <p class="drop-text">Drag and drop images here or click to select</p>
                    <p class="drop-hint">Up to <span id="image-count">0/10</span> images (Max 32MB each)</p>
                  </div>
                </div>
                <div id="image-preview-container" class="image-preview-container"></div>
              </div>
            </div>

            <div class="form-group">
              <label>Status</label>
              <select name="status">
                <option value="draft">Draft</option>
                <option value="pending_approval">Post</option>
              </select>
            </div>
          </div>

          <div class="button-group">
            <button type="submit" id="submitBtn">Create Job</button>
            <button type="reset">Clear Form</button>
          </div>

          <div id="message" class="message"></div>
        </form>
      </div>
    `;
  }
}

customElements.define("job-form", JobForm);
export { JobForm };
