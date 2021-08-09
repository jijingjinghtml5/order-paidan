<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="header">
        <div>案件编号：<span class="b">2106071710000001 </span></div>
      </div>
      <h1 class="detail-title">案件基础信息</h1>
      <div class="detail-info">
        <div class="info-item">案件分类：事件-住宅小区综合治理-擅自搭建建筑物、构筑物</div>
        <div class="info-item">案件名称：擅自搭建建筑物、构筑物</div>
        <div class="info-item">案件来源：物业管理</div>
        <div class="info-item">发现方式：主动发现</div>
        <div class="info-item">上报方式：一般上报</div>
        <div class="info-item">上报时间：2021-06-07 17:00:04</div>
        <div class="info-item">上报人：superadmin</div>
        <div class="info-item">所属区镇：杨浦区</div>
        <div class="info-item">所属街镇：四平路街道</div>
        <div class="info-item">所属居委：xxxx</div>
        <div class="info-item">所属网格：10013</div>
        <div class="info-item">小区名称：xxxx</div>
        <div class="info-item">相关街道：xxxx</div>
      </div>
    </el-card>
    <el-card shadow="never">
      <h1 class="detail-title">案件描述信息</h1>
      <div class="detail-info">
        <div class="info-item">案件描述：测试一下下哦</div>
        <div class="info-item">案件地址： 鞍山路40号底层店铺[ 查看 ]</div>
        <div class="info-item">上报图片：4张[ 查看 ]</div>
        <div class="info-item">上报音频：xxxx</div>
        <div class="info-item">上报视频：xxxx</div>
        <div class="info-item">上报文件：xxxx</div>
      </div>
    </el-card>
    <el-card shadow="never">
      <h1 class="detail-title">案件流转信息</h1>
      <div class="step-wrap">
        <ul class="step">
          <li
            :class="['step-item', stepActive >= index && 'active']"
            v-for="(item, index) in stepList"
            :key="index"
          >
            <span class="step-circle">
              <b class="inner">
                {{ item.name }}
              </b>
            </span>
            <span class="arrow"></span>
          </li>
        </ul>
      </div>
      <div class="circulation">
        <p class="item"><b>流转时间</b></p>
        <p class="item"><b>流转人员</b></p>
        <p class="item"><b>流转部门</b></p>
        <p class="item"><b>流转意见</b></p>
      </div>
    </el-card>
    <el-card shadow="never">
      <h1 class="detail-title">案件流转过程</h1>
      <div class="circulation process">
        <p class="item">2021-06-07 18:06:08</p>
        <p class="item"><b>操作名称：</b>xxxx</p>
        <p class="item"><b>操作员：</b>superadmin</p>
        <p class="item"><b>案件状态：</b>上报 > 待受理</p>
        <p class="item"><b>案件流转：</b>崇明区 /上报 > 崇明区 /案件发现--待受理</p>
        <p class="item"><b>案件描述：</b>测试案件</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stepList: [
        {
          name: '发现'
        },
        {
          name: '立案'
        },
        {
          name: '派遣'
        },
        {
          name: '处置'
        },
        {
          name: '核查'
        },
        {
          name: '结案'
        }
      ],
      stepActive: 1
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  .b {
    color: #5b5bd5;
  }
}
.detail-title {
  font-weight: bold;
  border-left: 4px solid rgb(91, 91, 213);
  padding-left: 10px;
  font-size: 15px;
}
.detail-info {
  font-size: 14px;
  margin-top: 10px;
  padding-left: 14px;
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
.step {
  padding-left: 14px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 10px;
  width: 1000px;
  .step-item {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 16.6%;
    &:last-of-type {
      .arrow {
        visibility: hidden;
      }
    }
    &.active {
      .step-circle {
        .inner {
          color: #fff;
          background: #5b5bd5;
          border: 1px solid #666;
        }
      }
    }
    .step-circle {
      display: inline-block;
      width: 62px;
      height: 62px;
      border: 1px solid #666;
      border-radius: 50%;
      text-align: center;
      position: relative;
      .inner {
        display: inline-block;
        width: 46px;
        position: absolute;
        height: 46px;
        line-height: 46px;
        font-size: 13px;
        border-radius: 50%;
        left: 7px;
        top: 7px;
      }
    }
    .arrow {
      // line-height: 50px;
      display: inline-block;
      border-bottom: 2px dashed #afbacb;
      width: 60px;
      position: relative;

      &::after {
        content: '>';
        position: absolute;
        right: -12px;
        top: -7px;
        font-size: 18px;
        color: #afbacb;
      }
    }
  }
}
.circulation {
  padding-left: 14px;
  font-size: 14px;
  margin-top: 10px;
  .item {
    line-height: 30px;
  }
}
.process {
  padding-left: 30px;
  position: relative;
  &::before {
    content: '';
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #5b5bd5;
    position: absolute;
    left: 3px;
    top: 8px;
  }
}
</style>
