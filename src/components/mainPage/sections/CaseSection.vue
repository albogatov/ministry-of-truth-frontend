<template>
  <div>
    <v-form v-model="valid" lazy-validation ref="form">
      <v-card
          color="#F7FAFC"
      >
        <v-card-text class="font-weight-medium" style="font-size: 15pt; ">
          <div style="color: black; text-align: center; margin-bottom: 5%; font-size: 25px; line-height: 1">
            <br>Cases of the Ministry
          </div>
        </v-card-text>

        <v-btn style="margin-left: 25%; margin-bottom: 5%"
               :color=changeColor()
               outlined
               @click="caseEditorMode = true"
        >
          <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
          Create new case
        </v-btn>

        <v-card-text class="font-weight-medium" style="font-size: 15pt; " v-if="this.caseEditorMode">
          <div style="margin-top: 5px; margin-bottom: 20px; color: black; font-weight: lighter">
            Enter data for the new case
          </div>

          <v-text-field
              light
              label="Title"
              v-model="caseTitle"
              name="Title"
              type="text"
              :rules="rules.clearFieldValid"
              :color=changeColor()
              background-color=#EDF2F7
              outlined
              style="border-radius: 10px;"
          />

          <v-text-field
              light
              label="Description"
              v-model="description"
              name="Description"
              type="text"
              :rules="rules.clearFieldValid"
              :color=changeColor()
              background-color=#EDF2F7
              outlined
              style="border-radius: 10px;"
          />

          <v-select v-model="selectedEmployee" id="emplList" :items="employees" label="Choose assignee"
                    :item-text="'name'" :item-value="'id'">
            <option v-for="emp in employees" v-bind:key="emp.id" v-bind:value="emp.name">
              {{ emp.name }}
            </option>
          </v-select>

          <v-select v-model="newCaseState" id="newCaseState" :items="caseStates" label="Choose state">
          </v-select>

          <v-btn style="margin-left: 25%; margin-bottom: 5%"
                 :color=changeColor()
                 outlined
                 :loading="loadingSave"
                 @click="submitCase"
          >
            <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
            Submit the case
          </v-btn>

        </v-card-text>
      </v-card>
    </v-form>
    <v-card>
      <v-card-text>
        Select case:
      </v-card-text>
      <v-card>
        <v-list dense>
          <v-list-item-group

              color="primary"
              v-if="!this.isFetchingCases">
            <v-list v-for="object in AllCases" :key="object.id">
              <v-list-tile-content>
                <v-btn
                    color="primary"
                    dark
                    v-text="'Case-' + object.id + ': ' + object.title"
                    @click="openCase(object)"
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

                  max-width="600px"
              >
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ this.selectedCase.title }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-text-field
                          light
                          label="Description"
                          v-model="selectedCase.description"
                          name="Description"
                          type="text"
                          :rules="rules.clearFieldValid"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />
                      <v-select v-model="selectedCase.assigneeId" id="emplList" :items="employees"
                                label="Choose assignee"
                                :item-text="'name'" :item-value="'id'">
                        <option v-for="emp in employees" v-bind:key="emp.id" v-bind:value="emp.name">
                          {{ emp.name }}
                        </option>
                      </v-select>

                      <v-select v-model="selectedCase.state" id="newCaseState" :items="caseStates" label="Choose state">
                      </v-select>

                      <v-list class="overflow-y-auto" max-height="400" v-for="media in chosenCaseMedia"
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
                          <v-btn
                              color="primary"
                              dark
                              @click="removeLinkWithMedia(media)"
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
                             @click="linkToMedia = true"
                      >
                        <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
                        Link to another media
                      </v-btn>
                      <v-select v-model="mMedia" id="categoryList" :items="AllMedia" label="Choose media"
                                :item-text="'title'" :item-value="'id'" v-if="linkToMedia"
                                :rules="rules.clearFieldValid">
                        <option v-for="mmedia in AllMedia" v-bind:key="mmedia.id" v-bind:value="mmedia.title">
                          {{ mmedia.title }}
                        </option>
                      </v-select>
                      <v-btn style="margin-left: 25%; margin-bottom: 5%"
                             :color=changeColor()
                             outlined
                             :loading="loadingSave"
                             @click="createLinkToMedia(mMedia, selectedCase)" v-if="linkToMedia"
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
                        @click="dialog = false; linkToMedia = false;"
                    >
                      Close
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="updateCase(selectedCase)"
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
  name: "CaseSection",

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
    caseEditorMode: false,
    caseViewMode: false,
    newCaseState: 'Submitted',
    absolute: true,
    valid: true,
    removeButton: true,
    AllCases: [],
    CaseList: '',
    CaseMedia: '',
    caseTitle: '',
    description: '',
    object: '',
    predefinedCase: null,
    selectedCase: [],
    chosenCaseMedia: [],
    isFetchingCases: true,
    idFetchingMedia: true,
    Media: [],
    AllMedia: [],
    linkToMedia: false,
    mMedia: [],
    alertTrue: false,
    alertMessage: '',


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
      this.selectedCase = obj
      this.getListOfMediaForCase()
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

    getListOfMediaProducts() {
      let str = "/api/app/media/all"

      axios.create(this.getHeader()
      ).get(str)
          .then(resp => {
            console.log(resp.data)
            for (let i = 0; i < resp.data.length; i++) {
              this.Media.push('Media-' + resp.data[i].id + ":" + resp.data[i].title)
              this.AllMedia.push(resp.data[i])
              console.log(this.AllMedia[i])
              this.isFetchingMedia = false
            }
          }).catch(err => {
        if (this.doRefresh(err.response.status)) this.getListOfMediaProducts()
      })
    },

    getListOfCases() {
      let str = "/api/app/case/all"

      axios.create(this.getHeader()
      ).get(str)
          .then(resp => {
            console.log(resp.data)
            this.AllCases = []
            for (let i = 0; i < resp.data.length; i++) {
              this.isFetchingCases = true
              this.AllCases.push(resp.data[i])
            }
            this.$store.commit('clearAll')
            this.$store.commit('updateList', this.AllCases)
            this.isFetchingCases = false
          }).catch(err => {
        if (this.doRefresh(err.response.status)) this.getListOfCases()
      })
    },

    getListOfMediaForCase() {
      let str = "/api/app/caseMedia/media"

      console.log("HMMM" + this.selectedCase)
      axios.create(this.getHeader()).post(str, this.selectedCase).then(resp => {
        console.log(resp.data)
        this.chosenCaseMedia = []
        for (let i = 0; i < resp.data.length; i++) {
          this.chosenCaseMedia.push(resp.data[i])
          this.isFetchingMedia = false
        }
      }).catch(err => {
        console.log(err)
      })
    },

    async submitCase() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/case/save"
        let data = {
          assigneeId: this.selectedEmployee,
                title: this.caseTitle,
                description: this.description,
                state: this.newCaseState
        }
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {
              if(resp.data.cause == undefined)
                this.caseEditorMode = false;
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
        this.getListOfCases()
      }
    },


    async updateCase(data) {

      this.loadingSave = true
      let str = "/api/app/case/save"
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

      this.dialog = false
      this.loadingSave = false

    },

    async createLinkToMedia(mmedia, mcase) {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/caseMedia/save"
        let data = {
          mediaId: mmedia,
          caseId: mcase.id
        }
        console.log("CaseMedia:" + mcase)
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {
              console.log(resp.data)
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
        this.getListOfMediaForCase()
      }
    },

    async removeLinkWithMedia(media) {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/caseMedia/delete"
        let data = {
          mediaId: media.id,
          caseId: this.selectedCase.id
        }
        console.log("CaseMedia:" + media.id + this.selectedCase.id)
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

    openLinkedMedia(media) {
      this.$emit('switchSectionToMedia', 'MediaSection', media)
    },

    openCase(object) {
      console.log("CLICK BUTTON WORKED")
      this.caseViewMode = true
      this.selectedCase = object
      this.object = object
      console.log("opening case" + object.id)
      console.log(this.selectedCase)
      this.getListOfMediaForCase()
      this.getListOfMediaProducts()
      this.dialog = true
    },

    updateOverlay() {
      this.getListOfCases()
    },

    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },
  },
  beforeMount() {
    this.getEmployees()
    this.getListOfCases()
  },
  mounted: function () {
    this.$emit("mounted");
  }
}
</script>

<style scoped>

</style>
