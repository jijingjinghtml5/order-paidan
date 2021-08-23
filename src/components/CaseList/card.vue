<template>
  <div class="common-card">
    <el-card>卡片</el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CommonCard',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['eventType', 'reportTypes', 'eventSource'])
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>
