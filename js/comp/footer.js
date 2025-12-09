import { tokens } from "../core/design-token.js";

class CustomFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const style = `
      :host {
        display: block;
        width: 100%;
      }

      footer {
        width: 100%;
        padding: ${tokens.spacing.md};
        background: ${tokens.colors.primary};
        color: ${tokens.colors.text};
        text-align: center;
        font-family: ${tokens.fonts.body};
        font-size: 14px;
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <footer>
        © 2025 All rights reserved. | Job Match Up
      </footer>
    `;
  }
}

customElements.define("custom-footer", CustomFooter);
