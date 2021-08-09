<template>
  <div class="print-detail">
    <el-card shadow="always">
      <h1 class="title">网格化管理案件信息表</h1>
      <div class="table-content">
        <div class="tabel-desc">
          <div class="left">制表人：superadmin</div>
          <div class="right">制表时间：2021年06月08日 09:10</div>
        </div>
        <table border="1" class="table">
          <tr>
            <td class="title">案件编号</td>
            <td>2106070200000002</td>
            <td class="title">上报时间</td>
            <td>2021-06-07 18:03:43</td>
          </tr>
          <tr>
            <td class="title">案件分类</td>
            <td>建筑工地-项目手续-未办理项目信息报送</td>
            <td class="title">案件名称</td>
            <td>未办理项目信息报送</td>
          </tr>
          <tr>
            <td class="title">案件来源</td>
            <td>燃气安全</td>
            <td class="title">发现方式</td>
            <td>主动发现</td>
          </tr>
          <tr>
            <td class="title">所属区县</td>
            <td>崇明区</td>
            <td class="title">所属街道</td>
            <td>xxxzz</td>
          </tr>
          <tr>
            <td class="title">居村委会</td>
            <td>xxxx</td>
            <td class="title">所属网格</td>
            <td>xxxxx</td>
          </tr>
          <tr>
            <td class="title">详细地址</td>
            <td colspan="3">上海市徐汇区小木桥路683号</td>
          </tr>
          <tr>
            <td class="title">案件描述</td>
            <td colspan="3">测试案件</td>
          </tr>
        </table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.print-detail {
  width: 90%;
  margin: 0 auto;
  .title {
    font-weight: 600;
    text-align: center;
    padding: 20px 0;
    font-size: 20px;
  }

  .table-content {
    .tabel-desc {
      width: 100%;
      padding: 10px 0 5px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .table {
      border: 1px solid #666;
      width: 100%;
      tr {
        border-bottom: 1px solid #666;
        td {
          text-align: left;
          padding: 8px 12px;
          border-right: 1px solid #666;
          font-size: 14px;
          &.title {
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
