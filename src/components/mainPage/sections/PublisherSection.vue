<template>
  <div>
    <v-form v-model="valid" lazy-validation ref="form">
      <v-card
          color="#F7FAFC"
      >
        <v-card-text class="font-weight-medium" style="font-size: 15pt; ">
          <div style="color: black; text-align: center; margin-bottom: 5%; font-size: 25px; line-height: 1">
            <br>Registered Publishers
          </div>
        </v-card-text>

        <v-btn style="margin-left: 25%; margin-bottom: 5%"
               :color=changeColor()
               outlined
               @click="publisherEditorMode = true"
        >
          <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
          Register publisher
        </v-btn>

        <v-card-text class="font-weight-medium" style="font-size: 15pt; " v-if="this.publisherEditorMode">
          <div style="margin-top: 5px; margin-bottom: 20px; color: black; font-weight: lighter">
            Enter data for the publisher
          </div>

          <v-text-field
              light
              label="Name"
              v-model="publisherName"
              name="Name"
              type="text"
              :rules="rules.clearFieldValid"
              :color=changeColor()
              background-color=#EDF2F7
              outlined
              style="border-radius: 10px;"
          />

          <v-text-field
              light
              label="Number of employees"
              v-model="numberOfEmployees"
              name="NumberOfEmployees"
              type="number"
              min="1"
              :rules="rules.clearFieldValid"
              :color=changeColor()
              background-color=#EDF2F7
              outlined
              style="border-radius: 10px;"
          />

          <v-text-field
              light
              label="Registration Code"
              v-model="registrationCode"
              name="registrationCode"
              type="text"
              :rules="rules.clearFieldValid"
              :color=changeColor()
              background-color=#EDF2F7
              outlined
              style="border-radius: 10px;"
          />

          <v-text-field
              light
              label="Representative"
              v-model="representative"
              name="Representative"
              type="text"
              :rules="rules.clearFieldValid"
              :color=changeColor()
              background-color=#EDF2F7
              outlined
              style="border-radius: 10px;"
          />

          <v-date-picker
              label="Foundation date"
              v-model="foundationDate"
              class="mt-4"
          ></v-date-picker>

          <v-btn style="margin-left: 25%; margin-bottom: 5%"
                 :color=changeColor()
                 outlined
                 :loading="loadingSave"
                 @click="submitPublisher"
          >
            <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
            Submit publisher
          </v-btn>

        </v-card-text>
      </v-card>
    </v-form>
    <v-card>
      <v-card-text>
        Select publisher:
      </v-card-text>
      <v-card>
        <v-list dense>
          <v-list-item-group

              color="primary"
          >

            <v-list v-for="object in AllPublishers" :key="object.id">
              <v-list-tile-content>
                <v-btn
                    color="primary"
                    dark
                    v-text="'Publisher-' + object.id + ': ' + object.name"
                    @click="openPublisher(object)"
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
                  max-width="600px" v-if="!this.isFetchingPublishers"
              >

                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ this.selectedPublisher.title }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-text-field
                          light
                          label="Name"
                          v-model="selectedPublisher.name"
                          name="Name"
                          type="text"
                          :rules="rules.clearFieldValid"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />

                      <v-text-field
                          light
                          label="Number of employees"
                          v-model="selectedPublisher.employeesCount"
                          name="NumberOfEmployees"
                          type="number"
                          :rules="rules.clearFieldValid"
                          :color=changeColor()
                          background-color=#EDF2F7
                          min="1"
                          outlined
                          style="border-radius: 10px;"
                      />

                      <v-text-field
                          light
                          label="Registration Code"
                          v-model="selectedPublisher.registrationCode"
                          name="registrationCode"
                          type="text"
                          :rules="rules.clearFieldValid"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />

                      <v-text-field
                          light
                          label="Representative"
                          v-model="selectedPublisher.representative"
                          name="Representative"
                          type="text"
                          :rules="rules.clearFieldValid"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />

                      <v-list class="overflow-y-auto" max-height="400" v-for="media in chosenPublisherMedia"
                              :key="media.id">
                        <v-list-tile-content>
                          <v-btn
                              color="primary"
                              dark
                              v-text="'Media-' + media.id + ': ' + media.title"
                              @click="openLinkedMedia(media)"
                              width="80%"
                              height="5%"
                          >
                            Open Case
                          </v-btn>
                        </v-list-tile-content>
                      </v-list>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialog = false; linkToMedia = false;"
                    >
                      Close
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="updatePublisher(selectedPublisher)"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-list-item-group>
        </v-list>

      </v-card>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import {mdiDelete} from "@mdi/js";

export default {
  name: "PublisherSection",

  data: () => ({
    icons: {
      mdiDelete,
    },
    dialog: false,
    employees: [],
    caseStates: ['Incomplete', 'Submitted', 'Open', 'In Progress', 'Invalid', 'Closed', 'Reopened', 'Frozen'],
    selectedEmployee: "",
    loadingRemove: false,
    loadingSave: false,
    publisherEditorMode: false,
    caseViewMode: false,
    newCaseState: 'Submitted',
    absolute: true,
    valid: true,
    removeButton: true,
    AllPublishers: [],
    CaseList: '',
    CaseMedia: '',
    publisherName: '',
    numberOfEmployees: '',
    object: '',
    predefinedCase: null,
    selectedPublisher: [],
    chosenPublisherMedia: [],
    isFetchingPublishers: true,
    idFetchingMedia: true,
    Media: [],
    AllMedia: [],
    linkToMedia: false,
    mMedia: [],
    registrationCode: '',
    representative: '',
    foundationDate: '',


    Case: [],

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
       console.log(obj)
      this.selectedPublisher = obj
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

    getListOfPublishers() {
      let str = "/api/app/publisher/all"

      axios.create(this.getHeader()
      ).get(str)
          .then(resp => {
            console.log(resp.data)
            this.AllPublishers = []
            for (let i = 0; i < resp.data.length; i++) {
              this.AllPublishers.push(resp.data[i])
              console.log(this.AllPublishers[i])
              this.isFetchingPublishers = false
            }
          }).catch(err => {
        console.log(err)
        if (this.doRefresh(err.response.status)) this.getListOfPublishers()
      })
    },

    getListOfMediaForPublisher() {
      let str = "/api/app/media/publisher"

      console.log("HMMM" + this.selectedPublisher)
      axios.create(this.getHeader()).post(str, this.selectedPublisher).then(resp => {
        console.log(resp.data)
        this.chosenPublisherMedia = []
        for (let i = 0; i < resp.data.length; i++) {
          this.chosenPublisherMedia.push(resp.data[i])
          this.isFetchingMedia = false
        }
      }).catch(err => {
        console.log(err)
      })
    },

    async submitPublisher() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/publisher/save"
        console.log(this.selectedEmployee)
        let data = {
          name: this.publisherName,
          foundationDate: this.foundationDate,
          employeesCount: this.numberOfEmployees,
          registrationCode: this.registrationCode,
          representative: this.representative
        }
        console.log(data)
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {
              console.log(resp.data)
              this.publisherEditorMode = false;
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
      }
    },

    async updatePublisher(data) {

      this.loadingSave = true
      let str = "/api/app/publisher/save"
      console.log(this.selectedPublisher)
      console.log("We sent to save:" + data)
      axios.create(this.getHeader()
      ).post(str, data)
          .then(resp => {
            console.log("Server responded:" + resp.data)
          }).catch(err => {
        if (this.doRefresh(err.response.status)) this.submit()
      })
      await new Promise(resolve => setTimeout(resolve, this.awaitTimer))
      this.updateOverlay()

      this.dialog = false
      this.loadingSave = false

    },

    openLinkedMedia(media) {
      this.$emit('switchSectionToMedia', 'MediaSection', media)
    },

    openPublisher(object) {
      console.log("CLICK BUTTON WORKED")
      this.caseViewMode = true
      this.selectedPublisher = object
      this.object = object
      console.log("opening case" + object.id)
      this.getListOfMediaForPublisher()
      this.dialog = true
    },


    updateOverlay() {
      this.getListOfPublishers()
    },

    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },
  },
  beforeMount() {
    this.getListOfPublishers()
  },
  mounted: function() {
    this.$emit("mounted");
  }
}
</script>

<style scoped>

</style>
