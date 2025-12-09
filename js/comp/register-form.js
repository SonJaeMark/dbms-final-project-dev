import { tokens } from "../core/design-token.js";
import { registerUser } from "../db-logic/register-handler.js";

class RegisterForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    const style = `
      <style>
        :host {
          font-family: ${tokens.fonts.body};
          display: block;
          width: 100%;
          max-width: 380px;
          margin: auto;
        }

        .container {
          background: white;
          padding: ${tokens.spacing.xl};
          border-radius: ${tokens.radius.lg};
          box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
        }

        h2 {
          text-align: center;
          margin-bottom: ${tokens.spacing.lg};
          color: ${tokens.colors.text};
        }

        .form-group {
          margin-bottom: ${tokens.spacing.md};
        }

        label {
          font-size: 14px;
        }

        input, select {
          width: 100%;
          padding: ${tokens.spacing.sm};
          border-radius: ${tokens.radius.md};
          border: 1px solid #ccc;
          font-size: 16px;
        }

        button {
          width: 100%;
          padding: ${tokens.spacing.md};
          background: ${tokens.colors.primary};
          border: none;
          border-radius: ${tokens.radius.md};
          cursor: pointer;
          font-size: 16px;
          transition: 0.2s;
        }

        button:hover {
          background: ${tokens.colors.secondary};
          color: white;
        }

        .link {
          display: block;
          margin-top: ${tokens.spacing.md};
          text-align: center;
          color: ${tokens.colors.secondary};
          cursor: pointer;
        }

        .link:hover {
          text-decoration: underline;
        }

        .message {
          margin-top: ${tokens.spacing.md};
          text-align: center;
          font-size: 14px;
        }
        .success { color: ${tokens.colors.success}; }
        .error { color: ${tokens.colors.error}; }
      </style>
    `;

    const html = `
      <div class="container">
        <h2>Create Account</h2>

        <form id="registerForm">

          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="full_name" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" id="email" required />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" id="password" required minlength="6" />
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" id="confirm_password" required minlength="6" />
          </div>

          <div class="form-group">
            <label>Role</label>
            <select id="role" required>
              <option value="job_lister">Job Lister</option>
              <option value="job_seeker">Job Seeker</option>
            </select>
          </div>

          <button type="submit">Register</button>

          <div id="msg" class="message"></div>

          <span class="link" id="loginLink">Already have an account?</span>
        </form>
      </div>
    `;

    this.shadowRoot.innerHTML = style + html;

    // Add event listeners
    this.shadowRoot.getElementById("loginLink")?.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("go-to-login"));
    });

    this.shadowRoot.getElementById("registerForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleRegister();
    });
  }

  async handleRegister() {
    const full_name = this.shadowRoot.getElementById("full_name").value.trim();
    const email = this.shadowRoot.getElementById("email").value.trim();
    const password = this.shadowRoot.getElementById("password").value;
    const confirm_password = this.shadowRoot.getElementById("confirm_password").value;
    const role = this.shadowRoot.getElementById("role").value;

    const msg = this.shadowRoot.getElementById("msg");

    // Clear message
    msg.textContent = "";
    msg.className = "message";

    // Validate password match
    if (password !== confirm_password) {
      msg.textContent = "Passwords do not match.";
      msg.classList.add("error");
      return;
    }

    // Call register handler
    const result = await registerUser({
      full_name,
      email,
      password,
      role
    });

    if (!result.success) {
      msg.textContent = result.message;
      msg.classList.add("error");
      return;
    }

    // Success
    msg.textContent = "Registration successful! Redirecting...";
    msg.classList.add("success");

    // Switch to login form after 1 second
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent("go-to-login"));
    }, 1000);
  }
}

customElements.define("register-form", RegisterForm);
