<template>
  <div class="dialog-new">
    <global-dialog
      v-bind="$attrs"
      v-on="$listeners"
      v-loading="loading"
      @confirm="handleConfirm"
      @cancel="$emit('update:visible', false)"
      :show-footer="dialogStatus != 'detail'"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="form">
        <el-form-item label="组合名称" prop="name">
          <el-input
            v-model="form.name"
            class="select-item"
            :disabled="dialogStatus == 'detail'"
            placeholder="请输入组合名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="案件来源" prop="source">
          <el-select
            v-model="form.source"
            placeholder="请选择案件来源"
            class="select-item"
            :disabled="dialogStatus == 'detail'"
          >
            <el-option
              v-for="item in sourcesOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件分类" prop="event_type">
          <el-cascader
            :disabled="dialogStatus == 'detail'"
            class="select-item"
            :options="eventOptions"
            :show-all-levels="true"
            v-model="form.event_type"
            placeholder="请选择案件分类"
            :props="{ label: 'name', value: 'code', checkStrictly: true }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="上报方式" prop="report">
          <el-select
            v-model="form.report"
            placeholder="请选择上报方式"
            class="select-item"
            :disabled="dialogStatus == 'detail'"
          >
            <el-option
              v-for="item in reportOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发现方式" prop="discover">
          <el-select
            v-model="form.discover"
            placeholder="请选择发现方式"
            class="select-item"
            :disabled="dialogStatus == 'detail'"
          >
            <el-option
              v-for="item in discoverOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件卡片" prop="link_cards">
          <el-select
            v-model="form.link_cards"
            :disabled="dialogStatus == 'detail'"
            placeholder="请选择案件卡片"
            class="select-item"
          >
            <el-option
              v-for="item in cardOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件详情" prop="link_infos">
          <el-select
            v-model="form.link_infos"
            placeholder="请选择案件详情"
            :disabled="dialogStatus == 'detail'"
            class="select-item"
          >
            <el-option
              v-for="item in detailOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印模板" prop="link_prints">
          <el-select
            v-model="form.link_prints"
            placeholder="请选择打印模板"
            :disabled="dialogStatus == 'detail'"
            class="select-item"
          >
            <el-option
              v-for="item in printOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </global-dialog>
  </div>
</template>

<script>
import { createManageBusinesss, editManageBusinesss } from '@/api/views'

export default {
  name: '',
  props: {
    editInfo: {
      type: Object,
      default: () => {}
    },
    dialogStatus: {
      type: String,
      default: () => {}
    },
    reportOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    discoverOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    eventOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    sourcesOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    cardOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    detailOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    printOptions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      loading: false,
      form: {},
      rules: {
        name: [{ required: true, message: '请输入字段名称', trigger: 'change' }]
      }
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      if (this.dialogStatus == 'update' || this.dialogStatus == 'detail') {
        this.form = { ...this.editInfo }
        this.form.report = parseInt(this.form.report, 10) || ''
        this.form.source = parseInt(this.form.source, 10) || ''
        this.form.discover = parseInt(this.form.discover, 10) || ''
        this.form.event_type = [
          this.form.event_type_1,
          this.form.event_type_2,
          this.form.event_type_3,
          this.form.event_type_4
        ].filter((v) => v)
      } else {
        this.form = {
          name: '',
          event_type: '',
          report: '',
          discover: '',
          source: '',
          link_cards: '',
          link_infos: '',
          link_prints: ''
        }
      }
    },
    // 确定按钮
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-expressions
          this.dialogStatus == 'create' ? this.createData() : this.updateData()
        } else {
          this.$message({
            type: 'warning',
            message: '有必填参数未填写完毕！'
          })
        }
      })
    },
    // 新建
    createData() {
      const params = {
        ...this.form,
        event_type_1: this.form.event_type[0] || '',
        event_type_2: this.form.event_type[1] || '',
        event_type_3: this.form.event_type[2] || '',
        event_type_4: this.form.event_type[3] || ''
      }
      delete params.event_type
      if (
        params.event_type_1 == '' &&
        params.source == '' &&
        params.report == '' &&
        params.discover == ''
      ) {
        this.$message({
          type: 'warning',
          message: '案件来源、案件分类、上报方式、发现方式必填一项！'
        })
        return
      }
      if (params.link_cards == '' && params.link_infos == '' && params.link_prints == '') {
        this.$message({
          type: 'warning',
          message: '案件卡片、案件详情、打印模板必填一项！'
        })
        return
      }
      this.loading = true
      createManageBusinesss(params)
        .then(() => {
          this.$message({
            messagge: '新增成功',
            type: 'success'
          })
          this.$emit('confirm-sure')
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 更新
    updateData() {
      const params = {
        ...this.form,
        event_type_1: this.form.event_type[0] || '',
        event_type_2: this.form.event_type[1] || '',
        event_type_3: this.form.event_type[2] || '',
        event_type_4: this.form.event_type[3] || ''
      }
      delete params.event_type
      this.loading = true
      editManageBusinesss(params)
        .then(() => {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.$emit('confirm-sure')
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-new {
  .add-parameters-btn {
    color: $blue;
    text-decoration: underline;
  }
  .add-params-item {
    display: flex;
    position: relative;
    margin-top: 20px;
    .add-index {
      position: absolute;
      left: -28px;
      top: 4px;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      background: $blue;
      color: $white;
      border-radius: 100%;
    }
  }
  .select-item {
    width: 100%;
  }
}
</style>
