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
          >

            <div>
              <v-dialog
                  v-model="dialog"
                  persistent
                  max-width="600px" v-if="!this.isFetchingCases"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      v-for="(object,id) in AllCases"
                      :key="id" :value="object.title"
                      v-text="'Case-' + object.id + ': ' + object.title"
                      id="hiddenButtonDialog"
                      ref="hiddenButtonDialog"
                      @click="openCase(object)"
                      width="100%"
                      height="5%"
                  >
                    Open Case
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text class="font-weight-medium" style="font-size: 15pt; " v-if="this.caseEditorMode">

                    <v-text
                        light
                        label="Title"
                        v-model="object.title"
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
                      <v-select v-model="selectedEmployee" id="emplList" :items="employees" label="Choose assignee"
                                :item-text="'name'" :item-value="'id'">
                        <option v-for="emp in employees" v-bind:key="emp.id" v-bind:value="emp.name">
                          {{ emp.name }}
                        </option>
                      </v-select>

                      <v-select v-model="newCaseState" id="newCaseState" :items="caseStates" label="Choose state">
                      </v-select>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialog = false"
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
    selectedCase: [],
    isFetchingCases: true,

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

    getListOfCases() {
      let str = "/api/app/case/all"

      axios.create(this.getHeader()
      ).get(str)
          .then(resp => {
            console.log(resp.data)
            for (let i = 0; i < resp.data.length; i++) {
              this.Case.push('Case-' + resp.data[i].id + ":" + resp.data[i].title)
              this.AllCases.push(resp.data[i])
              console.log(this.AllCases[i])
              this.isFetchingCases = false
            }
          }).catch(err => {
        if (this.doRefresh(err.response.status)) this.getListOfCases()
      })
    },

    async submitCase() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/case/save"
        console.log(this.selectedEmployee)
        let data = {
          assigneeId: this.selectedEmployee,
          title: this.caseTitle,
          description: this.description,
          state: this.newCaseState
        }
        console.log(data)
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {
              console.log(resp.data)
              this.caseEditorMode = false;
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

    async updateCase(data) {

        this.loadingSave = true
        let str = "/api/app/case/save"
        console.log(this.selectedEmployee)
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
        //this.$emit('updateParent', {data2})
        this.loadingSave = false

    },

    openCase(object) {
      this.caseViewMode = true
      this.selectedCase = object
      console.log(this.AllCases)
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
      this.getListOfCases()
      //this.updateElements(this.CaseList)
    },

    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },
  },
  beforeMount() {
    //this.updateOverlay()
    this.getEmployees()
    this.getListOfCases()
  }
}
</script>

<style scoped>

</style>
