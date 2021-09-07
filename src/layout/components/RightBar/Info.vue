<template>
  <!-- 个人信息 -->
  <el-dropdown class="dropdown_userinfo" trigger="click" placement="top-start">
    <span class="el-dropdown-link">
      {{ userInfo.name }}
      <i class="el-icon-arrow-down el-icon--right" />
    </span>
    <el-dropdown-menu slot="dropdown" size="medium" class="person_wrap">
      <div class="person_pabel">
        <div class="person_avatar clearfix">
          <div class="fl">
            <div class="person_avatar_img" style="text-align: center">
              <i class="el-icon-user-solid" style="font-size: 60px; color: #9e9e9e" />
            </div>
          </div>
          <div class="fr">
            <div class="person_avatar_name">
              {{ userInfo.name }}
            </div>
            <div class="person_avatar_identy">
              {{ userInfo.districtName || '上海市' }}
              {{
                userInfo.streetName && userInfo.streetName != '0' ? ' / ' + userInfo.streetName : ''
              }}
              {{
                userInfo.departmentName && userInfo.departmentName.length
                  ? ' / ' + userInfo.departmentName.join(',')
                  : ''
              }}
            </div>
          </div>
        </div>
        <div class="person_info">
          <!-- @click.native="personal()" -->
          <el-dropdown-item>
            <span>个人中心</span>
            <i class="el-icon-arrow-right fr" style="font-size: 24px; line-height: 50px" />
          </el-dropdown-item>
        </div>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['userInfo'])
  }
}
</script>

<style scoped lang="scss">
.dropdown_userinfo {
  margin-right: 10px;
}
</style>
