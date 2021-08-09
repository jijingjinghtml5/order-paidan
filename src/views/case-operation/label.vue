<template>
  <div class="case-stage">
    <base-manage :type="12" :table-columns="tableColumns" :labelList="labelList"></base-manage>
  </div>
</template>

<script>
import BaseManage from '@/components/Base/BaseManage'
import { getManageElements } from '@/api/case'

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
        { prop: 'name', label: '字段名称' },
        { prop: 'code', label: '字段code' },
        { prop: 'label', label: '标签' }
      ],
      labelList: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getManageElements({ type: 13 })
        .then((res) => {
          if (Object.keys(res).length > 0) {
            this.labelList = res.response[0].data
          }
        })
        .catch(() => {
          console.log('获取数据失败')
        })
    }
  }
}
</script>

<style scoped></style>
