// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import FilePickerButton from 'vue-google-picker';
import App from './App';
import router from './router';
import FileUpload from './components/FileUpload';

Vue.config.productionTip = false;
Vue.component('file-upload', FileUpload);
Vue.component('file-picker-button', FilePickerButton);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App,
  },
  template: '<App/>',
});
