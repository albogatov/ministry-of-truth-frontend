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

        <v-btn style="margin-left: 25%; margin-bottom: 5%"
               :color=changeColor()
               outlined
               @click="departmentEditorMode = true"
        >
          <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
          Register department
        </v-btn>

        <v-card-text class="font-weight-medium" style="font-size: 15pt; "
                     v-if="this.departmentEditorMode && !this.isFetchingDepartments">
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

          <v-select v-model="newDepartmentState" id="newDepartmentState" :items="departmentStates" label="Choose state">
          </v-select>

                    <v-select v-model="selectedDesignation" id="designationList" :items="designations" label="Choose designation"
                              :item-text="'name'" :item-value="'id'">
                      <option v-for="d in designations" v-bind:key="d.id" v-bind:value="d.name">
                        {{ d.name }}
                      </option>
                    </v-select>

                    <v-select v-model="selectedCategory" id="categoryList" :items="categories" label="Choose media category"
                              :item-text="'name'" :item-value="'id'">
                      <option v-for="cat in categories" v-bind:key="cat.id" v-bind:value="cat.name">
                        {{ cat.name }}
                      </option>
                    </v-select>

          <v-date-picker
              v-model="newDepartmentFoundationDate"
              class="mt-4"
          ></v-date-picker>

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

            <div v-if="this.AllDepartments.length > 0">
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
                  max-width="600px" v-if="!this.isFetchingDepartments"
              >
                <v-card v-if="!this.isFetchingDepartments">
                  <v-card-title>
                    <span class="text-h5">{{ this.selectedDepartment.name }}</span>
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

                      <v-text
                          light
                          label="Designation"
                          v-model="selectedDepartment.designation"
                          name="Designation"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      >
                        {{ selectedDepDesignationValue }}
                      </v-text>

                      <!--                      <v-select v-model="selectedDesignation" id="designationList" :items="designations" label="Choose designation"-->
                      <!--                                :item-text="'name'" :item-value="'id'">-->
                      <!--                        <option v-for="d in designations" v-bind:key="d.id" v-bind:value="d.name">-->
                      <!--                          {{ d.name }}-->
                      <!--                        </option>-->
                      <!--                      </v-select>-->

                      <v-text
                          light
                          label="Media Category"
                          v-model="selectedDepartment.mediaCategory"
                          name="Media Category"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      >
                        {{ selectedDepCategoryValue }}
                      </v-text>

                      <!--                      <v-select v-model="selectedCategory" id="categoryList" :items="categories" label="Choose media category"-->
                      <!--                                :item-text="'name'" :item-value="'id'">-->
                      <!--                        <option v-for="cat in categories" v-bind:key="cat.id" v-bind:value="cat.name">-->
                      <!--                          {{ cat.name }}-->
                      <!--                        </option>-->
                      <!--                      </v-select>-->

                      <v-text
                          light
                          label="Date Founded"
                          v-model="selectedDepartment.dateFoundation"
                          name="Date Founded"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />

                      <v-date-picker
                          v-model="this.selectedDepartment.dateTermination"
                          class="mt-4"
                      ></v-date-picker>

                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialog = false;"
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
    caseViewMode: false,
    newDepartmentState: 'Active',
    absolute: true,
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

    Case: [],

    rules: {
      clearFieldValid: [
        v => !!v || 'Поле не может быть пустым'
      ],
      numberValid: [
        v => !!v || 'Поле не может быть пустым',
        v => !!/^\d*$/.test(v) || 'Допустимы только числа',
      ],
    },
  }),
  methods: {

    receiveRouteToObject(obj) {
      // while(this.isFetchingCases)
      console.log(obj)
      this.selectedDepartment = obj
      this.dialog = true
    },

    getCategories() {
      let str = "/api/app/category/all"
      axios.get(str, this.getHeader())
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              // this.object = {
              //   "id": resp.data[i].id,
              //   "name": resp.data[i].name
              // }
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
              // this.object = {
              //   "id": resp.data[i].id,
              //   "name": resp.data[i].name
              // }
              this.designations.push(resp.data[i])
            }

          }).catch(err => {
        console.log(err)
      })
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

    getListOfDepartments() {
      let str = "/api/app/department/all"

      axios.create(this.getHeader()
      ).get(str)
          .then(resp => {
            console.log(resp.data)
            this.AllDepartments = []
            for (let i = 0; i < resp.data.length; i++) {
              //this.Case.push('Case-' + resp.data[i].id + ":" + resp.data[i].title)
              //this.AllDepartments.push(resp.data[i])
              Vue.set(this.AllDepartments, i, resp.data[i])
              console.log(this.AllDepartments[i])
              this.isFetchingDepartments = false
              console.log('DepLength' + this.AllDepartments.length + this.AllDepartments[i].name)
            }
          }).catch(err => {
        console.log(err)
        if (this.doRefresh(err.response.status)) this.getListOfDepartments()
      })
      Vue.$nextTick

    },

    getListOfMediaForPublisher() {
      let str = "/api/app/media/publisher"

      console.log("HMMM" + this.selectedDepartment)
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
          dateFoundation: this.newDepartmentFoundationDate
        }
        console.log(data)
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {
              console.log(resp.data)
              this.departmentEditorMode = false;
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
      console.log(this.selectedDepartment)
      console.log("We sent to save:" + data)
      axios.create(this.getHeader()
      ).post(str, data)
          .then(resp => {
            console.log("Server responded:" + resp.data)
          }).catch(err => {
        if (this.doRefresh(err.response.status)) this.submit()
      })
      await new Promise(resolve => setTimeout(resolve, this.awaitTimer))


      this.dialog = false
      //this.$emit('updateParent', {data2})
      this.loadingSave = false

    },

    openLinkedMedia(media) {
      this.$emit('switchSectionToMedia', 'MediaSection', media)
    },

    openDepartment(object) {
      console.log("CLICK BUTTON WORKED")
      this.caseViewMode = true
      this.selectedDepartment = object
      this.selectedDepCategoryValue = object.mediaCategory.name
      this.selectedDepDesignationValue = object.designation.name
      this.object = object
      console.log("opening case" + object.id)
      this.getListOfMediaForPublisher()
      //this.getListOfMediaProducts()
      this.dialog = true
    },

    updateElements(CaseList) {
      if (CaseList !== this.Case[0]) {
        CaseList = CaseList.split(" ").pop()
        //this.getCaseByID(CaseList)
        this.removeButton = false
      } else if (CaseList === this.Case[0]) {
        this.CaseMedia = ''
        this.removeButton = true
      }
    },

    updateOverlay() {
      // this.Case = ['Добавить новый элемент']
      // this.CaseList = this.Case[0]
      this.getListOfDepartments()
      //this.updateElements(this.CaseList)
    },

    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },
  },
  beforeMount() {
    //this.updateOverlay()
    this.getListOfDepartments()
    this.getCategories()
    this.getDesignations()
  },
  mounted: function () {
    console.log("YEEEEEEAAAA")
    this.$emit("mounted");
  }
}
</script>

<style scoped>

</style>
