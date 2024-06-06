<template>
  <div class="card flex justify-content-center">
      <Stepper @step-change="stepChanged">
          <StepperPanel header="Variables & Keywords">
              <template #content="{ nextCallback }">
                <Button label="Add Variable" @click="addVariable" />
                <div class="card p-fluid flex justify-content-between" v-for="(variable, index) in variables" :key="index">
                  <FloatLabel class="w-4">
                      <InputText :id="`variable-${index}`" v-model="variable.name" />
                      <label :for="`variable-${index}`">Variable</label>
                  </FloatLabel>
                  <FloatLabel class="w-7">
                      <Chips :id="`chips-${index}`" v-model="variable.keywords" />
                      <label :for="`chips-${index}`">Chips</label>
                  </FloatLabel>
                  <i class="pi pi-trash" style="color: red; font-size: 1.5rem; margin: auto 0" @click="removeVariable(index)"></i>
                </div>
                <div class="flex pt-4 justify-content-end">
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" :disabled="variables.length === 0" />
                </div>
              </template>
          </StepperPanel>
          <StepperPanel header="File PDF">
              <template #content="{ prevCallback, nextCallback }">
                  <div class="card">
                      <FileUpload name="files" url="localhost:8000/upload" @upload="onUploadCompleted($event)" @error="onUploadError($event)" :multiple="true" accept="application/pdf">
                          <template #empty>
                              <p>Drag and drop files to here to upload.</p>
                          </template>
                      </FileUpload>
                  </div>
                  <div class="flex pt-4 justify-content-between">
                      <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                      <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="submit(nextCallback)" :disabled="!isUploadSucceed" />
                  </div>
              </template>
          </StepperPanel>
          <StepperPanel header="Result">
              <template #content="{ prevCallback }">
                  <div class="card flex justify-content-center" :style="loadingStyle.value">
                      <ProgressSpinner />
                  </div>
                  <Accordion :activeIndex="results.length === 1 ? 0 : null">
                      <AccordionTab v-for="(result, index) in results.value" :key="`result.file-${index}`">
                          <template #header>
                              <span class="flex align-items-center gap-2 w-full">
                                  <h2 class="font-bold white-space-nowrap">{{ result.file }}</h2>
                              </span>
                          </template>
                          <div class="card">
                              <DataTable :value="result.results" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                                  <Column field="No" header="No" style="width: 5%">
                                      <template #body="slotProps">
                                      {{ slotProps.index + 1 }}
                                  </template>
                                  </Column>
                                  <Column field="page" header="Page" style="width: 5%"></Column>
                                  <Column field="sentence" header="Sentence" style="width: 50%"></Column>
                                  <Column field="keyword" header="Keyword" style="width: 20%"></Column>
                                  <Column field="variable" header="Variable" style="width: 20%"></Column>
                              </DataTable>
                          </div>
                      </AccordionTab>
                  </Accordion>
                  <div class="flex pt-4 justify-content-start">
                      <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                  </div>
              </template>
          </StepperPanel>
      </Stepper>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import axios from 'axios';

const variables = reactive([])
const uploadedFilenames = reactive([])

const addVariable = () => {
  variables.push({
    name: "",
    keywords: []
  });
};

const removeVariable = (index) => {
  variables.splice(index, 1); 
}

const isUploadSucceed = ref(false)
const onUploadCompleted = (e) => {
  try {
    const response = e.xhr;
    
    if (response.status === 200) {
      isUploadSucceed.value = true
      const responseJson = JSON.parse(response.response)
      uploadedFilenames.value = responseJson.files
    } else {
      // Handle upload failure
    }
  } catch (error) {
    console.error('Error handling upload:', error);
    // Handle any other errors or exceptions here
  }
};

const onUploadError = (e) => {
  console.log(e);
};

const loadingStyle = reactive({display: "flex !important"})

const results = reactive([])
const submit = (next) => {
  next()
  const reqVariables = {}
  variables.forEach(v => {
    reqVariables[v.name] = v.keywords
  })

  axios.post('localhost:8000/submit', {
    variables: reqVariables,
    files: uploadedFilenames.value
  })
  .then(function (response) {
    results.value = response.data.data
    console.log(results)
    loadingStyle.value = {display: "none !important"}
  })
  .catch(function (error) {
    console.log(error);
  });
  
  // return <div class="card flex justify-content-center">
  //       <ProgressSpinner />
  //   </div>
}

const stepChanged = (e) => {
//   if (e.index === 2) {
//     const result = [
//   {
//     "file": "Dissertation Hasto Final Draft 13A - Post Sidang Tertutup - Sent 6apr2021",
//     "results": [
//       {
//         "page": 105,
//         "sentence": 'By acting on both the demand and supply side of the finance equation, it builds a base for sustainable green bond markets”; “climate change efforts have progressively evolved from top-down policy initiatives  to bottom-up civil society participation and private sector implementation”, and “the IFC/Amundi partnership tackles these issues through an innovative platform and a pragmatic approach to unlock private capital flows for climate finance in developing countries”.',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 155,
//         "sentence": 'Such loop is intricately linked with day-to-day actions of the organization, performed by the front-liners including investment officers, along with the  immediate results that are reported to senior management as a feedback loop.',
//         "variable": "Dynamic Stakeholder Engagement",
//         "keyword": "feedback loop"
//       },
//       {
//         "page": 155,
//         "sentence": 'Leaders facilitate such feedback loop and decision making, while other stakeholders/business component complement as relevant.',
//         "variable": "Dynamic Stakeholder Engagement",
//         "keyword": "feedback loop"
//       },
//       {
//         "page": 189,
//         "sentence": 'Co-founding the Portfolio Decarbonization Coalition, launched under the umbrella of the UN in 2014; • Co-development of “low-carbon” indexes alongside AP4, FRR and MSCI • Signing a partnership with EDF to offer energy infrastructure investments based around renewable energy; • Involvement in numerous collective initiatives to encourage best practice on a company and country level, such as the disclosure of ESG practices and development of a framework on human rights; • Launch of two green bond funds;',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 189,
//         "sentence": 'Co-founding the Portfolio Decarbonization Coalition, launched under the umbrella of the UN in 2014; • Co-development of “low-carbon” indexes alongside AP4, FRR and MSCI • Signing a partnership with EDF to offer energy infrastructure investments based around renewable energy; • Involvement in numerous collective initiatives to encourage best practice on a company and country level, such as the disclosure of ESG practices and development of a framework on human rights; • Launch of two green bond funds;',
//         "variable": "Resource Interdependence",
//         "keyword": "co-development"
//       },
//       {
//         "page": 190,
//         "sentence": 'Climate Action: Strategic partnership with IFC to unlock private capital flows for climate finance in developing countries through, among others, a $2bn green bond projectAmundi is working with the International Finance Corporation (IFC) to create the world’s largest green-bond fund dedicated to emerging markets.',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 190,
//         "sentence": 'The IFC/Amundi partnership tackles these issues through an innovative platform and a pragmatic approach to unlock private capital flows for climate finance in developing countries.',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 191,
//         "sentence": 'One innovative solution to address these concerns is to set up a strategic partnership with a key player, such as EDF, in order to facilitate the financing of green real assets leveraging on both areas of expertise.',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 214,
//         "sentence": 'The Upside (Emily Anonuevo): Now Fidelity recently announced its UN PRI partnership was a really super exciting.',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 214,
//         "sentence": 'Can you explain how ESG fits in this overall picture this partnership picture?',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 220,
//         "sentence": 'Of weeks ago with in partnership with United Nations particularly trying to identify how we could gain issuance across that broader role of sustainable development goals for 17 goals rather than just focus on one particular issue.',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       }
//     ]
//   },
//   {
//     "file": "Dissertation Hasto Final Draft 13A - Post Sidang Tertutup - Sent 6apr2021",
//     "results": [
//       {
//         "page": 105,
//         "sentence": 'By acting on both the demand and supply side of the finance equation, it builds a base for sustainable green bond markets”; “climate change efforts have progressively evolved from top-down policy initiatives  to bottom-up civil society participation and private sector implementation”, and “the IFC/Amundi partnership tackles these issues through an innovative platform and a pragmatic approach to unlock private capital flows for climate finance in developing countries”.',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 155,
//         "sentence": 'Such loop is intricately linked with day-to-day actions of the organization, performed by the front-liners including investment officers, along with the  immediate results that are reported to senior management as a feedback loop.',
//         "variable": "Dynamic Stakeholder Engagement",
//         "keyword": "feedback loop"
//       },
//       {
//         "page": 155,
//         "sentence": 'Leaders facilitate such feedback loop and decision making, while other stakeholders/business component complement as relevant.',
//         "variable": "Dynamic Stakeholder Engagement",
//         "keyword": "feedback loop"
//       },
//       {
//         "page": 189,
//         "sentence": 'Co-founding the Portfolio Decarbonization Coalition, launched under the umbrella of the UN in 2014; • Co-development of “low-carbon” indexes alongside AP4, FRR and MSCI • Signing a partnership with EDF to offer energy infrastructure investments based around renewable energy; • Involvement in numerous collective initiatives to encourage best practice on a company and country level, such as the disclosure of ESG practices and development of a framework on human rights; • Launch of two green bond funds;',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 189,
//         "sentence": 'Co-founding the Portfolio Decarbonization Coalition, launched under the umbrella of the UN in 2014; • Co-development of “low-carbon” indexes alongside AP4, FRR and MSCI • Signing a partnership with EDF to offer energy infrastructure investments based around renewable energy; • Involvement in numerous collective initiatives to encourage best practice on a company and country level, such as the disclosure of ESG practices and development of a framework on human rights; • Launch of two green bond funds;',
//         "variable": "Resource Interdependence",
//         "keyword": "co-development"
//       },
//       {
//         "page": 190,
//         "sentence": 'Climate Action: Strategic partnership with IFC to unlock private capital flows for climate finance in developing countries through, among others, a $2bn green bond projectAmundi is working with the International Finance Corporation (IFC) to create the world’s largest green-bond fund dedicated to emerging markets.',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 190,
//         "sentence": 'The IFC/Amundi partnership tackles these issues through an innovative platform and a pragmatic approach to unlock private capital flows for climate finance in developing countries.',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 191,
//         "sentence": 'One innovative solution to address these concerns is to set up a strategic partnership with a key player, such as EDF, in order to facilitate the financing of green real assets leveraging on both areas of expertise.',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 214,
//         "sentence": 'The Upside (Emily Anonuevo): Now Fidelity recently announced its UN PRI partnership was a really super exciting.',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 214,
//         "sentence": 'Can you explain how ESG fits in this overall picture this partnership picture?',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       },
//       {
//         "page": 220,
//         "sentence": 'Of weeks ago with in partnership with United Nations particularly trying to identify how we could gain issuance across that broader role of sustainable development goals for 17 goals rather than just focus on one particular issue.',
//         "variable": "Resource Interdependence",
//         "keyword": "partnership"
//       }
//     ]
//   }
// ]
//     Object.assign(results, result)
//     console.log(results)
//   }
}
</script>

<style scoped>
.p-stepper {
  flex-basis: 80rem;
}
</style>