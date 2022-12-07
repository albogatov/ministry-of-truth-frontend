<template>
  <div>
    <v-form v-model="valid" lazy-validation ref="form">
      <v-card
          color="#F7FAFC"
      >
        <v-card-text class="font-weight-medium" style="font-size: 15pt; ">
          <div style="color: black; text-align: center; margin-bottom: 5%; font-size: 25px; line-height: 1">
            <br>Employees of the Ministry
          </div>
        </v-card-text>
        <v-card>
          <v-card-text>
            Select employee:
          </v-card-text>
          <v-card>
            <v-list dense>
              <v-list-item-group

                  color="primary"
              >
                <v-list v-for="object in employees" :key="object.id">
                  <v-list-tile-content>
                    <v-btn
                        color="primary"
                        dark
                        v-text="'Employee-' + object.id + ': ' + object.name"
                        @click="openEmployee(object)"
                        width="100%"
                        height="5%"
                    >
                      Open Case
                    </v-btn>
                  </v-list-tile-content>
                </v-list>

                <div v-if="this.employees.length > 0">
                  <v-dialog
                      v-model="dialog"
                      persistent
                      max-width="600px" v-if="!this.isFetchingEmployees"
                  >
                    <v-card v-if="!this.isFetchingDepartments">
                      <v-card-title>
                        <span class="text-h5">{{ this.selectedEmployee.name }}</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
<!--                          <v-text-field-->
<!--                              light-->
<!--                              label="Name"-->
<!--                              v-model="selectedEmployee.name"-->
<!--                              name="Name"-->
<!--                              :color=changeColor()-->
<!--                              background-color=#EDF2F7-->
<!--                              outlined-->
<!--                              style="border-radius: 10px;"-->
<!--                          ></v-text-field>-->

                          <v-text-field
                              :readonly="true"
                              light
                              label="Age"
                              v-model="selectedEmployee.age"
                              name="Age"
                              :color=changeColor()
                              background-color=#EDF2F7
                              outlined
                              style="border-radius: 10px;"
                          />

                          <v-text-field
                              :readonly="true"
                              light
                              label="Address"
                              v-model="selectedEmployee.address"
                              name="Address"
                              :color=changeColor()
                              background-color=#EDF2F7
                              outlined
                              style="border-radius: 10px;"
                          />

                          <v-checkbox
                              v-model="selectedEmployee.married"
                              label="Married"
                              :color="changeColor()"
                              hide-details
                          ></v-checkbox>

                          <v-text-field
                              light
                              label="Number of children"
                              v-model="selectedEmployee.childrenAmount"
                              name="Number of children"
                              :color=changeColor()
                              type="number"
                              background-color=#EDF2F7
                              outlined
                              style="border-radius: 10px;"
                          >

                          </v-text-field>

                          <v-text-field
                              light
                              label="Notes"
                              v-model="selectedEmployee.notes"
                              name="Notes"
                              :color=changeColor()
                              background-color=#EDF2F7
                              outlined
                              style="border-radius: 10px;"
                          >
                          </v-text-field>

                          <v-select v-model="selectedEmployee.departmentId" id="departmentList" :items="AllDepartments"
                                    label="Choose department"
                                    :item-text="'name'" :item-value="'id'">
                            <option v-for="dep in AllDepartments" v-bind:key="dep.id" v-bind:value="dep.name">
                              {{ dep.name }}
                            </option>
                          </v-select>

                          <v-select v-model="selectedEmployee.positionId" id="positionList" :items="positions"
                                    label="Choose position"
                                    :item-text="'name'" :item-value="'id'">
                            <option v-for="p in positions" v-bind:key="p.id" v-bind:value="p.title">
                              {{ p.name }}
                            </option>
                          </v-select>

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
                            @click="updateEmployee(selectedEmployee)"
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
      </v-card>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
import {mdiDelete} from "@mdi/js";

export default {
  name: "EmployeeSection",

  data: () => ({
    icons: {
      mdiDelete,
    },
    dialog: false,
    employees: [],
    departmentStates: ['Active', 'Suspended', 'Terminated'],
    selectedEmployee: '',
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
    isFetchingEmployees: true,
    isFetchingDesignations: true,
    Media: [],
    AllMedia: [],
    linkToMedia: false,
    mMedia: [],
    registrationCode: '',
    representative: '',
    selectedCategory: "",
    positions: [],
    designations: [],
    selectedDesignation: '',
    newDepartmentFoundationDate: new Date().toLocaleString(),
    selectedName: '',
    selectedAge: '',
    selectedMarried: false,
    selectedChildren: 0,
    selectedAddress: '',
    selectedNotes: '',

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

    // receiveRouteToObject(obj) {
    //   // while(this.isFetchingCases)
    //   console.log(obj)
    //   this.selectedE = obj
    //   this.dialog = true
    // },

    getPositions() {
      let str = "/api/app/position/all"
      axios.get(str, this.getHeader())
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              // this.object = {
              //   "id": resp.data[i].id,
              //   "name": resp.data[i].name
              // }
              this.positions.push(resp.data[i])
            }

          }).catch(err => {
        console.log(err)
      })
    },

    // getDesignations() {
    //   let str = "/api/app/designation/all"
    //   axios.get(str, this.getHeader())
    //       .then(resp => {
    //         for (let i = 0; i < resp.data.length; i++) {
    //           // this.object = {
    //           //   "id": resp.data[i].id,
    //           //   "name": resp.data[i].name
    //           // }
    //           this.positions.push(resp.data[i])
    //         }
    //
    //       }).catch(err => {
    //     console.log(err)
    //   })
    // },

    getEmployees() {
      let str = "/api/app/employee/all"
      axios.get(str, this.getHeader())
          .then(resp => {
            this.employees = []
            for (let i = 0; i < resp.data.length; i++) {
              // this.object = {
              //   "id": resp.data[i].id,
              //   "name": resp.data[i].name
              // }
              this.employees.push(resp.data[i])
              console.log(this.employees[i])
            }
            this.isFetchingEmployees = false;

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
            for (let i = 0; i < resp.data.length; i++) {
              //this.Case.push('Case-' + resp.data[i].id + ":" + resp.data[i].title)
              this.AllDepartments.push(resp.data[i])
              console.log(this.AllDepartments[i])
              this.isFetchingDepartments = false
              console.log('DepLength' + this.AllDepartments.length + this.AllDepartments[i].name)
            }
          }).catch(err => {
        console.log(err)
        if (this.doRefresh(err.response.status)) this.getListOfDepartments()
      })
    },

    // getListOfMediaForPublisher() {
    //   let str = "/api/app/media/publisher"
    //
    //   console.log("HMMM" + this.selectedDepartment)
    //   axios.create(this.getHeader()).post(str, this.selectedDepartment).then(resp => {
    //     console.log(resp.data)
    //     this.chosenPublisherMedia = []
    //     for (let i = 0; i < resp.data.length; i++) {
    //       this.chosenPublisherMedia.push(resp.data[i])
    //       this.isFetchingMedia = false
    //     }
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },


    // async submitDepartment() {
    //   if (this.$refs.form.validate()) {
    //     this.loadingSave = true
    //     let str = "/api/app/department/save"
    //     console.log(this.selectedEmployee)
    //     let data = {
    //       assigneeId: this.selectedEmployee,
    //       title: this.departmentName,
    //       description: this.numberOfEmployees,
    //       state: this.newCaseState
    //     }
    //     console.log(data)
    //     axios.create(this.getHeader()
    //     ).post(str, data)
    //         .then(resp => {
    //           console.log(resp.data)
    //           this.departmentEditorMode = false;
    //         }).catch(err => {
    //       if (this.doRefresh(err.response.status)) this.submit()
    //     })
    //     await new Promise(resolve => setTimeout(resolve, this.awaitTimer))
    //     this.updateOverlay()
    //
    //     let data2 = {
    //       dialog: false
    //     }
    //     this.$emit('updateParent', {data2})
    //     this.loadingSave = false
    //   }
    // },

    async updateEmployee(data) {

      this.loadingSave = true
      let str = "/api/app/employee/save"
      console.log(this.selectedEmployee.department)
      console.log("We sent to save:" + data)
      console.log(data)
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
      //this.$emit('updateParent', {data2})
      this.loadingSave = false

      console.log(this.selectedEmployee.position.accessLevel)
    },

    // openLinkedMedia(media) {
    //   this.$emit('switchSectionToMedia', 'MediaSection', media)
    // },

    openEmployee(object) {
      console.log("CLICK BUTTON WORKED")
      this.caseViewMode = true
      this.selectedEmployee = object
      // this.selectedDepCategoryValue = object.mediaCategory.name
      // this.selectedDepDesignationValue = object.designation.name
      this.object = object
      console.log(object)
      console.log("opening case" + object.id)
      console.log(this.AllDepartments)
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
    this.getPositions()
    this.getEmployees()
  },
  mounted: function () {
    console.log("YEEEEEEAAAA")
    this.$emit("mounted");
  }
}
</script>

<style scoped>

</style>
