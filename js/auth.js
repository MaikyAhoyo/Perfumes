const Auth = {
  DB_KEY: "users_db",
  USER_KEY: "currentUser",

  async init() {
    if (!localStorage.getItem(this.DB_KEY)) {
      try {
        const users = await fetch("data/users.json").then((res) => res.json());
        localStorage.setItem(this.DB_KEY, JSON.stringify(users));
      } catch (e) {
        console.error("Failed to load users", e);
      }
    }
    this.updateUI();
  },

  login(username, password) {
    const users = JSON.parse(localStorage.getItem(this.DB_KEY) || "[]");
    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.updateUI();
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem(this.USER_KEY);
    window.location.href = "login.html";
  },

  getUser() {
    return JSON.parse(localStorage.getItem(this.USER_KEY));
  },

  toggleFavorite(perfumeId) {
    const user = this.getUser();
    if (!user) {
      alert("Please login to add favorites.");
      window.location.href = "login.html";
      return null;
    }

    if (!user.favorites) user.favorites = [];

    const index = user.favorites.indexOf(perfumeId);
    let added = false;

    if (index === -1) {
      user.favorites.push(perfumeId);
      added = true;
    } else {
      user.favorites.splice(index, 1);
      added = false;
    }

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    const users = JSON.parse(localStorage.getItem(this.DB_KEY) || "[]");
    const dbUserIndex = users.findIndex((u) => u.id === user.id);
    if (dbUserIndex !== -1) {
      users[dbUserIndex].favorites = user.favorites;
      localStorage.setItem(this.DB_KEY, JSON.stringify(users));
    }

    return added;
  },

  updateUI() {
    const user = this.getUser();
    const navList = document.querySelector("nav ul");
    const existingAuthItem = document.getElementById("auth-nav-item");
    if (existingAuthItem) existingAuthItem.remove();

    const li = document.createElement("li");
    li.id = "auth-nav-item";

    if (user) {
      li.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-primary hidden md:block">Hi, ${user.name}</span>
            <button onclick="Auth.logout()" class="text-slate-600 hover:text-accent font-medium transition-colors" title="Logout">
                <i class="ph-bold ph-sign-out text-xl"></i>
            </button>
        </div>
      `;
    } else {
      li.innerHTML = `
        <a href="login.html" class="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-secondary hover:text-primary transition-all shadow-lg shadow-primary/20">
            <span>Login</span>
            <i class="ph-bold ph-sign-in"></i>
        </a>
      `;
    }

    if (navList) {
      navList.appendChild(li);
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Auth.init();
});
