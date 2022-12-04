<template>
  <v-container class="grey lighten-5" style="margin-top: 2%">
    <div v-show="false">
      <img src="../../assets/defaultMain.jpg" alt/>
    </div>
    <CaseSection v-if="this.$parent.currentSection === 'CaseSection'"/>
    <v-img :src=getSrc()
           class="ml-auto mr-auto"
           height="850px"
           style="border-radius: 10px" v-if="this.$parent.currentSection === ''"
    >
      <v-btn disabled v-if="!renderComponent" height="100px" plain
             style="margin-top: 22%; color: black; font-size: 40px; font-weight: bold; text-align: center; margin-left: 23%"
      >
        <pre>Server is currently under attack</pre>
      </v-btn>

    </v-img>
  </v-container>
</template>

<script>
import CaseSection from "@/components/mainPage/sections/CaseSection";
// import axios from "axios";

export default {
  name: "MainComponent",
  components: {CaseSection},

  data: () => ({
    KvartalsList: [],
    slotSize: 28,
    renderComponent: false,
    mapPath: '',
    currentSection: ''
  }),

  methods: {
    // getListOfKvartals() {
    //   this.KvartalsList = new Array(28)
    //   let str = "/api/app/quarter/map"
    //   axios.create(this.getHeader()
    //   ).get(str)
    //       .then(resp => {
    //         for (let i = 0; i < resp.data.length; i++) {
    //           if (resp.data[i] != null) {
    //             this.KvartalsList[i] = resp.data[i].name
    //           } else this.KvartalsList[i] = null
    //         }
    //         this.renderComponent = true
    //         this.$store.commit('clearAll')
    //         this.$store.commit('updateKvartalsList', this.KvartalsList)
    //       }).catch(err => {
    //     this.renderComponent = false
    //     if (this.doRefresh(err.response.status)) this.getListOfKvartals()
    //   })
    // },

    updateDialog() {
      this.renderComponent = false
      this.getListOfKvartals()
    },

    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },

    getSrc() {
      console.log("Достаю картинку")
      let mode = this.$store.getters.getPrimaryColor
      console.log(mode)
      switch (mode) {
        case 1:
          return require('../../assets/defaultMain.jpg')
        case 2:
          return require('../../assets/defaultMain.jpg')
        case 3:
          return require('../../assets/defaultMain.jpg')
        case 4:
          return require('../../assets/defaultMain.jpg')
      }
    },
  },
  created() {
    // this.getListOfKvartals()
  },
}
</script>

<style scoped>

</style>
