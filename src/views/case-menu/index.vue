<template>
  <div class="case-menu" v-loading="loading">
    <div class="case-menu-submit">
      <el-button type="primary" @click="onMenuSubmit">提交</el-button>
    </div>
    <div class="case-menu-content" style="display: flex">
      <!--菜单-->
      <config-tree
        ref="configTreeRef"
        draggable
        class="config-tree"
        :data="data"
        :current-node-key.sync="currentNodeKey"
        @node-click="nodeClick"
        @node-drop="handleDrop"
      >
        <template #title>
          <div class="title">
            <h4>页面菜单列表</h4>
            <i class="el-icon-plus" @click="addRootMenu"></i>
          </div>
        </template>
      </config-tree>
      <!--表单-->
      <el-form ref="form" :model="form" label-width="120px" class="form-menu" v-if="currentNodeKey">
        <el-form-item
          label="菜单名称"
          prop="name"
          :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
        >
          <el-input v-model.trim="form.name" type="input" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item
          label="菜单类型"
          prop="category"
          :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
        >
          <el-select v-model="form.category" placeholder="请选择" clearable style="width: 100%">
            <el-option label="状态列表" :value="'1'" />
            <el-option label="独立URL" :value="'2'" />
            <el-option label="流转中列表" :value="'3'" />
          </el-select>
        </el-form-item>
        <el-form-item
          key="1"
          v-if="form.category == 1"
          label="使用对象"
          prop="use_type"
          :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
        >
          <el-select v-model="form.use_type" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in useTypeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          key="2"
          v-if="form.category == 2"
          label="URL地址"
          prop="url"
          :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
        >
          <el-input v-model.trim="form.url" type="input" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item
          label="是否显示计数"
          prop="calcu"
          :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
        >
          <el-radio-group v-model="form.calcu">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'2'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标类型" prop="icon">
          <el-select
            clearable
            v-model="form.icon"
            placeholder="请选择"
            style="width: 100%"
            class="icon-select"
          >
            <template slot="prefix" v-if="form.icon">
              <svg-icon :icon-class="form.icon" class-name="icon" />
            </template>
            <el-option
              v-for="item in iconList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
              <svg-icon :icon-class="item.value" class-name="icon" />
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
      <div v-else class="form-menu form-empty">无匹配项</div>
    </div>
  </div>
</template>

<script>
import { getTreeItem, getFirstChild } from '@/utils/index'
import { setMenusConfig, getMenusConfig } from '@/api/case-menu'
import ConfigTree from '@/components/ConfigTree/index'

export default {
  name: 'Menu',
  components: {
    ConfigTree
  },
  data() {
    return {
      form: {}, // 当前表单
      data: [], // 菜单数据
      currentNodeKey: '', // 当前选中的key
      loading: false,
      useTypeList: [
        { label: '管理', value: '1' },
        { label: '行政区划', value: '2' },
        { label: '个人', value: '3' },
        { label: '督办', value: '4' }
      ],
      iconList: [
        { label: 'case', value: 'case' },
        { label: 'message', value: 'message' },
        { label: 'my', value: 'my' },
        { label: 'query', value: 'query' },
        { label: 'report', value: 'report' }
      ]
    }
  },
  watch: {
    async currentNodeKey(ext) {
      console.log(ext)
      // 等待一个nextTick 防止dom未创建
      await this.$nextTick()
      const tree = this.$refs.configTreeRef.$refs.tree
      if (ext && ext.toString()) {
        // 高亮一下
        tree.setCurrentKey(ext)
        const form = tree.getNode(ext).data
        // 给form表单赋值成当前选中的菜单项，并浅copy一下form，防止v-model影响
        this.form = { ...form }
        console.log('watch', this.form)
        if ((this.form.use_type == '0' || !this.form.use_type) && this.form.category == '1') {
          this.form.use_type = '2'
        }
      } else {
        tree.setCurrentKey(null)
      }
    }
  },
  created() {
    this.initMenu()
  },
  methods: {
    // 初始化data数据
    async initMenu() {
      this.loading = true
      const res = await getMenusConfig()
      this.loading = false
      this.data = res.response.data
      // 获取第一个最终节点，并高亮展示
      const firstChild = getFirstChild(res.response.data)
      if (firstChild) {
        this.currentNodeKey = firstChild.ext
      }
    },
    // 点击表单提交
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // 左侧菜单跟当前表单提交关联上，通过 currentNodeKey，getTreeItem递归
          console.log('submitform', this.form)
          this.data = getTreeItem(this.data, this.currentNodeKey, { ...this.form })
          await this.$nextTick()
          // 设置高亮，当表单提交之后，高亮会消失，再次高亮一下
          const tree = this.$refs.configTreeRef.$refs.tree
          tree.setCurrentKey(this.currentNodeKey)
          this.$message({
            type: 'success',
            message: '当前表单保存成功'
          })
        } else {
          this.$message({
            type: 'warning',
            message: '当前表单有必填参数未填写完毕！'
          })
          return false
        }
      })
    },
    // 点击重置
    onReset() {
      // 通过 currentNodeKey 重置到左侧菜单一致
      const tree = this.$refs.configTreeRef.$refs.tree
      const form = tree.getNode(this.currentNodeKey).data
      this.form = { ...form }
    },
    // 拖拽成功的回调，拖拽会导致高亮失效，重新高亮一下
    handleDrop() {
      const tree = this.$refs.configTreeRef.$refs.tree
      tree.setCurrentKey(this.currentNodeKey)
    },
    // 新增菜单根节点
    async addRootMenu() {
      const ext = new Date().getTime().toString()
      this.data.push({ name: '菜单', category: '1', calcu: '2', ext, icon: '' })
      this.currentNodeKey = ext
    },
    // 点击菜单，改变下当前currentNodeKey就行
    nodeClick(data) {
      this.currentNodeKey = data.ext
    },
    // 提交到后端
    async onMenuSubmit() {
      this.$confirm('确定提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          console.log(this.data)
          this.loading = true
          const res = await setMenusConfig({ data: JSON.stringify(this.data) })
          this.loading = false
          if (res.status === 0) {
            this.$message({
              type: 'error',
              message: res.errors.msg || '提交失败!'
            })
          } else {
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.case-menu {
  height: 100%;
  @include boxShadow(0.08);
  .case-menu-submit {
    padding: 10px 16px;
    text-align: right;
    background: $white;
    border-bottom: 1px solid $borderColor;
  }
  .case-menu-content {
    max-height: calc(100vh - 138px);
    height: calc(100vh - 138px);
  }
  .config-tree {
    background: $bgwhite;
    margin-right: 17px;
    min-width: 200px;
    border-right: 1px solid $borderColor;
    .title {
      display: flex;
      padding: 0 16px;
      border-bottom: 1px solid $borderColor;
      h4 {
        flex: 1;
      }
      i {
        cursor: pointer;
        line-height: 40px;
      }
    }
  }
  .form-menu {
    max-height: calc(100vh - 138px);
    background: $bgwhite;
    flex: 1;
    padding: 64px 150px;
    border-radius: 4px;
    overflow: auto;
    @include scrollBar;
  }
  .form-empty {
    text-align: center;
    color: $wordcolor4;
  }
}
::v-deep .icon-select .el-input__inner {
  color: transparent;
}
::v-deep .el-input__prefix {
  left: 15px;
}
</style>
