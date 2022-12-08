<template>
  <v-row>
    <v-col md="4" >
      <LeftPanelAuth/>
    </v-col>
    <v-col>
      <FinishRegisterForm/>
    </v-col>
  </v-row>
</template>

<script>
import LeftPanelAuth from "../components/login/LeftPanelAuth";

export default {
  name: "RegisterData",
  components: {LeftPanelAuth}
}
</script>

<style>
::-webkit-scrollbar {
  width: 0;
}
</style>
