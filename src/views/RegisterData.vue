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
import FinishRegisterForm from "@/components/login/FinishRegisterForm";

export default {
  name: "RegisterData",
  components: {FinishRegisterForm, LeftPanelAuth}
}
</script>

<style>
::-webkit-scrollbar {
  width: 0;
}
</style>
