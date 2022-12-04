<template>
  <v-card class="elevation-0" style="margin-top: 15%; margin-left: 25%">
    <v-row>
      <v-col cols="1  2" md="8">
        <v-card-text class="mt-12">
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
              Пароль
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
            <v-btn x-large style="box-shadow: none !important; border-radius: 10px" :color=changeColor() width="100%" dark
                   :loading="loadingRegister"
                   @click="submit()">
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
  name: "FinishRegisterForm",

  mixins: [validationMixin],
  validations: {
    password: {required},
    login: {required},
  },
  data: () => ({
    eyeFlag: false,
    password: '',
    login: '',
    valid: false,
    loadingRegister: false,
    error: '',
    errorNetwork: '',

    rules: {
      clearFieldValid: [
        v => !!v || 'Field cannot be empty'
      ],
      passwordValid: [
        v => !!v || 'Field cannot be empty'
        //v => !!/^\d{4,}$/.test(v) || 'Минимум 4 символа',
      ],
    },
  }),

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loadingRegister = true
        let data = {
          login: this.login,
          password: this.password
        }
        console.log(data.password, data.username)
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
