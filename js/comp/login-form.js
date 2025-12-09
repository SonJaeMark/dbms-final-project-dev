import { tokens } from "../core/design-token.js";
import { loginUser } from "../db-logic/login-handler.js";

class LoginForm extends HTMLElement {
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
          max-width: 350px;
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

        input {
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
          text-align: center;
          margin-top: ${tokens.spacing.md};
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
        <h2>Login</h2>

        <form id="loginForm">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="email" required />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" id="password" required />
          </div>

          <button type="submit">Login</button>

          <div id="msg" class="message"></div>

          <span class="link" id="registerLink">Register an account</span>
        </form>
      </div>
    `;

    this.shadowRoot.innerHTML = style + html;

    // Switch to register form
    this.shadowRoot.getElementById("registerLink")
      ?.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("go-to-register"));
      });

    // Handle login
    this.shadowRoot.getElementById("loginForm")
      .addEventListener("submit", (e) => this.handleLogin(e));
  }

  // ---------------------------------------------
  //   CLEAN + WORKING LOGIN FUNCTION
  // ---------------------------------------------
  async handleLogin(event) {
    event.preventDefault();

    const email = this.shadowRoot.getElementById("email").value.trim();
    const password = this.shadowRoot.getElementById("password").value.trim();
    const msg = this.shadowRoot.getElementById("msg");

    msg.textContent = "";
    msg.className = "message";

    const result = await loginUser(email, password);

    if (!result.success) {
      msg.textContent = result.message;
      msg.classList.add("error");
      return;
    }

    // SUCCESS
    msg.textContent = "Login Successful!";
    msg.classList.add("success");

    const user = result.data;

    // Save session
    localStorage.setItem("auth_user", JSON.stringify(user));

    // Dispatch login-success event for navbar update
    window.dispatchEvent(
      new CustomEvent("login-success", { detail: user })
    );

    // ROLE REDIRECTION
    switch (user.role) {
      case "admin":
        window.location.href = "dashboard-admin.html";
        break;

      case "job_lister":
        window.location.href = "dashboard-job-lister.html";
        break;

      case "job_seeker":
        window.location.href = "dashboard-job-seeker.html";
        break;

      default:
        alert("Unknown role. Contact support.");
    }
  }
}

customElements.define("login-form", LoginForm);
