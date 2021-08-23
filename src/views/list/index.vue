<template>
  <div class="case-stage">
    <!-- <base-manage></base-manage> -->
    <CommonFilter />
    <br />
    <CommonCard />
  </div>
</template>

<script>
import CommonFilter from '@/components/CaseList/filter'
import CommonCard from '@/components/CaseList/card'

export default {
  name: '',
  components: {
    CommonFilter,
    CommonCard
  },
  methods: {
    loadEvent() {}
  },
  created() {
    this.loadEvent()
  }
}
</script>

<style scoped></style>
