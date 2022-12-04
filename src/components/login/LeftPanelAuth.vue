<template>
  <v-card :color=changeColor() height="100%" style="border-radius: 0%">

    <v-card-text class="font-weight-medium" style="font-size: 30pt; ">

      <v-btn plain style="margin-top: 5%; margin-left: 10%; color: white; font-size: 40px" to="/">
        Ministry Of Truth
      </v-btn>
    </v-card-text>
    <v-img src="../../assets/login.jpg"
           class="ml-auto mr-auto"
           width="75%"
           height="85%"
           style="border-radius:10px; margin-bottom: 0%"
    />
  </v-card>
</template>

<script>
export default {
  name: "LeftPanelAuth",

  methods: {
    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },
  },
  beforeMount() {
  }
}
</script>

