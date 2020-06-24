import Vue from 'vue';
import Skeleton1 from './components/Skeleton/Skeleton1';
import Skeleton2 from './components/Skeleton/Skeleton2';

export default new Vue({
  components: {
    Skeleton1,
    Skeleton2
  },
  template: `
    <div>
      <skeleton1 id="skeleton1" style="display:none"/>
      <skeleton2 id="skeleton2" style="display:none"/>
    </div>
  `
});
