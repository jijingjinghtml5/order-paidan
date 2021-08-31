<template>
  <el-dialog
    v-if="showCoop"
    v-dialogDrag
    custom-class="dialog_8vh map-dialog"
    :title="title"
    :close-on-click-modal="true"
    :append-to-body="true"
    :visible="showCoop"
    width="70%"
    @close="close"
  >
    <div class="content">
      <div class="title">
        <p>流转时间</p>
        <p>流转人员</p>
        <p>流转部门</p>
        <p>流转意见</p>
      </div>
      <div v-for="(item, index) in coopList" :key="index" class="info">
        <p>协办{{ index + 1 }}</p>
        <p>{{ item.time }}</p>
        <p>{{ item.userName }}</p>
        <p
          v-if="
            `上海市${item.districtName ? `-${item.districtName}` : ''}${
              item.streetName ? `-${item.streetName}` : ''
            }${item.departmentName ? `-${item.departmentName}` : ''}`.length <= 20
          "
        >
          {{
            `上海市${item.districtName ? `-${item.districtName}` : ''}${
              item.streetName ? `-${item.streetName}` : ''
            }${item.departmentName ? `-${item.departmentName}` : ''}`
          }}
        </p>
        <el-tooltip
          v-else
          class="item"
          effect="dark"
          :content="`上海市${item.districtName ? `-${item.districtName}` : ''}${
            item.streetName ? `-${item.streetName}` : ''
          }${item.departmentName ? `-${item.departmentName}` : ''}`"
          placement="top-start"
        >
          <p>
            {{
              `上海市${item.districtName ? `-${item.districtName}` : ''}${
                item.streetName ? `-${item.streetName}` : ''
              }${item.departmentName ? `-${item.departmentName}` : ''}`.slice(0, 20)
            }}...
          </p>
        </el-tooltip>
        <p v-if="item.desc.length <= 20">{{ item.desc }}</p>
        <el-tooltip v-else class="item" effect="dark" :content="item.desc" placement="top-start">
          <p>{{ item.desc.slice(0, 20) }}...</p>
        </el-tooltip>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    coopList: {
      type: Array,
      default: () => {}
    },
    showCoop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currIndex: 0
    }
  },
  watch: {},
  mounted() {},
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  display: flex;
  .title {
    margin: 41px 24px 0 20px;
    p {
      color: #424754;
      font-weight: bold;
      line-height: 41px;
    }
  }
  .info {
    margin-right: 32px;
    p {
      color: #5e6470;
      line-height: 40px;
      border-bottom: 1px dashed rgba(91, 91, 213, 0.1);
    }
  }
}
</style>
