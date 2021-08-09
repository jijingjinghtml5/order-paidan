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
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="字段名称" prop="name">
          <el-input
            v-model.trim="form.name"
            :disabled="dialogStatus == 'detail'"
            type="input"
            placeholder="请输入字段名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="字段code" prop="codeId">
          <el-input
            v-model.trim="form.code"
            disabled
            type="input"
            placeholder="自动生成，无需输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="标签" prop="ext" v-if="type == 12">
          <el-select v-model="form.ext" placeholder="请选择" :disabled="dialogStatus == 'detail'">
            <el-option
              v-for="item in $attrs.labelList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户备注" prop="description" v-if="showDsc">
          <el-input
            v-model.trim="form.description"
            type="input"
            :disabled="dialogStatus == 'detail'"
            placeholder="请输入描述"
            clearable
          />
        </el-form-item>
      </el-form>
    </global-dialog>
  </div>
</template>

<script>
import { createManageElement, editManageElementItem } from '@/api/case'

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
    type: {
      type: Number,
      default: 1
    },
    showDsc: {
      type: Boolean,
      default: false
    }
  },
  // computed: {},
  data() {
    return {
      loading: false,
      form: {},
      rules: {
        name: [{ required: true, message: '请输入字段名称', trigger: 'change' }],
        ext: [{ required: true, message: '请选择标签', trigger: 'change' }]
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
      } else {
        this.form = {
          name: '',
          description: '',
          ext: ''
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
        type: this.type,
        name: this.form.name,
        description: this.form.description,
        ext: this.form.ext
      }
      this.loading = true
      createManageElement(params)
        .then(() => {
          this.$message({
            message: '新增成功',
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
        id: this.form.id,
        name: this.form.name,
        description: this.form.description,
        ext: this.form.ext
      }
      this.loading = true
      editManageElementItem(params)
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
}
</style>
