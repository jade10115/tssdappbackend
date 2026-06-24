<template>
  <div class="login-page">
    <div class="overlay"></div>

    <div class="card login-card">
      <div class="header">
        <div class="logos">
          <img :src="doleLogo" alt="DOLE Logo" class="logo" />
          <img :src="bagongphlogo" alt="Bagong PH Logo" class="logo" />
        </div>
        <h5 class="fw">Department of Labor and Employment</h5>
      </div>

      <form class="form" @submit.prevent="handleLogin">
        <div class="field">
          <label>Email</label>
          <input v-model.trim="email" type="email" placeholder="Enter your email" required />
        </div>

        <div class="field">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Enter your password" required />
        </div>

        <button class="btn" type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <div class="footer">© 2026 DOLE Region VIII</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import doleLogo from "../../assets/logo/dole.png";
import bagongphlogo from "../../assets/logo/bagongphlogo.png";

// ✅ Point to your LIVE Render backend, not localhost
axios.defaults.baseURL = "https://tssdapp-1.onrender.com";

// ✅ Must be false to match your backend CORS settings for Bearer tokens
axios.defaults.withCredentials = false;

// restore token
const token = localStorage.getItem("auth_token");
if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      doleLogo,
      bagongphlogo,
    };
  },

  methods: {
    async handleLogin() {
      this.loading = true;

      try {
        const res = await axios.post("/api/login", {
          email: this.email,
          password: this.password,
        });

        if (res.data?.success && res.data?.token && res.data?.user) {
          const user = res.data.user;

          // ✅ REQUIRED for calendar created_by
          localStorage.setItem("user_id", String(user.id || ""));

          // ✅ keep your existing keys
          localStorage.setItem("auth_token", res.data.token);
          localStorage.setItem("userlevel_id", String(user.userlevel_id || 0));
          localStorage.setItem("user_name", String(user.username || ""));
          localStorage.setItem("profile_image", String(user.profile_image || ""));
          localStorage.setItem("division", String(user.division || ""));

          axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

          Swal.fire({
            title: `Welcome, ${user.username || "User"}!`,
            text: "Successfully logged in",
            icon: "success",
            position: "top-end",
            toast: true,
            timer: 1600,
            showConfirmButton: false,
          });

          const ul = Number(user.userlevel_id || 0);

          setTimeout(() => {
            if (ul === 1) return this.$router.push("/dashboard");
            if (ul === 2) return this.$router.push("/supply/DashboardSupply");
            if (ul === 3) return this.$router.push("/fo/dashboard");
            return this.$router.push("/dashboard");
          }, 700);

          return;
        }

        Swal.fire("Invalid Login", res.data?.message || "Invalid credentials.", "error");
      } catch (error) {
        Swal.fire("Login Error", error.response?.data?.message || "Server error.", "error");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 18px;
  background: url("../../assets/logo/doleoutside.jpg") no-repeat center center / cover;
  position: relative;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.login-card {
  position: relative;
  z-index: 1;
  width: min(420px, 100%);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.25);
}

.header {
  text-align: center;
  margin-bottom: 14px;
}

.logos {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.logo {
  width: 72px;
  height: auto;
  max-width: 40vw;
}

.fw {
  font-weight: 900;
  margin: 0;
  font-size: 14px;
  color: #0f172a;
}

.form {
  display: grid;
  gap: 12px;
}

.field label {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: #334155;
  margin-bottom: 6px;
}

.field input {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  outline: none;
  font-size: 14px;
  background: #fff;
}

.field input:focus {
  border-color: #1e3a8a;
  box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.12);
}

.btn {
  width: 100%;
  padding: 11px 12px;
  border: none;
  border-radius: 12px;
  background: #1e3a8a;
  color: #fff;
  font-weight: 900;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.footer {
  margin-top: 14px;
  text-align: center;
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 420px) {
  .login-card { padding: 14px; }
  .logo { width: 60px; }
}
</style>