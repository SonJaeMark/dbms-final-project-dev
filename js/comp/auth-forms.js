import { tokens } from "../core/design-token.js";
import { registerUser } from "../db-logic/register-handler.js";
import { verifyPassword } from "../security/password.js"; // make sure this is exported

// Shared styles for both forms
const formStyles = `
<style>
:host {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${tokens.colors.background};
  font-family: ${tokens.fonts.body};
}

form {
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
  width: 100%;
  max-width: 400px;
  background: white;
  padding: ${tokens.spacing.lg};
  border-radius: ${tokens.radius.lg};
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  box-sizing: border-box;
}

h2 {
  color: ${tokens.colors.secondary};
  text-align: center;
  margin-bottom: ${tokens.spacing.md};
}

input, select, button {
  width: 100%;
  padding: 12px;
  border-radius: ${tokens.radius.md};
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
}

button {
  background-color: ${tokens.colors.primary};
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e79fb7;
}

p#message {
  text-align: center;
  font-weight: bold;
  font-size: 0.9rem;
  margin-top: ${tokens.spacing.sm};
}

p.error {
  color: ${tokens.colors.error};
}

p.success {
  color: ${tokens.colors.success};
}
</style>
`;

class RegisterForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      ${formStyles}
      <form id="register-form">
        <h2>Register</h2>
        <input type="text" id="full-name" placeholder="Full Name" required>
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <select id="role" required>
          <option value="">Select Role</option>
          <option value="job_seeker">Job Seeker</option>
          <option value="job_lister">Job Lister</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
        <p id="message"></p>
      </form>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#register-form").addEventListener("submit", async e => {
      e.preventDefault();
      await this.handleRegister();
    });
  }

  async handleRegister() {
    const fullName = this.shadowRoot.querySelector("#full-name").value;
    const email = this.shadowRoot.querySelector("#email").value;
    const password = this.shadowRoot.querySelector("#password").value;
    const role = this.shadowRoot.querySelector("#role").value;
    const messageEl = this.shadowRoot.querySelector("#message");

    const result = await registerUser({ full_name: fullName, email, password, role });

    messageEl.textContent = result.message;
    messageEl.className = result.success ? "success" : "error";

    if (result.success) this.shadowRoot.querySelector("#register-form").reset();
  }
}

class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      ${formStyles}
      <form id="login-form">
        <h2>Login</h2>
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Login</button>
        <p id="message"></p>
      </form>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#login-form").addEventListener("submit", async e => {
      e.preventDefault();
      await this.handleLogin();
    });
  }

  async handleLogin() {
    const email = this.shadowRoot.querySelector("#email").value;
    const password = this.shadowRoot.querySelector("#password").value;
    const messageEl = this.shadowRoot.querySelector("#message");

    // Example: Fetch user from Supabase instead of local users array
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      messageEl.textContent = "Invalid email or password";
      messageEl.className = "error";
      return;
    }

    const valid = await verifyPassword(password, user.salt, user.password_hash);
    if (valid) {
      messageEl.textContent = `Welcome ${user.full_name}!`;
      messageEl.className = "success";
    } else {
      messageEl.textContent = "Invalid email or password";
      messageEl.className = "error";
    }
  }
}

customElements.define("register-form", RegisterForm);
customElements.define("login-form", LoginForm);
