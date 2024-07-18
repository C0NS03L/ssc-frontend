<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="rounded-lg">
          <v-card-title>
            <span class="headline">Register</span>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="username"
                label="Username"
                prepend-icon="mdi-account"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                prepend-icon="mdi-lock"
                type="password"
                required
                :error-messages="passwordLengthError"
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                prepend-icon="mdi-lock-check"
                type="password"
                required
                :error-messages="passwordMatchError"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="register"
              :loading="loading"
              :disabled="!passwordsMatch"
              >Register</v-btn
            >
          </v-card-actions>
        </v-card>

        <!-- v-alert for registration status -->
        <v-alert v-model="alert" type="success" dismissible>
          {{ alertMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      loading: false,
      alert: false,
      alertMessage: "",
    };
  },
  computed: {
    passwordsMatch() {
      return this.password === this.confirmPassword;
    },
    passwordMatchError() {
      return this.confirmPassword && !this.passwordsMatch
        ? "Passwords do not match"
        : "";
    },
    passwordLengthError() {
      return this.password.length < 8 && this.password.length > 0
        ? "Password must be at least 8 characters"
        : "";
    },
  },
  methods: {
    async register() {
      if (!this.passwordsMatch && !this.passwordLengthError) {
        return;
      }

      this.loading = true;
      this.alert = false; // Reset alert

      try {
        const response = await axios.post(
          "http://localhost:8080/api/auth/register",
          {
            username: this.username,
            password: this.password,
          },
        );

        console.log("Registration successful", response.data);
        this.alertMessage = "Registration successful!";
        this.alert = true;
        this.$router.push("/login");
      } catch (error) {
        console.error(
          "Error during registration:",
          error.response?.data || error.message,
        );
        this.alertMessage =
          "Error during registration: " +
          (error.response?.data?.message || error.message);
        this.alert = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
