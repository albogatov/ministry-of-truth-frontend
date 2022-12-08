<template>
  <v-row>
    <v-col cols="2">
      <LeftNavigationBar @switchSection="switchSection"/>
    </v-col>
    <v-col cols="max">
      <MainComponent @switchSection="switchSection">
      </MainComponent>
    </v-col>
  </v-row>
</template>

<script>
import LeftNavigationBar from "@/components/mainPage/LeftNavigationBar";
import MainComponent from "@/components/mainPage/MainComponent";

export default {
  name: "Main",
  components: {LeftNavigationBar, MainComponent},
  data: () => ({
    currentSection: '',
    rerouteCase: ''
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
