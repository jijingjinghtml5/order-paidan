<template>
  <div>
    <el-card shadow="always">
      <h2 slot="header" class="header">排序名称</h2>
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
          label: '上报时间',
          value: ''
        },
        {
          label: '剩余时间',
          value: ''
        },
        {
          label: '整体截至时间',
          value: ''
        }
      ]
    }
  },
  methods: {
    onSubmit() {
      this.$router.replace('/template/sort')
    }
  }
}
</script>

<style></style>
