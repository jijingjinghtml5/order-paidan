<template>
  <div class="case-stage">
    <base-manage
      :type="6"
      :show-dsc="true"
      :table-columns="tableColumns"
      :custom-details="'/template/detail-detail'"
    ></base-manage>
  </div>
</template>

<script>
import BaseManage from '@/components/Base/BaseManage'

export default {
  name: '',
  components: {
    BaseManage
  },
  data() {
    return {
      tableColumns: [
        {
          prop: 'id',
          label: '序号',
          labelCustomize: true,
          getLabel: (row, index, page, pageSize) => {
            return pageSize * (page - 1) + index + 1
          }
        },
        { prop: 'name', label: '名称' },
        { prop: 'code', label: 'ID' },
        { prop: 'description', label: '备注' }
      ]
    }
  }
}
</script>

<style scoped></style>
