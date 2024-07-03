<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="rounded-lg">
          <v-card-title>
            <span class="headline">Registration</span>
          </v-card-title>
          <v-card-text>
            <v-form>
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
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                prepend-icon="mdi-lock-outline"
                type="password"
                required
                :error-messages="passwordMatchError"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!passwordsMatch" color="primary" @click="register">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
    };
  },
  computed: {
    passwordsMatch() {
      return this.password === this.confirmPassword;
    },
    passwordMatchError() {
      return this.confirmPassword && !this.passwordsMatch ? 'Passwords do not match' : '';
    },
  },
  methods: {
    async register() {
      if (!this.passwordsMatch) {
        return;
      }

      try {
        const response = await fetch('http://localhost:9090/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const text = await response.text();
        if (!response.ok) {
          throw new Error(text);
        }

        console.log('Registration successful', text); //Add redirection to login page
        alert('Registration successful!'); //Change to Swal later
      } catch (error) {
        console.error('Error during registration:', error); //Same as above
        alert('Error during registration: ' + error.message);
      }
    },
  },
};
</script>