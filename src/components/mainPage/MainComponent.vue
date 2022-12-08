<template>
  <v-container class="grey lighten-5" style="margin-top: 2%">
    <div v-show="false">
      <img src="../../assets/defaultMain.jpg" alt/>
    </div>
    <CaseSection v-if="this.$parent.currentSection === 'CaseSection'"  @switchSectionToMedia="switchSectionToMedia" ref="caseComponent" @mounted="caseSectionMounted" />
    <MediaSection v-if="this.$parent.currentSection === 'MediaSection'" @switchSectionToPublisher="switchSectionToPublisher" @switchSectionToCase="switchSectionToCase" @mounted="mediaSectionMounted" ref="mediaComponent"/>
    <PublisherSection v-if="this.$parent.currentSection === 'PublisherSection'" @switchSectionToMedia="switchSectionToMedia" @mounted="publisherSectionMounted" ref="publisherComponent"/>
    <DepartmentSection v-if="this.$parent.currentSection === 'DepartmentSection'" @switchSectionToMedia="switchSectionToMedia" @mounted="publisherSectionMounted" ref="publisherComponent"/>
    <EmployeeSection v-if="this.$parent.currentSection === 'EmployeeSection'" ref="employeeComponent"/>
    <GuidelineSection v-if="this.$parent.currentSection === 'GuidelineSection'" ref="guidelineComponent"/>
    <DeviceSection v-if="this.$parent.currentSection === 'DeviceSection'" @switchSectionToCase="switchSectionToCase" ref="deviceComponent"/>

    <v-img :src=getSrc()
           class="ml-auto mr-auto"
           height="850px"
           style="border-radius: 10px" v-if="this.$parent.currentSection === ''"
    >

    </v-img>
  </v-container>
</template>

<script>
import CaseSection from "@/components/mainPage/sections/CaseSection";
import MediaSection from "@/components/mainPage/sections/MediaSection";
import PublisherSection from "@/components/mainPage/sections/PublisherSection";
import DepartmentSection from "@/components/mainPage/sections/DepartmentSection";
import EmployeeSection from "@/components/mainPage/sections/EmployeeSection";
import GuidelineSection from "@/components/mainPage/sections/GuidelineSection";
import DeviceSection from "@/components/mainPage/sections/DeviceSection";

export default {
  name: "MainComponent",
  components: {DepartmentSection, CaseSection, MediaSection, PublisherSection, EmployeeSection, GuidelineSection, DeviceSection},

  data: () => ({
    caseSectionReady: false,
    caseSectionPredefined: null,
    mediaSectionPredefined: null,
    publisherSectionPredefined: null,
    renderComponent: false,
    currentSection: ''
  }),

  methods: {
    caseSectionMounted() {
      if (this.caseSectionPredefined) {
        this.$refs.caseComponent.receiveRouteToObject(this.caseSectionPredefined)
      }
      this.caseSectionPredefined = null
    },
    switchSectionToCase(e, obj) {
      this.caseSectionPredefined = obj
      this.$emit('switchSection', e)
    },

    mediaSectionMounted() {
      if (this.mediaSectionPredefined) {
        this.$refs.mediaComponent.receiveRouteToObject(this.mediaSectionPredefined)
      }
      this.mediaSectionPredefined = null
    },
    switchSectionToMedia(e, obj) {
      this.mediaSectionPredefined = obj
      this.$emit('switchSection', e)
    },

    publisherSectionMounted() {
      console.log("publisher is mounted")
      if (this.publisherSectionPredefined) {
        this.$refs.publisherComponent.receiveRouteToObject(this.publisherSectionPredefined)
      }
      this.publisherSectionPredefined = null
    },
    switchSectionToPublisher(e, obj) {
      this.publisherSectionPredefined = obj
      this.$emit('switchSection', e)
    },

    updateDialog() {
      this.renderComponent = false
    },

    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },

    getSrc() {
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
  },
}
</script>

<style scoped>

</style>
