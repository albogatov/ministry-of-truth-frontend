<template>
  <div>
    <v-form v-model="valid" lazy-validation ref="form">
      <v-card
          color="#F7FAFC"
      >
        <v-card-text class="font-weight-medium" style="font-size: 15pt; ">
          <div style="color: black; text-align: center; margin-bottom: 5%; font-size: 25px; line-height: 1">
            <br>Media in possession of the Ministry
          </div>
        </v-card-text>

        <v-btn style="margin-left: 25%; margin-bottom: 5%"
               :color=changeColor()
               outlined
               @click="mediaEditorMode = true"
        >
          <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
          Register new media
        </v-btn>

        <v-card-text class="font-weight-medium" style="font-size: 15pt; " v-if="this.mediaEditorMode">
          <div style="margin-top: 5px; margin-bottom: 20px; color: black; font-weight: lighter">
            Enter data for the media product
          </div>

          <v-text-field
              light
              label="Title"
              v-model="mediaTitle"
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
              label="Estimation"
              v-model="estimation"
              name="Estimation"
              type="number"
              :rules="rules.clearFieldValid"
              :color=changeColor()
              background-color=#EDF2F7
              outlined
              style="border-radius: 10px;"
          />

          <v-select v-model="selectedCategory" id="categoryList" :items="categories" label="Choose media category"
                    :item-text="'name'" :item-value="'id'">
            <option v-for="cat in categories" v-bind:key="cat.id" v-bind:value="cat.name">
              {{ cat.name }}
            </option>
          </v-select>

          <v-select v-model="newMediaState" id="newMediaState" :items="mediaStates" label="Choose state">
          </v-select>

          <v-select v-model="selectedPublisher" id="publisherList" :items="publishers" label="Choose publisher"
                    :item-text="'name'" :item-value="'id'">
            <option v-for="cat in publishers" v-bind:key="cat.id" v-bind:value="cat.name">
              {{ cat.name }}
            </option>
          </v-select>

          <v-btn style="margin-left: 25%; margin-bottom: 5%"
                 :color=changeColor()
                 outlined
                 :loading="loadingSave"
                 @click="submitMedia"
          >
            <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>
            Submit the media product
          </v-btn>

        </v-card-text>
      </v-card>
    </v-form>
    <v-card>
      <v-card-text>
        Select media:
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
                  max-width="600px" v-if="!this.isFetchingMedia"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      v-for="(mediaCurrent,id) in AllMedia"
                      :key="id" :value="mediaCurrent.title"
                      v-text="'Media-' + mediaCurrent.id + ': ' + mediaCurrent.title"
                      id="hiddenButtonDialog"
                      ref="hiddenButtonDialog"
                      @click="openMedia(mediaCurrent)"
                      width="100%"
                      height="5%"
                  >
                    Open Media
                  </v-btn>
                </template>
<!--                <v-card>-->
<!--                  <v-card-text class="font-weight-medium" style="font-size: 15pt; " v-if="this.mediaEditorMode">-->

<!--                    <v-text-->
<!--                        light-->
<!--                        label="Title"-->
<!--                        v-model="this.selectedMedia.title"-->
<!--                        background-color=#EDF2F7-->
<!--                        outlined-->
<!--                        style="border-radius: 10px;"-->
<!--                    />-->

<!--                    <v-text-field-->
<!--                        light-->
<!--                        label="Estimation"-->
<!--                        v-model="this.selectedMedia.estimation"-->
<!--                        name="Estimation"-->
<!--                        type="number"-->
<!--                        :rules="rules.clearFieldValid"-->
<!--                        :color=changeColor()-->
<!--                        background-color=#EDF2F7-->
<!--                        outlined-->
<!--                        style="border-radius: 10px;"-->
<!--                    />-->

<!--                    <v-select v-model="this.selectedMedia.mediaCategory.name" id="emplList" :items="categories" label="Choose category"-->
<!--                              :item-text="'name'" :item-value="'id'">-->
<!--                      <option v-for="cat in categories" v-bind:key="cat.id" v-bind:value="cat.name">-->
<!--                        {{this.selectedMedia.mediaCategory.name}}-->
<!--                      </option>-->
<!--                    </v-select>-->

<!--                    <v-select v-model="this.selectedMedia.status" value="this.selectedMedia.status" id="newCaseState" :items="mediaStates" label="Choose state">-->
<!--                      <option v-for="st in mediaStates" v-bind:key="st.name" v-bind:value="st.name">-->
<!--                        {{this.selectedMedia.status}}-->
<!--                      </option>-->
<!--                    </v-select>-->

<!--                    <v-btn-->
<!--                        color="primary"-->
<!--                        dark-->
<!--                        v-text="'Published by ' + publishers.find(pub => pub.id === selectedMedia.publisher).name"-->
<!--                        @click="openPublisher(publishers.find(pub => pub.id === selectedMedia.publisher))"-->
<!--                        width="80%"-->
<!--                        height="5%"-->
<!--                    >-->
<!--                      Open Case-->
<!--                    </v-btn>-->

<!--&lt;!&ndash;                    <v-select v-model="selectedPublisher" id="publisherList" :items="publishers" label="Choose publisher"&ndash;&gt;-->
<!--&lt;!&ndash;                              :item-text="'name'" :item-value="'id'">&ndash;&gt;-->
<!--&lt;!&ndash;                      <option v-for="cat in publishers" v-bind:key="cat.id" v-bind:value="cat.name">&ndash;&gt;-->
<!--&lt;!&ndash;                        {{ cat.name }}&ndash;&gt;-->
<!--&lt;!&ndash;                      </option>&ndash;&gt;-->
<!--&lt;!&ndash;                    </v-select>&ndash;&gt;-->

<!--                    <v-btn style="margin-left: 25%; margin-bottom: 5%"-->
<!--                           :color=changeColor()-->
<!--                           outlined-->
<!--                           :loading="loadingSave"-->
<!--                           @click="submitMedia"-->
<!--                    >-->
<!--                      <v-icon style="margin-right: 8px">mdi-cloud-upload</v-icon>-->
<!--                      Submit the media-->
<!--                    </v-btn>-->

<!--                  </v-card-text>-->
<!--                </v-card>-->
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ this.selectedMedia.title }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-text-field
                          light
                          label="Estimation"
                          v-model="selectedMedia.estimation"
                          name="Estimation"
                          type="number"
                          :rules="rules.clearFieldValid"
                          :color=changeColor()
                          background-color=#EDF2F7
                          outlined
                          style="border-radius: 10px;"
                      />
                      <v-select v-model="selectedMedia.mediaCategory" id="categoryList" :items="categories" label="Choose category"
                                :item-text="'name'" :item-value="'id'">
                        <option v-for="cat in categories" v-bind:key="cat.id" v-bind:value="cat.name">
                          {{ cat.name }}
                        </option>
                      </v-select>

                      <v-select v-model="selectedMedia.status" id="newCaseState" :items="mediaStates" label="Choose state">
                      </v-select>

                      <v-list class="overflow-y-auto" max-height="400" v-for="cases in chosenMediaCase"
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
                                :item-text="'title'" :item-value="'id'" v-if="linkToCase" :rules="rules.clearFieldValid">
                        <option v-for="mcase in AllCases" v-bind:key="mcase.id" v-bind:value="mcase.title">
                          {{ mcase.title }}
                        </option>
                      </v-select>
                      <v-btn style="margin-left: 25%; margin-bottom: 5%"
                             :color=changeColor()
                             outlined
                             :loading="loadingSave"
                             @click="createLinkToCase(mcase, selectedMedia)" v-if="linkToCase"
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
                        @click="updateMedia(selectedMedia)"
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
  name: "MediaSection",

  data: () => ({
    icons: {
      mdiDelete,
    },
    dialog: false,
    categories: [],
    mediaStates: ['Discovered', 'Processing', 'Redacted', 'Rereleased', 'Destroyed'],
    selectedCategory: "",
    loadingRemove: false,
    loadingSave: false,
    mediaEditorMode: false,
    caseViewMode: false,
    newMediaState: 'Discovered',
    absolute: true,
    valid: true,
    removeButton: true,
    AllMedia: [],
    CaseList: '',
    CaseMedia: '',
    mediaTitle: '',
    estimation: '',
    object: '',
    selectedMedia: [],
    chosenMediaCase: [],
    isFetchingMedia: true,
    isFetchingCase: true,
    isFetchingPublishers: true,
    AllCases: [],
    linkToCase: false,
    mcase: [],
    selectedPublisher: [],
    publishers: [],

    Media: [],

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
      //   console.log('loading')
      this.selectedMedia = obj
      this.dialog = true
    },

    getCategories() {
      let str = "/api/app/category/all"
      axios.get(str, this.getHeader())
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              this.object = {
                "id": resp.data[i].id,
                "name": resp.data[i].name
              }
              this.categories.push(resp.data[i])
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

    getListOfCasesForMedia() {
      let str = "/api/app/caseMedia/case"

      console.log("HMMM" + this.selectedMedia)
      axios.create(this.getHeader()).post(str, this.selectedMedia).then(resp => {
        console.log("All cases for this media:" + resp.data)
        this.chosenMediaCase = []
        for (let i = 0; i < resp.data.length; i++) {
          this.chosenMediaCase.push(resp.data[i])
          this.isFetchingCase = false
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
            for (let i = 0; i < resp.data.length; i++) {
              //this.Case.push('Case-' + resp.data[i].id + ":" + resp.data[i].title)
              this.publishers.push(resp.data[i])
              console.log(this.publishers[i])
              this.isFetchingPublishers = false
            }
          }).catch(err => {
        console.log(err)
        if (this.doRefresh(err.response.status)) this.getListOfPublishers()
      })
    },

    async submitMedia() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/media/save"
        console.log(this.selectedCategory)
        let data = {
          mediaCategoryId: this.selectedCategory,
          title: this.mediaTitle,
          estimation: this.estimation,
          status: this.newMediaState,
          publisher: this.selectedPublisher.id
        }
        console.log(data)
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {
              console.log(resp.data)
              this.mediaEditorMode = false;
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
        this.getListOfMediaProducts()
        this.getListOfCasesForMedia()
      }
    },

    async createLinkToCase(mcase,media) {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/caseMedia/save"
        //console.log(this.selectedCategory)
        let data = {
          mediaId: media.id,
          caseId: mcase
        }
        console.log("CaseMedia:"  + mcase)
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {
              console.log(resp.data)
              //this.mediaEditorMode = false;
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
        this.getListOfCasesForMedia()
      }
    },

    async removeLinkWithCase(mcase) {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        let str = "/api/app/caseMedia/delete"
        //console.log(this.selectedCategory)
        let data = {
          mediaId: this.selectedMedia.id,
          caseId: mcase.id
        }
        console.log("CaseMedia:"  + mcase.id + this.selectedMedia.id)
        axios.create(this.getHeader()
        ).post(str, data)
            .then(resp => {
              console.log(resp.data)
              //this.mediaEditorMode = false;
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
        this.getListOfCasesForMedia()
      }
    },

    openLinkedCase(mcase) {
      this.$emit('switchSectionToCase', 'CaseSection', mcase)
    },

    openPublisher(publisher) {
      this.$emit('switchSectionToPublisher', 'PublisherSection', publisher)
    },

    async updateMedia(data) {

      this.loadingSave = true
      let str = "/api/app/media/save"
      console.log(this.selectedCategory)
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

    openMedia(object) {
      this.caseViewMode = true
      this.selectedMedia = object
      console.log("Opened media")
      console.log(object)
      this.getListOfCasesForMedia()
      console.log("Selected media")
      console.log(this.selectedMedia)
    },

    updateElements(CaseList) {
      if (CaseList !== this.Media[0]) {
        CaseList = CaseList.split(" ").pop()
        //this.getCaseByID(CaseList)
        this.removeButton = false
      } else if (CaseList === this.Media[0]) {
        this.CaseMedia = ''
        this.removeButton = true
      }
    },

    updateOverlay() {
      // this.Case = ['Добавить новый элемент']
      // this.CaseList = this.Case[0]
      this.getListOfMediaProducts()
      //this.updateElements(this.CaseList)
    },

    changeColor() {
      return this.primaryColor(this.$store.getters.getPrimaryColor)
    },
  },
  beforeMount() {
    //this.updateOverlay()
    this.getCategories()
    this.getListOfMediaProducts()
    this.getListOfCases()
  },
  mounted: function() {
    console.log("YEEEEEEAAAA")
    this.$emit("mounted");
  }
}
</script>

<style scoped>

</style>
