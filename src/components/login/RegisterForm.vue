<template>
  <v-card class="elevation-0" style="margin-top: 15%; margin-left: 25%">
    <v-row>
      <v-col cols="1  2" md="8">
        <v-card-text class="mt-12" v-if="!this.employeeSet">
          <h1
              class="text-center display-2"
              style="color: black; font-weight: bold; margin-bottom: 40px"
          >Create Employee Profile</h1>

          <v-form
              style="margin-bottom: 20px"
              ref="form"
              lazy-validation>

            <div class="font-center" style="font-size: 14pt; margin-bottom: 10px; text-align: left">
              Name
            </div>

            <v-textarea
                :rules="rules.clearFieldValid"
                label="Enter Name"
                name="Name"
                type="text"
                color="black"
                v-model="name"
                auto-grow
                outlined
                rows="1"
                row-height="15"
                style="border-radius: 10px"
            />

            <div class="font-center" style="font-size: 14pt; margin-bottom: 10px; text-align: left">
              Age
            </div>

            <v-textarea
                :rules="rules.clearFieldValid"
                label="Enter Age"
                name="Age"
                type="number"
                min="18"
                color="black"
                v-model="age"
                auto-grow
                outlined
                rows="1"
                row-height="15"
                style="border-radius: 10px"
            />

            <v-textarea
                :rules="rules.clearFieldValid"
                light
                label="Address"
                v-model="address"
                name="Address"
                :color=changeColor()
                background-color=#EDF2F7
                outlined
                style="border-radius: 10px;"
            />

            <v-checkbox
                v-model="married"
                label="Married"
                :color="changeColor()"
                hide-details
            ></v-checkbox>

            <v-text-field
                :rules="rules.clearFieldValid"
                light
                label="Number of children"
                v-model="numberOfChildren"
                name="Number of children"
                min="0"
                :color=changeColor()
                type="number"
                background-color=#EDF2F7
                outlined
                style="border-radius: 10px;"
            >

            </v-text-field>

          </v-form>

          <v-row style="margin: auto">
            <v-btn x-large style="box-shadow: none !important; border-radius: 10px" :color=changeColor() width="100%"
                   dark
                   :loading="loadingRegister"
                   @click="submit()">
              Continue Registration
            </v-btn>
          </v-row>

          <v-alert v-if="error" style="margin-top: 30px"
                   colored-border
                   type="error" outlined
                   elevation="0"
          >
            User with this name already exists
          </v-alert>

          <v-alert v-if="errorNetwork" style="margin-top: 30px"
                   colored-border
                   type="error" outlined
                   elevation="0"
          >
            The server is currently under attack, go defend it!
          </v-alert>
        </v-card-text>
        <v-card-text class="mt-12" v-if="this.employeeSet">
          <h1
              class="text-center display-2"
              style="color: black; font-weight: bold; margin-bottom: 40px"
          >Create Account</h1>

          <v-form
              style="margin-bottom: 20px"
              ref="form"
              lazy-validation>

            <div class="font-center" style="font-size: 14pt; margin-bottom: 10px; text-align: left">
              Login
            </div>

            <v-textarea
                :rules="rules.clearFieldValid"
                label="Enter Login"
                name="Login"
                type="text"
                color="black"
                v-model="login"
                auto-grow
                outlined
                rows="1"
                row-height="15"
                style="border-radius: 10px"
            />

            <div class="font-center" style="font-size: 14pt; margin-bottom: 10px; text-align: left">
              Password
            </div>

            <v-text-field
                :rules="rules.passwordValid"
                :append-icon="eyeFlag ? 'mdi-eye' : 'mdi-eye-off'"
                :type="eyeFlag ? 'text' : 'password'"
                hint="At least 8 symbols"
                @click:append="eyeFlag = !eyeFlag"
                id="password"
                label="Enter password"
                color="black"
                v-model="password"
                auto-grow
                outlined
                rows="1"
                style="border-radius: 10px"
            />
          </v-form>

          <v-row style="margin: auto">
            <v-btn x-large style="box-shadow: none !important; border-radius: 10px" :color=changeColor() width="100%"
                   dark
                   :loading="loadingRegister"
                   @click="submitRegister()">
              Register and go back to login
            </v-btn>
          </v-row>

          <v-alert v-if="error" style="margin-top: 30px"
                   colored-border
                   type="error" outlined
                   elevation="0"
          >
            User with this name already exists
          </v-alert>

          <v-alert v-if="errorNetwork" style="margin-top: 30px"
                   colored-border
                   type="error" outlined
                   elevation="0"
          >
            The server is currently under attack, go defend it!
          </v-alert>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import axios from "axios";
import router from "../../router";
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'

export default {
  name: "RegisterForm",

  mixins: [validationMixin],
  validations: {
    name: {required},
    age: {required},
  },
  data: () => ({
    eyeFlag: false,
    age: '',
    name: '',
    valid: false,
    loadingRegister: false,
    error: '',
    errorNetwork: '',
    address: '',
    numberOfChildren: '',
    married: false,
    employeeSet: false,
    login: '',
    password: '',


    rules: {
      clearFieldValid: [
        v => !!v || 'Field cannot be empty'
      ],
      passwordValid: [
        v => !!v || 'Field cannot be empty'
      ],
    },
  }),

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let data = {
          name: this.name,
          age: this.age,
          address: this.address,
          married: this.married,
          childrenAmount: this.numberOfChildren
        }
        this.employeeSet = data
      }
    },
    submitRegister() {
      if (this.$refs.form.validate()) {
        this.loadingRegister = true
        let profile = {
          login: this.login,
          password: this.password
        }
        let data = {
          employeeDto: this.employeeSet,
          employeeProfileDto: profile
        }
        axios.create({
          baseURL: this.hostname
        }).post('/api/auth/register', data)
            .then(async resp => {
              console.log(resp)
              await new Promise(resolve => setTimeout(resolve, 500))
              await router.push({path: '/'})
              this.loadingRegister = false
            }).catch(async err => {
          this.loadingRegister = false
          if (err.message === 'Network Error') {
            this.errorNetwork = true
          } else {
            await new Promise(resolve => setTimeout(resolve, 500))
            this.error = true
          }
          console.log(err)
        })
      }
    },

    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },
  }
}
</script>

<style scoped>

</style>
