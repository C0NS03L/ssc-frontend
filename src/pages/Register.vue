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
              <v-text-field v-model="username" label="Username" prepend-icon="mdi-account" required></v-text-field>
              <v-text-field v-model="password" label="Password" prepend-icon="mdi-lock" type="password"
                required></v-text-field>
              <v-text-field v-model="confirmPassword" label="Confirm Password" prepend-icon="mdi-lock-outline"
                type="password" required></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="register">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>