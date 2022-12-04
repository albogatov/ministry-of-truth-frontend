<template>
  <v-row >
    <v-col cols="2">
      <LeftNavigationBar @switchSection="switchSection"/>
    </v-col>
    <v-col cols="max">
      <CityComponent>
      </CityComponent>
    </v-col>
  </v-row>
</template>

<script>
import LeftNavigationBar from "@/components/mainPage/LeftNavigationBar";
import CityComponent from "@/components/mainPage/MainComponent";
export default {
  name: "Main",
  components: {LeftNavigationBar, CityComponent},
  data: () => ({
    currentSection: ''
  }),
  methods: {
    switchSection(e) {
      this.currentSection = e;
      console.log(e);
    }
  }
}
</script>

<style>
::-webkit-scrollbar {
  width: 0;
}
</style>
