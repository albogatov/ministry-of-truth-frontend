<template>
  <div>
    <v-form v-model="valid" lazy-validation ref="form">
      <v-card
          color="#F7FAFC"
      >
        <v-card-text class="font-weight-medium" style="font-size: 15pt; ">
          <div style="color: black; text-align: center; margin-bottom: 5%; font-size: 25px; line-height: 1">
            <br>Guidelines of the Ministry
          </div>
        </v-card-text>

        <v-btn style="margin-left: 25%; margin-bottom: 5%"
               :color=changeColor()
               outlined
               @click="guidelineEditorMode = true"
        >
          <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
          Register guideline
        </v-btn>

        <v-card-text class="font-weight-medium" style="font-size: 15pt; "
                     v-if="this.guidelineEditorMode && !this.isFetchingGuidelines && !this.isFetchingDepartments">
          <div style="margin-top: 5px; margin-bottom: 20px; color: black; font-weight: lighter">
            Enter data for the guideline
          </div>

          <v-text-field
              light
              label="Name"
              v-model="guidelineName"
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
              label="Newspeak Version"
              v-model="newspeakVersion"
              name="Name"
              type="number"
              min="1"
              max="2"
              :rules="rules.clearFieldValid"
              :color=changeColor()
              background-color=#EDF2F7
              outlined
              style="border-radius: 10px;"
          />

          <v-select  :rules="rules.clearFieldValid" v-model="guidelineDepartment" id="departmentList" :items="AllDepartments"
                    label="Choose department"
                    :item-text="'name'" :item-value="'id'">
            <option v-for="dep in AllDepartments" v-bind:key="dep.id" v-bind:value="dep.name">
              {{ dep.name }}
            </option>
          </v-select>

          <v-select  :rules="rules.clearFieldValid" v-model="selectedEmployee" id="emplList" :items="employees" label="Choose author"
                    :item-text="'name'" :item-value="'id'">
            <option v-for="emp in employees" v-bind:key="emp.id" v-bind:value="emp.name">
              {{ emp.name }}
            </option>
          </v-select>

          <v-date-picker :rules="rules.clearFieldValid"
              v-model="releaseDate"
              class="mt-4"
          ></v-date-picker>

          <v-btn style="margin-left: 25%; margin-bottom: 5%"
                 :color=changeColor()
                 outlined
                 :loading="loadingSave"
                 @click="submitGuideline"
          >
            <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
            Submit guideline
          </v-btn>

        </v-card-text>
      </v-card>
    </v-form>
    <v-card>
      <v-card-text>
        Select guideline:
      </v-card-text>
      <v-card>
        <v-list dense>
          <v-list-item-group

              color="primary"
          >

            <div v-if="this.AllGuidelines.length > 0">
              <v-list v-for="object in AllGuidelines" :key="object.id">
                <v-list-tile-content>
                  <v-btn
                      color="primary"
                      dark
                      v-text="'Guideline-' + object.id + ': ' + object.name"
                      @click="openGuideline(object)"
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
                  max-width="600px" v-if="!this.isFetchingGuidelines"
              >
                <v-card v-if="!this.isFetchingGuidelines && this.selectedGuideline != null">
                  <v-card-title>
                    <span class="text-h5">{{ selectedGuideline.name }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-text-field
                          :readonly="true"
                          light
                          label="Name"
                          v-model="selectedGuideline.name"
                          name="Name"
                          type="text"
                          :rules="rules.clearFieldValid"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />

                      <v-text-field
                          :readonly="true"
                          light
                          label="NewSpeak Version"
                          v-model="selectedGuideline.newspeakVersion"
                          name="newspeak"
                          type="text"
                          :rules="rules.clearFieldValid"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />

                      <v-select v-model="selectedGuideline.departmentId" id="departmentList" :items="AllDepartments"
                                label="Choose department"
                                :item-text="'name'" :item-value="'id'">
                        <option v-for="dep in AllDepartments" v-bind:key="dep.id" v-bind:value="dep.name">
                          {{ dep.name }}
                        </option>
                      </v-select>

                      <v-text-field :readonly=true
                                     v-model="selectedGuideline.releaseDate"
                                     class="mt-4"
                      ></v-text-field>

                      <v-text-field
                          :readonly="true"
                          light
                          label="Authored by"
                          v-model="selectedGuidelineAuthor"
                          name="authored"
                          type="text"
                          :rules="rules.clearFieldValid"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />

                      <v-list class="overflow-y-auto" max-height="400" v-for="rule in RulesGuideline"
                              :key="rule.id">
                        <v-list-tile-content>
                          <v-btn
                              color="primary"
                              dark
                              v-text="'Rule-' + rule.id"
                              @click="openLinkedRule(rule)"
                              width="80%"
                              height="5%"
                          >
                            Open Case
                          </v-btn>

                          <v-dialog
                              v-model="dialogInner"
                              persistent
                              max-width="600px"
                              v-if="viewingRule"
                          >
                            <v-card>
                              <v-card-title>
                                <span class="text-h5">{{ viewingRule.name }}</span>
                              </v-card-title>
                              <v-text-field readonly="true"
                                            light
                                            label="Description"
                                            v-model="viewingRule.description"
                                            name="authored"
                                            type="text"
                                            :rules="rules.clearFieldValid"
                                            :color=changeColor()
                                            background-color=#EDF2F7
                                            outlined
                                            style="border-radius: 10px;"
                              />

                              <v-text-field readonly="true"
                                            light
                                            label="Punishment"
                                            v-model="viewingRule.punishment"
                                            name="authored"
                                            type="text"
                                            :rules="rules.clearFieldValid"
                                            :color=changeColor()
                                            background-color=#EDF2F7
                                            outlined
                                            style="border-radius: 10px;"
                              />

                              <v-text-field readonly="true"
                                            light
                                            label="Date installed"
                                            v-model="viewingRule.installmentDate"
                                            name="authored"
                                            type="text"
                                            :rules="rules.clearFieldValid"
                                            :color=changeColor()
                                            background-color=#EDF2F7
                                            outlined
                                            style="border-radius: 10px;"
                              />
                            </v-card>
                            <v-btn
                                color="blue darken-1"
                                text
                                @click="dialogInner = false; viewingRule = null"
                            >
                              Close
                            </v-btn>
                          </v-dialog>

                        </v-list-tile-content>
                      </v-list>
                      <v-btn style="margin-left: 25%; margin-bottom: 5%"
                             :color=changeColor()
                             outlined
                             :loading="loadingSave"
                             @click="linkingRule = true"
                      >
                        <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
                        Add new rule
                      </v-btn>
                      <v-container v-if="linkingRule">
                        <v-text-field
                            light
                            label="Description"
                            v-model="currentRule.description"
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
                            label="Punishment"
                            v-model="currentRule.punishment"
                            name="Name"
                            type="text"
                            :rules="rules.clearFieldValid"
                            :color=changeColor()
                            background-color=#EDF2F7
                            outlined
                            style="border-radius: 10px;"
                        />

                        <v-date-picker
                            v-model="currentRule.installmentDate"
                            class="mt-4"
                        ></v-date-picker>

                        <v-btn style="margin-left: 25%; margin-bottom: 5%"
                               :color=changeColor()
                               outlined
                               :loading="loadingSave"
                               @click="updateGuideline(currentRule, selectedGuideline.id)"
                        >
                          <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
                          Save rule
                        </v-btn>
                        <v-btn style="margin-left: 25%; margin-bottom: 5%"
                               :color=changeColor()
                               outlined
                               :loading="loadingSave"
                               @click="dialog = false"
                        >
                          <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
                          Discard changes
                        </v-btn>
                      </v-container>
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
  name: "GuidelineSection",

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
    guidelineEditorMode: false,
    guidelineViewMode: false,
    newDepartmentState: 'Active',
    valid: true,
    removeButton: true,
    AllGuidelines: [],
    AllDepartments: [],
    guidelineName: '',
    numberOfEmployees: '',
    object: '',
    selectedGuideline: [],
    RulesGuideline: [],
    isFetchingGuidelines: true,
    isFetchingDepartments: true,
    releaseDate: null,
    selectedGuidelineAuthor: '',
    guidelineDepartment: '',
    newspeakVersion: '',
    linkingRule: false,
    currentRule: {
      description: '',
      installmentDate: '',
      punishment: '',
      guideline: ''
    },
    viewingRule: {
      description: '',
      punishment: '',
      installmentDate: ''
    },
    viewingRuleDescription: '',
    selectedGuidelineDepartment: null,

    dialogInner: false,

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
      this.selectedGuideline = obj
      this.dialog = true
    },


    getListOfDepartments() {
      let str = "/api/app/department/all"

      axios.create(this.getHeader()
      ).get(str)
          .then(resp => {
            console.log(resp.data)
            this.AllDepartments = []
            for (let i = 0; i < resp.data.length; i++) {
              Vue.set(this.AllDepartments, i, resp.data[i])
              console.log(this.AllDepartments[i])
              this.isFetchingDepartments = false
              console.log('DepLength' + this.AllDepartments.length + this.AllDepartments[i].name)
            }
          }).catch(err => {
        console.log(err)
        if (this.doRefresh(err.response.status)) this.getListOfDepartments()
      })

    },

    getListOfGuidelines() {
      let str = "/api/app/guideline/all"

      axios.create(this.getHeader()
      ).get(str)
          .then(resp => {
            console.log(resp.data)
            this.AllGuidelines = []
            for (let i = 0; i < resp.data.length; i++) {
              Vue.set(this.AllGuidelines, i, resp.data[i])
              console.log(this.AllGuidelines[i])
              this.isFetchingGuidelines = false
              console.log('DepLength' + this.AllGuidelines.length + this.AllGuidelines[i].name)
            }
          }).catch(err => {
        console.log(err)
        if (this.doRefresh(err.response.status)) this.getListOfGuidelines()
      })

    },

    getListOfRulesForGuideline(data) {
      let str = "/api/app/rule/guideline"

      axios.create(this.getHeader()).post(str, data).then(resp => {
        console.log(resp.data)
        this.RulesGuideline = []
        for (let i = 0; i < resp.data.length; i++) {
          this.RulesGuideline.push(resp.data[i])
          this.isFetchingRules = false
        }
      }).catch(err => {
        console.log(err)
      })
    },

    openLinkedRule(rule) {
      this.viewingRule = rule;
      this.viewingRuleDescription = rule.name
      console.log('ruleeee')
      console.log(rule)

      console.log(this.viewingRule)
      this.dialogInner = true;
    },

    async submitGuideline() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/guideline/save"
        console.log(this.selectedEmployee)
        let data = {
          name: this.guidelineName,
          releaseDate: this.releaseDate,
          newspeakVersion: this.newspeakVersion,
          departmentId: this.guidelineDepartment,
          authorId: this.selectedEmployee
        }
        console.log(data)
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {
              console.log(resp.data)
              this.guidelineEditorMode = false;
            }).catch(err => {
          if (this.doRefresh(err.response.status)) this.submit()
        })
        await new Promise(resolve => setTimeout(resolve, this.awaitTimer))
        this.getListOfGuidelines()
        this.updateOverlay()

        let data2 = {
          dialog: false
        }
        this.$emit('updateParent', {data2})
        this.loadingSave = false
      }
    },

    async updateGuideline(data, guideline) {

      this.loadingSave = true
      let str = "/api/app/rule/save"
      console.log(this.selectedGuideline)
      console.log("We sent to save:" + data)
      data.guidelineId = guideline
      axios.create(this.getHeader()
      ).post(str, data)
          .then(resp => {
            console.log("Server responded:" + resp.data)
          }).catch(err => {
        if (this.doRefresh(err.response.status)) this.submit()
      })
      await new Promise(resolve => setTimeout(resolve, this.awaitTimer))

      this.linkingRule = false;
      this.currentRule = {
        description: '',
        installmentDate: '',
        punishment: '',
        guideline: ''
      }
      this.dialog = false
      this.loadingSave = false

    },

    openGuideline(object) {
      console.log("CLICK BUTTON WORKED")
      this.guidelineViewMode = true
      this.selectedGuideline = object
      console.log("author")
      console.log(this.selectedGuideline.author)
      this.object = object
      this.selectedGuidelineAuthor = object.author.name
      console.log("opening case" + object.id)
      this.getListOfRulesForGuideline(this.selectedGuideline)
      this.selectedGuidelineDepartment = object.department.name
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

    updateOverlay() {
      this.getListOfGuidelines()
    },

    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },
  },
  beforeMount() {
    this.getListOfGuidelines()
    this.getListOfDepartments()
    this.getEmployees()
  },
  mounted: function () {
    this.$emit("mounted");
  }
}
</script>

<style scoped>

</style>
