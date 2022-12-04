<template>
  <div style="height: 100%">
    <v-card
        class="mx-0"
        height="100%"
    >
      <v-navigation-drawer
          class=EDF2F7
          width="100%"
          permanent
      >

        <v-btn height="100px" plain
               style="margin-top: 20%; color: black; font-size: 40px; font-weight: bold; text-align: center; margin-left: 45px"
               @click="updatePage">
          <pre>Ministry<br>Of<br>Truth</pre>
        </v-btn>

        <div style="text-align: center; font-size: 20px; margin-top: 5%;">
          {{ this.login }}
        </div>

        <div style="margin-top: 15%; margin-left: 30px; margin-right: 20px">
          <v-divider></v-divider>
          <v-switch
              v-model="modeSwitch"
              inset
              :label="modeSwitch ? 'Элементы' : 'Функции'"
              :color=changeColor()
              style="margin-left: 14%"
          ></v-switch>


          <v-card width="600px" v-if="modeSwitch === true" elevation="12"
                  outlined
                  >
            <template>

              <div>
                <div style="margin-top: 5%; color: black; font-size: 18px; text-align: center;  margin-bottom: 15px">
                  What do you need to do:
                </div>

                <v-btn @click="setSection('CaseSection')" v-bind="attrs" v-on="on" width="100%"
                       class="navigationButton" outlined>
                  See Cases
                </v-btn>
              </div>

            </template>
          </v-card>
          <v-divider style="margin-top: 5%"></v-divider>
        </div>

        <template v-slot:append>
          <v-slider style="width: 200px; margin-left: 17%"
              :color=changeColor()
              v-model="colorSlider"
              max="4"
              min="1"
              v-on:change="switchColors(colorSlider)"
          ></v-slider>
          <v-divider style="margin-bottom: 20px"></v-divider>
          <v-row style="margin: auto">
            <v-btn dark
                   @click="logOut"
                   :color=changeColor()
                   class="mx-auto"
                   style="border-radius: 10px; box-shadow: none !important; margin-left: 5px; margin-bottom: 20px; width: 80%">
              <v-icon left>
                mdi-arrow-left
              </v-icon>
              Выйти из системы
            </v-btn>
          </v-row>
        </template>
      </v-navigation-drawer>
    </v-card>
  </div>

</template>

<script>

import router from "@/router";

export default {
  name: "LeftNavigationBar",

  components: {
  },
  data: () => ({
    dialog: false,
    openWind: '',
    modeSwitch: Boolean,
    login: '',
    colorSlider: '',
    section: ''
  }),
  methods: {

    setSection(section) {
      this.$emit('switchSection', section)
    },

    updateDialog(data) {
      this.dialog = data.dialog
    },

    logOut() {
      localStorage.token = ''
      localStorage.refreshToken = ''
      localStorage.login = ''
      router.push({path: '/'})
    },

    updatePage() {
      this.$router.go()
    },

    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },

    switchColors(colorSlider) {
      switch (colorSlider) {
        case 1:
          this.$store.commit('setPrimaryColor', 1)
          break;
        case 2:
          this.$store.commit('setPrimaryColor', 2)
          break;
        case 3:
          this.$store.commit('setPrimaryColor', 3)
          break;
        case 4:
          this.$store.commit('setPrimaryColor', 4)
          break;
      }
    }
  },
  beforeMount() {
    this.colorSlider = this.$store.getters.getPrimaryColor
    this.modeSwitch = true
    this.login = localStorage.login
    this.userAccess = localStorage.userAccessLevel
  }
}
</script>

<style scoped>
.navigationButton {
  border-radius: 10px;
  margin-bottom: 15px;
  color: #A0AEC0
}
</style>
