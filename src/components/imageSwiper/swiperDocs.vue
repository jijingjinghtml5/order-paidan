<template>
  <el-dialog
    v-if="showDocs"
    v-dialogDrag
    custom-class="dialog_8vh map-dialog"
    :title="title"
    :close-on-click-modal="true"
    :append-to-body="true"
    :visible="showDocs"
    width="500px"
    @close="close"
  >
    <div class="content">
      <div v-for="(item, index) in docsList" :key="index" class="docs-list">
        <a href="javascript:;">
          <i class="el-icon-document" />
          <span style="margin-left: 8px">{{ item.name || item.url || item }}</span>
          <span class="download" @click="downloadAttach(item)">下载</span>
        </a>
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
    docsList: {
      type: Array,
      default: () => []
    },
    showDocs: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resourceHost: process.env.VUE_APP_ASSET_URL
    }
  },
  watch: {},
  mounted() {
    console.log(this.docsList, 'docsList')
  },
  methods: {
    downloadAttach(item) {
      window.open(`${this.resourceHost}/${item.url || item}`)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  .docs-list {
    line-height: 44px;
    display: flex;
    text-align: center;
    width: 100%;
    span {
      margin-right: 15px;
    }
    .download {
      color: #5b5bd5;
    }
  }
}
</style>
