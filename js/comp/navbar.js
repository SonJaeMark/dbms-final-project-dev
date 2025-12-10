import { tokens } from "../core/design-token.js";
import { getAllUnreadNotifications, updateNotificationToRead } from "../db-logic/notification-handler.js";

class CustomNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.unreadCount = 0;
    this.notifications = [];
    this.render();
  }

  connectedCallback() {
    this.setupEventListeners();
    this.updateMenu();
    this.loadNotifications();
    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener("storage", () => {
      this.updateMenu();
      this.loadNotifications();
    });
    // Listen for custom login/logout events
    window.addEventListener("login-success", () => {
      this.updateMenu();
      this.loadNotifications();
    });
    window.addEventListener("logout", () => {
      this.updateMenu();
      this.notifications = [];
      this.unreadCount = 0;
    });
    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => this.handleClickOutside(e));
    // Refresh notifications periodically
    this.notificationInterval = setInterval(() => {
      this.loadNotifications();
    }, 30000); // Every 30 seconds
  }

  setupEventListeners() {
    // Hamburger menu toggle
    const menuIcon = this.shadowRoot.querySelector(".menu-icon");
    const menuToggle = this.shadowRoot.querySelector("#menu-toggle");
    if (menuIcon) {
      menuIcon.setAttribute('tabindex', '0');
      menuIcon.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openSidePanel();
      });
      menuIcon.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openSidePanel();
        }
      });
    }
    if (menuToggle) {
      menuToggle.addEventListener("change", () => {
        if (menuToggle.checked) {
          this.openSidePanel();
        } else {
          this.closeSidePanel();
        }
      });
    }

    // Side panel close button
    const closeBtn = this.shadowRoot.querySelector("#side-panel-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.closeSidePanel();
      });
    }

    // Side panel overlay
    const overlay = this.shadowRoot.querySelector("#side-panel-overlay");
    if (overlay) {
      overlay.addEventListener("click", () => {
        this.closeSidePanel();
      });
    }
  }

  disconnectedCallback() {
    window.removeEventListener("storage", () => this.updateMenu());
    window.removeEventListener("login-success", () => this.updateMenu());
    window.removeEventListener("logout", () => this.updateMenu());
    document.removeEventListener("click", (e) => this.handleClickOutside(e));
    if (this._escapeHandler) {
      document.removeEventListener("keydown", this._escapeHandler);
    }
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
    document.body.style.overflow = "";
  }

  async loadNotifications() {
    const user = this.getAuthUser();
    if (!user) {
      this.unreadCount = 0;
      this.updateNotificationBadge();
      return;
    }

    try {
      const result = await getAllUnreadNotifications(user.id);
      if (result.success) {
        this.notifications = result.data || [];
        this.unreadCount = this.notifications.length;
        this.updateNotificationBadge();
        this.updateSidePanelNotifications();
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  }

  updateNotificationBadge() {
    const badge = this.shadowRoot.querySelector(".notification-badge");
    if (badge) {
      if (this.unreadCount > 0) {
        badge.textContent = this.unreadCount > 99 ? "99+" : this.unreadCount;
        badge.style.display = "flex";
      } else {
        badge.style.display = "none";
      }
    }
  }

  updateSidePanelNotifications() {
    const notificationsList = this.shadowRoot.querySelector(".side-panel-notifications");
    if (!notificationsList) return;

    notificationsList.innerHTML = "";
    
    if (this.notifications.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "notification-empty";
      emptyMsg.textContent = "No new notifications";
      notificationsList.appendChild(emptyMsg);
      return;
    }

    this.notifications.forEach((notif) => {
      const notifItem = document.createElement("div");
      notifItem.className = "notification-item";
      notifItem.innerHTML = `
        <div class="notification-content">
          <div class="notification-type">${notif.type}</div>
          <div class="notification-message">${notif.data?.message || "New notification"}</div>
          <div class="notification-time">${this.formatTime(notif.created_at)}</div>
        </div>
      `;
      notifItem.addEventListener("click", () => this.markAsRead(notif.id));
      notificationsList.appendChild(notifItem);
    });
  }

  async markAsRead(notifId) {
    const user = this.getAuthUser();
    if (!user) return;

    try {
      const result = await updateNotificationToRead(notifId, user.id);
      if (result.success) {
        // Remove from local list
        this.notifications = this.notifications.filter(n => n.id !== notifId);
        this.unreadCount = this.notifications.length;
        this.updateNotificationBadge();
        this.updateSidePanelNotifications();
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }

  formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  handleClickOutside(event) {
    const modal = this.shadowRoot.querySelector(".user-modal");
    const sidePanel = this.shadowRoot.querySelector(".mobile-side-panel");
    
    if (modal) {
      const path = event.composedPath();
      const isInsideModalContent = path.some(node => {
        if (node.nodeType === 1 && node.classList) {
          return node.classList.contains("user-modal-content") ||
                 node.classList.contains("user-icon-btn");
        }
        return false;
      });
      
      if (!isInsideModalContent && modal.classList.contains("show")) {
        const overlay = this.shadowRoot.querySelector(".user-modal-overlay");
        if (path.includes(overlay)) {
          this.closeUserModal();
        }
      }
    }

    if (sidePanel && sidePanel.classList.contains("open")) {
      const path = event.composedPath();
      const isInsideSidePanel = path.some(node => {
        if (node.nodeType === 1 && node.classList) {
          return node.classList.contains("mobile-side-panel") ||
                 node.classList.contains("menu-icon");
        }
        return false;
      });
      
      if (!isInsideSidePanel) {
        this.closeSidePanel();
      }
    }
  }

  toggleSidePanel() {
    const sidePanel = this.shadowRoot.querySelector(".mobile-side-panel");
    const menuToggle = this.shadowRoot.querySelector("#menu-toggle");
    
    if (sidePanel) {
      const isOpen = sidePanel.classList.contains("open");
      if (isOpen) {
        this.closeSidePanel();
      } else {
        this.openSidePanel();
      }
    }
  }

  openSidePanel() {
    const sidePanel = this.shadowRoot.querySelector(".mobile-side-panel");
    const menuToggle = this.shadowRoot.querySelector("#menu-toggle");
    if (sidePanel) {
      sidePanel.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    if (menuToggle) {
      menuToggle.checked = true;
    }
  }

  closeSidePanel() {
    const sidePanel = this.shadowRoot.querySelector(".mobile-side-panel");
    const menuToggle = this.shadowRoot.querySelector("#menu-toggle");
    if (sidePanel) {
      sidePanel.classList.remove("open");
      document.body.style.overflow = "";
    }
    if (menuToggle) {
      menuToggle.checked = false;
    }
  }

  toggleUserModal() {
    const modal = this.shadowRoot.querySelector(".user-modal");
    if (modal) {
      if (modal.classList.contains("show")) {
        this.closeUserModal();
      } else {
        this.openUserModal();
      }
    }
  }

  openUserModal() {
    const modal = this.shadowRoot.querySelector(".user-modal");
    if (modal) {
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  }

  closeUserModal() {
    const modal = this.shadowRoot.querySelector(".user-modal");
    if (modal) {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    }
  }

  getAuthUser() {
    try {
      const userStr = localStorage.getItem("auth_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  getDashboardUrl(role) {
    switch (role) {
      case "admin":
        return "dashboard-admin.html";
      case "job_lister":
        return "dashboard-job-lister.html";
      case "job_seeker":
        return "dashboard-job-seeker.html";
      default:
        return null;
    }
  }

  handleLogout() {
    localStorage.removeItem("auth_user");
    window.location.href = "index.html";
    window.dispatchEvent(new CustomEvent("logout"));
  }

  updateMenu() {
    const navMenu = this.shadowRoot.querySelector(".nav-menu");
    if (!navMenu) return;

    const user = this.getAuthUser();
    const isLoggedIn = !!user;

    // Clear existing menu items (except slot)
    const slot = navMenu.querySelector("slot");
    const existingItems = Array.from(navMenu.children).filter(
      (child) => child.tagName !== "SLOT"
    );
    existingItems.forEach((item) => item.remove());

    // Always show these
    const homeLi = document.createElement("li");
    homeLi.innerHTML = '<a class="nav-link" href="index.html">Home</a>';
    navMenu.insertBefore(homeLi, slot);

    // Update user icon dropdown
    this.updateUserIcon(isLoggedIn, user);
    this.updateSidePanel(isLoggedIn, user);

    if (isLoggedIn) {
      // Show Dashboard link
      const dashboardUrl = this.getDashboardUrl(user.role);
      if (dashboardUrl) {
        const dashboardLi = document.createElement("li");
        dashboardLi.innerHTML = `<a class="nav-link" href="${dashboardUrl}">Dashboard</a>`;
        navMenu.insertBefore(dashboardLi, slot);
      }
    } else {
      // Show Login and Register
      const loginLi = document.createElement("li");
      loginLi.innerHTML = '<a class="nav-link" href="login.html">Login</a>';
      navMenu.insertBefore(loginLi, slot);

      const registerLi = document.createElement("li");
      registerLi.innerHTML =
        '<a class="nav-link" href="register.html">Register</a>';
      navMenu.insertBefore(registerLi, slot);
    }

    // Always show these
    const aboutLi = document.createElement("li");
    aboutLi.innerHTML = '<a class="nav-link" href="about-us.html">About Us</a>';
    navMenu.insertBefore(aboutLi, slot);

    const contactLi = document.createElement("li");
    contactLi.innerHTML =
      '<a class="nav-link" href="contact-us.html">Contact Us</a>';
    navMenu.insertBefore(contactLi, slot);
  }

  updateSidePanel(isLoggedIn, user) {
    const sidePanel = this.shadowRoot.querySelector(".mobile-side-panel");
    if (!sidePanel) return;

    const panelContent = sidePanel.querySelector(".side-panel-content");
    if (!panelContent) return;

    // Clear existing content except header
    const header = panelContent.querySelector(".side-panel-header");
    const existingContent = Array.from(panelContent.children).filter(
      (child) => !child.classList.contains("side-panel-header")
    );
    existingContent.forEach((item) => item.remove());

    // Add navigation links
    const navSection = document.createElement("div");
    navSection.className = "side-panel-section";
    
    const navTitle = document.createElement("div");
    navTitle.className = "side-panel-title";
    navTitle.textContent = "Navigation";
    navSection.appendChild(navTitle);
    
    const homeLink = document.createElement("a");
    homeLink.href = "index.html";
    homeLink.className = "side-panel-link";
    homeLink.textContent = "🏠 Home";
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      const url = homeLink.href;
      this.closeSidePanel();
      setTimeout(() => location.assign(url), 0);
    });
    navSection.appendChild(homeLink);

    if (isLoggedIn) {
      const dashboardLink = document.createElement("a");
      dashboardLink.href = this.getDashboardUrl(user.role);
      dashboardLink.className = "side-panel-link";
      dashboardLink.textContent = "📊 Dashboard";
      dashboardLink.addEventListener("click", (e) => {
        e.preventDefault();
        const url = dashboardLink.href;
        this.closeSidePanel();
        setTimeout(() => location.assign(url), 0);
      });
      navSection.appendChild(dashboardLink);
    }

    const aboutLink = document.createElement("a");
    aboutLink.href = "about-us.html";
    aboutLink.className = "side-panel-link";
    aboutLink.textContent = "ℹ️ About Us";
    aboutLink.addEventListener("click", (e) => {
      e.preventDefault();
      const url = aboutLink.href;
      this.closeSidePanel();
      setTimeout(() => location.assign(url), 0);
    });
    navSection.appendChild(aboutLink);

    const contactLink = document.createElement("a");
    contactLink.href = "contact-us.html";
    contactLink.className = "side-panel-link";
    contactLink.textContent = "📧 Contact Us";
    contactLink.addEventListener("click", (e) => {
      e.preventDefault();
      const url = contactLink.href;
      this.closeSidePanel();
      setTimeout(() => location.assign(url), 0);
    });
    navSection.appendChild(contactLink);

    if (!isLoggedIn) {
      const loginLink = document.createElement("a");
      loginLink.href = "login.html";
      loginLink.className = "side-panel-link";
      loginLink.textContent = "🔑 Login";
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        const url = loginLink.href;
        this.closeSidePanel();
        setTimeout(() => location.assign(url), 0);
      });
      navSection.appendChild(loginLink);

      const registerLink = document.createElement("a");
      registerLink.href = "register.html";
      registerLink.className = "side-panel-link";
      registerLink.textContent = "📝 Register";
      registerLink.addEventListener("click", (e) => {
        e.preventDefault();
        const url = registerLink.href;
        this.closeSidePanel();
        setTimeout(() => location.assign(url), 0);
      });
      navSection.appendChild(registerLink);
    }

    panelContent.appendChild(navSection);

    // Removed notifications, settings, and logout from side panel
  }

  updateUserIcon(isLoggedIn, user) {
    const navContainer = this.shadowRoot.querySelector(".nav-container");
    if (!navContainer) return;

    // Remove existing user icon if any
    const existingUserMenu = this.shadowRoot.querySelector(".user-menu-container");
    if (existingUserMenu) {
      existingUserMenu.remove();
    }

    // Remove existing modal if any
    const existingModal = this.shadowRoot.querySelector(".user-modal");
    if (existingModal) {
      existingModal.remove();
      document.body.style.overflow = "";
    }

    if (isLoggedIn) {
      // Create user icon with modal
      const userMenuContainer = document.createElement("div");
      userMenuContainer.className = "user-menu-container";

      const userIcon = document.createElement("button");
      userIcon.className = "user-icon-btn";
      userIcon.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      userIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleUserModal();
      });

      // Create modal structure
      const modal = document.createElement("div");
      modal.className = "user-modal";
      
      const overlay = document.createElement("div");
      overlay.className = "user-modal-overlay";
      overlay.addEventListener("click", () => this.closeUserModal());
      
      const modalContent = document.createElement("div");
      modalContent.className = "user-modal-content";
      modalContent.innerHTML = `
        <div class="modal-header">
          <h3>Account Menu</h3>
          <button class="modal-close-btn" id="modal-close-btn">×</button>
        </div>
        <div class="modal-body">
          <a href="#" class="modal-item" id="notifications-item">
            <span>🔔</span> Notifications
            <span class="notification-badge" style="display: ${this.unreadCount > 0 ? 'flex' : 'none'}">${this.unreadCount > 99 ? '99+' : this.unreadCount}</span>
          </a>
          <a href="#" class="modal-item" id="settings-item">
            <span>⚙️</span> Account Settings
          </a>
          <div class="modal-divider"></div>
          <button class="modal-item" id="logout-item">
            <span>🚪</span> Logout
          </button>
        </div>
      `;

      // Add event listeners for modal items
      modalContent.querySelector("#logout-item").addEventListener("click", () => {
        this.closeUserModal();
        this.handleLogout();
      });

      modalContent.querySelector("#notifications-item").addEventListener("click", (e) => {
        e.preventDefault();
        this.closeUserModal();
        alert("Notifications feature coming soon!");
      });

      modalContent.querySelector("#settings-item").addEventListener("click", (e) => {
        e.preventDefault();
        this.closeUserModal();
        alert("Account Settings feature coming soon!");
      });

      modalContent.querySelector("#modal-close-btn").addEventListener("click", () => {
        this.closeUserModal();
      });

      // Close on Escape key
      const handleEscape = (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
          this.closeUserModal();
        }
      };
      document.addEventListener("keydown", handleEscape);
      this._escapeHandler = handleEscape;

      modal.appendChild(overlay);
      modal.appendChild(modalContent);

      userMenuContainer.appendChild(userIcon);
      navContainer.appendChild(userMenuContainer);
      this.shadowRoot.appendChild(modal);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --bg: ${tokens.colors.background};
          --text: ${tokens.colors.text};
          --primary: ${tokens.colors.primary};

          --spacing-sm: ${tokens.spacing.sm};
          --spacing-md: ${tokens.spacing.md};
          --spacing-lg: ${tokens.spacing.lg};

          --radius-md: ${tokens.radius.md};
          --font-body: ${tokens.fonts.body};
        }

        .navbar {
          width: 100%;
          max-width: 100%;
          background: var(--bg);
          box-shadow: 0 2px 5px rgba(0,0,0,0.15);
          position: relative;
          z-index: 50;
          font-family: var(--font-body);
          overflow: hidden;
        }

        .nav-container {
          max-width: 1100px;
          margin: auto;
          padding: var(--spacing-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .nav-logo {
          font-size: 1.4rem;
          font-weight: bold;
          color: var(--text);
          text-decoration: none;
        }

        #menu-toggle {
          display: none;
        }

        .menu-icon {
          font-size: 1.8rem;
          cursor: pointer;
          display: none;
          user-select: none;
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          transition: 0.2s;
        }

        .menu-icon:hover {
          background: var(--primary);
          color: white;
        }

        .nav-menu {
          list-style: none;
          display: flex;
          gap: var(--spacing-lg);
          margin: 0;
          padding: 0;
        }

        .nav-link {
          text-decoration: none;
          color: var(--text);
          font-size: 1rem;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          transition: 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
        }

        .nav-link:hover {
          background: var(--primary);
          color: white;
        }

        .user-menu-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .user-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-sm);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text);
          transition: all 0.2s;
          width: 40px;
          height: 40px;
        }

        .user-icon-btn:hover {
          background: var(--primary);
          color: white;
        }

        .user-icon-btn svg {
          width: 24px;
          height: 24px;
        }

        .notification-badge {
          display: none;
          align-items: center;
          justify-content: center;
          background: #dc3545;
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          border-radius: 10px;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          margin-left: auto;
        }

        /* Mobile Side Panel */
        .mobile-side-panel {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: white;
          box-shadow: 2px 0 10px rgba(0,0,0,0.2);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 10000;
          overflow-y: auto;
        }

        .mobile-side-panel.open {
          transform: translateX(0);
        }

        .side-panel-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          z-index: 9999;
          pointer-events: none;
        }

        .mobile-side-panel.open + .side-panel-overlay {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }

        .side-panel-content {
          padding: var(--spacing-lg);
        }

        .side-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: var(--spacing-lg);
          border-bottom: 2px solid #e0e0e0;
          margin-bottom: var(--spacing-lg);
        }

        .side-panel-header h3 {
          margin: 0;
          color: var(--text);
          font-size: 1.3rem;
        }

        .side-panel-close {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .side-panel-close:hover {
          background: #f5f5f5;
          color: var(--text);
        }

        .side-panel-section {
          margin-bottom: var(--spacing-xl);
        }

        .side-panel-title {
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-md);
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .side-panel-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          color: var(--text);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: background 0.2s;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 1rem;
          margin-bottom: var(--spacing-xs);
        }

        .side-panel-link:hover {
          background: #f5f5f5;
        }

        .side-panel-notifications {
          max-height: 400px;
          overflow-y: auto;
        }

        .notification-item {
          padding: var(--spacing-md);
          border-bottom: 1px solid #e0e0e0;
          cursor: pointer;
          transition: background 0.2s;
        }

        .notification-item:hover {
          background: #f5f5f5;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .notification-type {
          font-weight: 600;
          color: var(--primary);
          font-size: 0.9rem;
        }

        .notification-message {
          color: var(--text);
          font-size: 0.95rem;
        }

        .notification-time {
          color: #666;
          font-size: 0.85rem;
        }

        .notification-empty {
          text-align: center;
          color: #666;
          padding: var(--spacing-xl);
          font-style: italic;
        }

        /* User Modal Styles */
        .user-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10000;
        }

        .user-modal.show {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
        }

        .user-modal-content {
          position: relative;
          background: white;
          border-radius: var(--radius-md);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          min-width: 300px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 10001;
          animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.3rem;
          color: var(--text);
        }

        .modal-close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
          line-height: 1;
        }

        .modal-close-btn:hover {
          background: #f5f5f5;
          color: var(--text);
        }

        .modal-body {
          padding: var(--spacing-md);
        }

        .modal-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          color: var(--text);
          text-decoration: none;
          font-size: 1rem;
          transition: background 0.2s;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: var(--font-body);
          box-sizing: border-box;
          border-radius: var(--radius-md);
          position: relative;
        }

        .modal-item:hover {
          background: #f5f5f5;
        }

        .modal-item span {
          font-size: 1.2rem;
          display: inline-block;
          width: 24px;
          text-align: center;
        }

        .modal-divider {
          height: 1px;
          background: #e0e0e0;
          margin: var(--spacing-sm) 0;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .menu-icon {
            display: block;
          }

          .nav-menu {
            display: none;
          }

          .user-menu-container {
            margin-left: auto;
            margin-right: var(--spacing-md);
          }

          .user-modal-content {
            min-width: 280px;
            max-width: 85%;
          }
        }
      </style>

      <nav class="navbar">
        <div class="nav-container">
          <input type="checkbox" id="menu-toggle">
          <label for="menu-toggle" class="menu-icon">&#9776;</label>

          <a href="index.html" class="nav-logo">
            <slot name="logo">Job Match Up</slot>
          </a>

          <ul class="nav-menu">
            <slot name="links"></slot>
          </ul>
        </div>
      </nav>

      <!-- Mobile Side Panel -->
      <div class="mobile-side-panel">
        <div class="side-panel-content">
          <div class="side-panel-header">
            <h3>Menu</h3>
            <button class="side-panel-close" id="side-panel-close">×</button>
          </div>
        </div>
      </div>
      <div class="side-panel-overlay" id="side-panel-overlay"></div>
    `;
  }
}

customElements.define("custom-navbar", CustomNavbar);
export { CustomNavbar };
