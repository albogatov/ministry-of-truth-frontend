<template>
  <div>
    <v-form v-model="valid" lazy-validation ref="form">
      <v-card
          color="#F7FAFC"
      >
        <v-card-text class="font-weight-medium" style="font-size: 15pt; ">
          <div style="color: black; text-align: center; margin-bottom: 5%; font-size: 25px; line-height: 1">
            <br>Devices of the Ministry
          </div>
        </v-card-text>

        <v-btn style="margin-left: 25%; margin-bottom: 5%"
               :color=changeColor()
               outlined
               @click="deviceEditorMode = true"
        >
          <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
          Register new device
        </v-btn>

        <v-card-text class="font-weight-medium" style="font-size: 15pt; " v-if="this.deviceEditorMode">
          <div style="margin-top: 5px; margin-bottom: 20px; color: black; font-weight: lighter">
            Enter data for the device
          </div>

          <v-text-field
              light
              label="Model"
              v-model="deviceModel"
              name="Title"
              type="text"
              :rules="rules.clearFieldValid"
              :color=changeColor()
              background-color=#EDF2F7
              outlined
              style="border-radius: 10px;"
          />

          <v-select :rules="rules.clearFieldValid" v-model="newDeviceType" id="newMediaState" :items="deviceTypes" label="Choose type">
          </v-select>

          <v-date-picker
              :rules="rules.clearFieldValid"
              v-model="newDateMade"
              class="mt-4"
          ></v-date-picker>

          <v-select :rules="rules.clearFieldValid" v-model="selectedEmployee" id="employeeList" :items="employees" label="Choose maintainer"
                    :item-text="'name'" :item-value="'id'">
            <option v-for="cat in employees" v-bind:key="cat.id" v-bind:value="cat.name">
              {{ cat.name }}
            </option>
          </v-select>

          <v-btn style="margin-left: 25%; margin-bottom: 5%"
                 :color=changeColor()
                 outlined
                 :loading="loadingSave"
                 @click="submitDevice"
          >
            <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
            Submit the device
          </v-btn>

        </v-card-text>
      </v-card>
    </v-form>
    <v-card>
      <v-card-text>
        Select device:
      </v-card-text>
      <v-card>
        <v-list dense>
          <v-list-item-group

              color="primary"
          >
            <v-list v-for="object in AllDevices" :key="object.id">
              <v-list-tile-content>
                <v-btn
                    color="primary"
                    dark
                    v-text="'Device-' + object.id + ': ' + object.model"
                    @click="openDevice(object)"
                    width="100%"
                    height="5%"
                >
                  Open Case
                </v-btn>
              </v-list-tile-content>
            </v-list>

            <div>
              <v-dialog
                  v-model="dialog"
                  persistent
                  max-width="600px" v-if="!this.isFetchingDevices"
              >

                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ selectedDevice.model }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-select :readonly=true v-model="selectedDevice.type" id="deviceType" :items="deviceTypes" label="Type">
                      </v-select>

                      <v-text-field
                          :readonly="true"
                          light
                          label="Date Made"
                          v-model="selectedDevice.dateMade"
                          name="dateMade"
                          type="text"
                          :rules="rules.clearFieldValid"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />


                      <v-select v-model="selectedDevice.maintainerId" id="employeeList" :items="employees" label="Maintainer"
                                :item-text="'name'" :item-value="'id'">
                        <option v-for="cat in employees" v-bind:key="cat.id" v-bind:value="cat.name">
                          {{ cat.name }}
                        </option>
                      </v-select>

                      <v-date-picker
                          v-model="selectedDevice.dateTerminated"
                          class="mt-4"
                      ></v-date-picker>


                      <v-list class="overflow-y-auto" max-height="400" v-for="cases in chosenDeviceCase"
                              :key="cases.id">
                        <v-list-tile-content>
                          <v-btn
                              color="primary"
                              dark
                              v-text="'Case-' + cases.id + ': ' + cases.title"
                              @click="openLinkedCase(cases)"
                              width="80%"
                              height="5%"
                          >
                            Open Case
                          </v-btn>
                          <v-btn
                              color="primary"
                              dark
                              @click="removeLinkWithCase(cases)"
                              width="20%"
                              height="5%"
                          >
                            Remove Link
                          </v-btn>
                        </v-list-tile-content>
                      </v-list>
                      <v-btn style="margin-left: 25%; margin-bottom: 5%"
                             :color=changeColor()
                             outlined
                             :loading="loadingSave"
                             @click="linkToCase = true"
                      >
                        <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
                        Link to another case
                      </v-btn>
                      <v-select v-model="mcase" id="categoryList" :items="AllCases" label="Choose case"
                                :item-text="'title'" :item-value="'id'" v-if="linkToCase"
                                :rules="rules.clearFieldValid">
                        <option v-for="mcase in AllCases" v-bind:key="mcase.id" v-bind:value="mcase.title">
                          {{ mcase.title }}
                        </option>
                      </v-select>
                      <v-btn style="margin-left: 25%; margin-bottom: 5%"
                             :color=changeColor()
                             outlined
                             :loading="loadingSave"
                             @click="createLinkToCase(mcase, selectedDevice)" v-if="linkToCase"
                      >
                        <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
                        Create the link
                      </v-btn>

                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialog = false; linkToCase = false;"
                    >
                      Close
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="updateDevice(selectedDevice)"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-list-item-group>
        </v-list>
        <v-dialog v-model="alertTrue">
          <v-alert>
            {{this.alertMessage}}
          </v-alert>
        </v-dialog>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import {mdiDelete} from "@mdi/js";

export default {
  name: "DeviceSection",

  data: () => ({
    icons: {
      mdiDelete,
    },
    dialog: false,
    employees: [],
    deviceTypes: ['VIDEO_CAPTURE', 'AUDIO_CAPTURE', 'TEXT_CAPTURE', 'OTHER'],
    selectedEmployee: "",
    loadingRemove: false,
    loadingSave: false,
    deviceEditorMode: false,
    deviceViewMode: false,
    newDeviceType: 'Discovered',
    valid: true,
    removeButton: true,
    AllDevices: [],
    deviceModel: '',
    object: '',
    selectedDevice: [],
    chosenDeviceCase: [],
    isFetchingDevices: true,
    isFetchingCase: true,
    AllCases: [],
    linkToCase: false,
    mcase: [],
    newDateMade: '',
    alertTrue: false,
    alertMessage: '',

    Media: [],

    rules: {
      clearFieldValid: [
        v => !!v || 'This field cannot be empty'
      ],
      numberValid: [
        v => !!v || 'This field cannot be empty',
        v => !!/^\d*$/.test(v) || 'Numeric values only',
      ],
    },
  }),
  methods: {

    receiveRouteToObject(obj) {
      // while(this.isFetchingCases)
      //   console.log('loading')
      this.selectedDevice = obj
      this.dialog = true
    },

    getEmployees() {
      let str = "/api/app/employee/all"
      axios.get(str, this.getHeader())
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              this.object = {
                "id": resp.data[i].id,
                "name": resp.data[i].name
              }
              this.employees.push(resp.data[i])
            }

          }).catch(err => {
        console.log(err)
      })
    },

    getListOfDevices() {
      let str = "/api/app/device/all"

      axios.create(this.getHeader()
      ).get(str)
          .then(resp => {
            console.log(resp.data)
            this.AllDevices = []
            for (let i = 0; i < resp.data.length; i++) {
              //this.Media.push('Media-' + resp.data[i].id + ":" + resp.data[i].title)
              this.AllDevices.push(resp.data[i])
              console.log(this.AllDevices[i])
              this.isFetchingDevices = false
            }
          }).catch(err => {
        if (this.doRefresh(err.response.status)) this.getListOfDevices()
      })
    },

    getListOfCases() {
      let str = "/api/app/case/all"

      axios.create(this.getHeader()
      ).get(str)
          .then(resp => {
            console.log(resp.data)
            for (let i = 0; i < resp.data.length; i++) {
              //this.Case.push('Case-' + resp.data[i].id + ":" + resp.data[i].title)
              this.AllCases.push(resp.data[i])
              console.log(this.AllCases[i])
              this.isFetchingCases = false
            }
          }).catch(err => {
        console.log(err)
        if (this.doRefresh(err.response.status)) this.getListOfCases()
      })
    },

    getListOfCasesForDevice() {
      let str = "/api/app/caseDevice/case"

      console.log("HMMM" + this.selectedDevice)
      axios.create(this.getHeader()).post(str, this.selectedDevice).then(resp => {
        console.log("All cases for this media:" + resp.data)
        this.chosenDeviceCase = []
        for (let i = 0; i < resp.data.length; i++) {
          this.chosenDeviceCase.push(resp.data[i])
          this.isFetchingCase = false
        }
      }).catch(err => {
        console.log(err)
      })
    },

    async submitDevice() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/device/save"
        console.log(this.selectedEmployee)
        let data = {
          maintainerId: this.selectedEmployee,
          model: this.deviceModel,
          type: this.newDeviceType,
          dateMade: this.newDateMade
        }
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {

              if(resp.data.cause == undefined)
                this.deviceEditorMode = false;
              else {
                this.alertMessage = resp.data.cause.serverErrorMessage.message
                this.alertTrue = true
                setTimeout(() => {this.alertTrue = false
                  console.log("hide alert after 3 seconds");}, 10000)
              }
            }).catch(err => {
          if (this.doRefresh(err.response.status)) this.submit()
        })
        await new Promise(resolve => setTimeout(resolve, this.awaitTimer))
        this.updateOverlay()

        let data2 = {
          dialog: false
        }
        this.$emit('updateParent', {data2})
        this.loadingSave = false
        this.getListOfDevices()
        this.getListOfCasesForDevice()
      }
    },

    async createLinkToCase(mcase, device) {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/caseDevice/save"
        let data = {
          deviceId: device.id,
          caseId: mcase
        }
        console.log("CaseMedia:" + mcase)
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {
              if(resp.data.cause == undefined)
                console.log("all good")
              else {
                this.alertMessage = resp.data.cause.serverErrorMessage.message
                this.alertTrue = true
                setTimeout(() => {this.alertTrue = false
                  console.log("hide alert after 3 seconds");}, 10000)
              }
            }).catch(err => {
          if (this.doRefresh(err.response.status)) this.submit()
        })
        await new Promise(resolve => setTimeout(resolve, this.awaitTimer))
        this.updateOverlay()

        let data2 = {
          dialog: false
        }
        this.$emit('updateParent', {data2})
        this.loadingSave = false
        this.getListOfCasesForDevice()
      }
    },

    async removeLinkWithCase(mcase) {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/caseDevice/delete"
        let data = {
          mediaId: this.selectedDevice.id,
          caseId: mcase.id
        }
        console.log("CaseMedia:" + mcase.id + this.selectedDevice.id)
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {
              console.log(resp.data)
            }).catch(err => {
          if (this.doRefresh(err.response.status)) this.submit()
        })
        await new Promise(resolve => setTimeout(resolve, this.awaitTimer))
        this.updateOverlay()

        let data2 = {
          dialog: false
        }
        this.$emit('updateParent', {data2})
        this.loadingSave = false
        this.getListOfCasesForDevice()
      }
    },

    openLinkedCase(mcase) {
      this.$emit('switchSectionToCase', 'CaseSection', mcase)
    },

    async updateDevice(data) {

      this.loadingSave = true
      let str = "/api/app/device/save"
      console.log(this.selectedEmployee)
      console.log("We sent to save:" + data)
      axios.create(this.getHeader()
      ).post(str, data)
          .then(resp => {
            console.log("Server responded:" + resp.data)
            if(resp.data.cause == undefined)
              console.log("all good")
            else {
              this.alertMessage = resp.data.cause.serverErrorMessage.message
              this.alertTrue = true
              setTimeout(() => {this.alertTrue = false
                console.log("hide alert after 3 seconds");}, 10000)
            }
          }).catch(err => {
        if (this.doRefresh(err.response.status)) this.submit()
      })
      await new Promise(resolve => setTimeout(resolve, this.awaitTimer))
      this.updateOverlay()

      this.dialog = false
      this.loadingSave = false

    },

    openDevice(object) {
      this.deviceViewMode = true
      this.selectedDevice = object
      this.getListOfCasesForDevice()
      this.dialog = true
    },

    updateOverlay() {
      this.getListOfDevices()
    },

    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },
  },
  beforeMount() {
    this.getEmployees()
    this.getListOfDevices()
    this.getListOfCases()
  },
  mounted: function () {
    this.$emit("mounted")
  }
}
</script>

<style scoped>

</style>
