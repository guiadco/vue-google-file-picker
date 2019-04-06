<template>
  <div class="fileupload">
    <button @click="handleButtonClick" :disabled="!pickerApiLoaded"><slot/></button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'FileUpload',
  props: ['config'],
  data() {
    return {
      picked: {},
      pickerApiLoaded: false,
      oauthToken: '',
      img: '',
    };
  },
  methods: {
    handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        this.oauthToken = authResult.access_token;
        this.createPicker();
      } else {
        console.log(authResult.details);
      }
    },
    handleButtonClick() {
      window.gapi.auth2.authorize({
        client_id: this.config.clientId,
        scope: this.config.scope,
      }, this.handleAuthResult);
    },
    createPicker() {
      if (this.pickerApiLoaded && this.oauthToken) {
        const view = new google.picker.View(google.picker.ViewId.DOCS);
        const picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setOAuthToken(this.oauthToken)
            .addView(view)
            .addView(new google.picker.DocsUploadView())
            .setDeveloperKey(this.config.developerKey)
            .setCallback(this.pickerCallback)
            .build();
         picker.setVisible(true);
      }
    },
    pickerCallback(data) {
      if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
        this.$emit('picked', data);
        const fileId = data.docs[0].id;
        axios({ method: "GET", "url": "https://www.googleapis.com/drive/v3/files/' +fileId", headers: {'Authorization': 'Bearer '+this.oauthToken}}).then(result => {
          console.log('result', result);
        }, error => {
          console.error(error);
        });
      }
    },
  },
  mounted() {
    if (!window.gapi) {
      console.log('Google API not loaded');
    } else {
      window.gapi.load('auth2');
      window.gapi.load('picker', () => {
        this.pickerApiLoaded = true;
      });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
