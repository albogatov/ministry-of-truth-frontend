<template>
  <div>
    <v-form v-model="valid" lazy-validation ref="form">
      <v-card
          color="#F7FAFC"
      >
        <v-card-text class="font-weight-medium" style="font-size: 15pt; ">
          <div style="color: black; text-align: center; margin-bottom: 5%; font-size: 25px; line-height: 1">
            <br>Departments of the Ministry
          </div>
        </v-card-text>

        <v-btn style="margin-left: 25%; "
               :color=changeColor()
               outlined
               :loading="loadingSave"
               @click="checkDepartmentsTarget"
               v-if="accessLevel > 3"
        >
          <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
          Count departments that are falling behind
        </v-btn>

        <v-text-field
            :readonly="true"
            v-if="failedDepartments != false"
            light
            label="There are departments failing:"
            v-model="failedDepartments"
            name="Name"
            :color=changeColor()
            background-color=#EDF2F7
            outlined
            style="border-radius: 10px;"
        />

        <v-text-field></v-text-field>

        <v-btn style="margin-left: 25%; margin-bottom: 5%"
               :color=changeColor()
               outlined
               @click="departmentEditorMode = true"
        >
          <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
          Register department
        </v-btn>

        <v-card-text class="font-weight-medium" style="font-size: 15pt; "
                     v-if="this.departmentEditorMode">
          <div style="margin-top: 5px; margin-bottom: 20px; color: black; font-weight: lighter">
            Enter data for the department
          </div>

          <v-text-field
              light
              label="Name"
              v-model="departmentName"
              name="Name"
              type="text"
              :rules="rules.clearFieldValid"
              :color=changeColor()
              background-color=#EDF2F7
              outlined
              style="border-radius: 10px;"
          />

          <v-select :rules="rules.clearFieldValid" v-model="newDepartmentState" id="newDepartmentState"
                    :items="departmentStates" label="Choose state">
          </v-select>

          <v-select :rules="rules.clearFieldValid" v-model="selectedDesignation" id="designationList"
                    :items="designations" label="Choose designation"
                    :item-text="'name'" :item-value="'id'">
            <option v-for="d in designations" v-bind:key="d.id" v-bind:value="d.name">
              {{ d.name }}
            </option>
          </v-select>

          <v-select :rules="rules.clearFieldValid" v-model="selectedCategory" id="categoryList" :items="categories"
                    label="Choose media category"
                    :item-text="'name'" :item-value="'id'">
            <option v-for="cat in categories" v-bind:key="cat.id" v-bind:value="cat.name">
              {{ cat.name }}
            </option>
          </v-select>
          <v-text value="Pick foundation date">
            Pick foundation date
            <v-date-picker
                v-model="newDepartmentFoundationDate"
                class="mt-4"
            ></v-date-picker>
          </v-text>
          <v-btn style="margin-left: 25%; margin-bottom: 5%"
                 :color=changeColor()
                 outlined
                 :loading="loadingSave"
                 @click="submitDepartment"
          >
            <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
            Submit department
          </v-btn>

        </v-card-text>
      </v-card>
    </v-form>
    <v-card>
      <v-card-text>
        Select department:
      </v-card-text>
      <v-card>
        <v-list dense>
          <v-list-item-group

              color="primary"
          >

            <div v-if="AllDepartments.length > 0">
              <v-list v-for="object in AllDepartments" :key="object.id">
                <v-list-tile-content>
                  <v-btn
                      color="primary"
                      dark
                      v-text="'Department-' + object.id + ': ' + object.name"
                      @click="openDepartment(object)"
                      width="100%"
                      height="5%"
                  >
                    Open Case
                  </v-btn>
                </v-list-tile-content>
              </v-list>
              <v-dialog
                  v-model="dialog"
                  persistent
                  max-width="600px" v-if="selectedDepartment"
              >
                <v-card v-if="selectedDepartment">
                  <v-card-title>
                    <span class="text-h5">{{ selectedDepartment.name }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-text
                          light
                          label="Name"
                          v-model="selectedDepartment.name"
                          name="Name"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />

                      <v-select v-model="selectedDepartment.status" id="newDepartmentState" :items="departmentStates"
                                label="Choose state">
                      </v-select>

                      <v-text-field
                          :readonly="true"
                          light
                          label="Designation"
                          v-model="selectedDepDesignationValue"
                          name="Designation"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />

                      <v-text
                          light
                          label="Media Category"
                          v-model="selectedDepCategoryValue"
                          name="Media Category"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      >
                      </v-text>

                      <v-text-field
                          :readonly="true"
                          light
                          label="Media Category"
                          v-model="selectedDepCategoryValue"
                          name="Media Category"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />

                      <v-text-field
                          :readonly="true"
                          light
                          label="Date Founded"
                          v-model="selectedDepartment.dateFoundation"
                          name="Date Founded"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />

                      <v-text value="Pick foundation date" v-if="selectedDepartment.dateTermination == undefined">
                        Select date of termination (if this date is in the past the department will be terminated)
                        <v-date-picker
                            label="Choose termination date if needed"
                            v-model="selectedDepartment.dateTermination"
                            class="mt-4"
                        ></v-date-picker>
                      </v-text>

                      <v-text-field v-if="selectedDepartment.dateTermination != undefined" :readonly="true"
                                    light
                                    label="Date Termination"
                                    v-model="selectedDepartment.dateTermination"
                                    name="Date Termination"
                                    :color=changeColor()
                                    background-color=#EDF2F7
                                    outlined
                                    style="border-radius: 10px;">
                      </v-text-field>
                      <v-btn
                          v-if="selectedDepartment.dateTermination != undefined && selectedDepartment.status != 'Terminated'"
                          style="margin-left: 25%; margin-bottom: 5%"
                          :color=changeColor()
                          outlined
                          :loading="loadingSave"
                          @click="selectedDepartment.dateTermination = null"
                      >
                        <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
                        Change termination date
                      </v-btn>

                      <v-btn style="margin-left: 25%; margin-bottom: 5%"
                             :color=changeColor()
                             outlined
                             :loading="loadingSave"
                             @click="checkDepartment"
                             v-if="accessLevel > 2"
                      >
                        <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
                        See department stats
                      </v-btn>

                      <v-text-field
                          :readonly="true"
                          light
                          label="This department solved cases:"
                          v-model="departmentClosedCases"
                          name="Name"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      >
                        {{ departmentClosedCases }}
                      </v-text-field>

                      <v-btn style="margin-left: 25%; margin-bottom: 5%"
                             :color=changeColor()
                             outlined
                             :loading="loadingSave"
                             @click="checkDepartmentTarget"
                             v-if="accessLevel > 2"
                      >
                        <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
                        Check Department Target
                      </v-btn>

                      <v-text-field
                          :readonly="true"
                          light
                          label="Did this department reach the target?"
                          v-model="departmentTargetReached"
                          name="Name"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />

                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialog = false; departmentTargetReached = ''; departmentClosedCases = '';"
                    >
                      Close
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="updateDepartment(selectedDepartment)"
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
            {{ this.alertMessage }}
          </v-alert>
        </v-dialog>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import {mdiDelete} from "@mdi/js";
import Vue from 'vue'

export default {
  name: "DepartmentSection",

  data: () => ({
    icons: {
      mdiDelete,
    },
    dialog: false,
    employees: [],
    departmentStates: ['Active', 'Suspended', 'Terminated'],
    selectedEmployee: "",
    loadingRemove: false,
    loadingSave: false,
    departmentEditorMode: false,
    departmentViewMode: false,
    newDepartmentState: 'Active',
    valid: true,
    removeButton: true,
    AllDepartments: [],
    CaseList: '',
    CaseMedia: '',
    departmentName: '',
    numberOfEmployees: '',
    object: '',
    predefinedCase: null,
    selectedDepartment: [],
    chosenPublisherMedia: [],
    isFetchingDepartments: true,
    isFetchingCategories: true,
    isFetchingDesignations: true,
    Media: [],
    AllMedia: [],
    linkToMedia: false,
    mMedia: [],
    registrationCode: '',
    representative: '',
    selectedCategory: "",
    categories: [],
    designations: [],
    selectedDesignation: '',
    newDepartmentFoundationDate: null,
    selectedDepDesignationValue: '',
    selectedDepCategoryValue: '',
    updateKey: 0,
    failedDepartments: false,
    departmentClosedCases: '',
    departmentTargetReached: '',
    accessLevel: 1,
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
      console.log(obj)
      this.selectedDepartment = obj
      this.dialog = true
    },

    getCategories() {
      let str = "/api/app/category/all"
      axios.get(str, this.getHeader())
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              this.categories.push(resp.data[i])
            }

          }).catch(err => {
        console.log(err)
      })
    },

    getDesignations() {
      let str = "/api/app/designation/all"
      axios.get(str, this.getHeader())
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              this.designations.push(resp.data[i])
            }

          }).catch(err => {
        console.log(err)
      })
    },

    getListOfDepartments() {
      let str = "/api/app/department/all"

      axios.create(this.getHeader()
      ).get(str)
          .then(resp => {
            this.AllDepartments = []
            for (let i = 0; i < resp.data.length; i++) {
              Vue.set(this.AllDepartments, i, resp.data[i])
              this.isFetchingDepartments = false
            }
          }).catch(err => {
        console.log(err)
        if (this.doRefresh(err.response.status)) this.getListOfDepartments()
      })

    },

    checkDepartmentsTarget() {
      let str = "/api/app/department/countTargetFailed"

      axios.create(this.getHeader()
      ).get(str)
          .then(resp => {
            console.log(resp.data)
            this.failedDepartments = resp.data;
          }).catch(err => {
        console.log(err)
        if (this.doRefresh(err.response.status)) this.getListOfDepartments()
      })
    },

    checkDepartment() {
      let str = "/api/app/department/getStats"
      let data = {
        id: this.selectedDepartment.id
      }
      axios.create(this.getHeader()
      ).post(str, data)
          .then(resp => {
            console.log(resp.data)
            this.departmentClosedCases = resp.data;
          }).catch(err => {
        console.log(err)
        if (this.doRefresh(err.response.status)) this.getListOfDepartments()
      })
    },

    checkDepartmentTarget() {
      let str = "/api/app/department/checkTarget"
      let data = {
        id: this.selectedDepartment.id
      }
      axios.create(this.getHeader()
      ).post(str, data)
          .then(resp => {
            this.departmentTargetReached = resp.data;
          }).catch(err => {
        console.log(err)
        if (this.doRefresh(err.response.status)) this.getListOfDepartments()
      })
    },

    getListOfMediaForPublisher() {
      let str = "/api/app/media/publisher"
      axios.create(this.getHeader()).post(str, this.selectedDepartment).then(resp => {
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

    async submitDepartment() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/department/save"
        console.log(this.selectedEmployee)
        let data = {
          name: this.departmentName,
          status: this.newDepartmentState,
          dateFoundation: this.newDepartmentFoundationDate,
          mediaCategoryId: this.selectedCategory,
          designationId: this.selectedDesignation
        }
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {
              if (resp.data.cause == undefined)
                this.departmentEditorMode = false;
              else {
                this.alertMessage = resp.data.cause.serverErrorMessage.message
                this.alertTrue = true
                setTimeout(() => {
                  this.alertTrue = false
                  console.log("hide alert after 3 seconds");
                }, 10000)
              }
            }).catch(err => {
          if (this.doRefresh(err.response.status)) this.submit()
        })
        await new Promise(resolve => setTimeout(resolve, this.awaitTimer))
        this.getListOfDepartments()
        this.updateOverlay()

        let data2 = {
          dialog: false
        }
        this.$emit('updateParent', {data2})
        this.loadingSave = false
      }
    },

    async updateDepartment(data) {

      this.loadingSave = true
      let str = "/api/app/department/save"
      axios.create(this.getHeader()
      ).post(str, data)
          .then(resp => {
            if (resp.data.cause == undefined)
              console.log("all good")
            else {
              this.alertMessage = resp.data.cause.serverErrorMessage.message
              this.alertTrue = true
              setTimeout(() => {
                this.alertTrue = false
                console.log("hide alert after 3 seconds");
              }, 10000)
            }
            console.log("Server responded:" + resp.data)
          }).catch(err => {
        if (this.doRefresh(err.response.status)) this.submit()
      })
      await new Promise(resolve => setTimeout(resolve, this.awaitTimer))


      this.dialog = false
      this.loadingSave = false

    },

    openLinkedMedia(media) {
      this.$emit('switchSectionToMedia', 'MediaSection', media)
    },

    openDepartment(object) {
      this.departmentViewMode = true
      this.selectedDepartment = object
      this.selectedDepCategoryValue = object.mediaCategory.name
      this.selectedDepDesignationValue = object.designation.name
      this.object = object
      this.dialog = true
    },

    updateOverlay() {
      this.getListOfDepartments()
    },

    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },
  }
  ,
  beforeMount() {
    //this.updateOverlay()
    this.getListOfDepartments()
    this.getCategories()
    this.getDesignations()
    this.accessLevel = localStorage.accessLevel
  }
  ,
  mounted: function () {
    console.log("YEEEEEEAAAA")
    this.$emit("mounted");
  }
}
</script>

<style scoped>

</style>
