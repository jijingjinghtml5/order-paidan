<template>
  <div>
    <el-card shadow="always">
      <h2 slot="header" class="header">筛选名称</h2>

      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="">
          <el-checkbox-group v-model="form.type">
            <el-row v-for="(item, index) in options" :key="index">
              <el-checkbox :label="item.label" :key="item.label">{{ item.label }}</el-checkbox>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        type: []
      },
      options: [
        {
          label: '案件标号',
          value: ''
        },
        {
          label: '发生地址',
          value: ''
        },
        {
          label: '案件分类',
          value: ''
        },
        {
          label: '上报方式',
          value: ''
        },
        {
          label: '案件来源',
          value: ''
        },
        {
          label: '上报时间',
          value: ''
        }
      ]
    }
  },
  methods: {
    onSubmit() {
      this.$router.replace('/template/search')
    }
  }
}
</script>

<style></style>
