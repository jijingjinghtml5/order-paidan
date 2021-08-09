<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <div>案件编号：<span class="b">2106071710000001 </span></div>
        <div>案件来源：<span class="b">机动车占道 </span></div>
        <div>上报时间：<span>2021-06-07 16:00:59</span></div>
        <div></div>
      </div>
      <div class="detail-info">
        <div class="info-item">发现方式：自动发现</div>
        <div class="info-item">所属平台：松江区-九亭镇</div>
        <div class="info-item">所属网格：12060-上海虹西实业公司</div>
        <div class="info-item">案件阶段：发现</div>
        <div class="info-item">
          案件分类：事件-智能分析-机动车占道-机动车占道 发生地址：虬泾路大门主通道
        </div>
        <div class="info-item">发生地址：虬泾路大门主通道</div>
        <div class="info-item">上报方式：一般上报</div>
        <div class="info-item">上报人：蒋丹</div>
        <div class="info-item">案件状态：待受理</div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .b {
    color: #5b5bd5;
  }
}
.detail-info {
  font-size: 14px;
  .info-item {
    width: 25%;
    padding-right: 10px;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    float: left;
    line-height: 50px;
  }
}
</style>
