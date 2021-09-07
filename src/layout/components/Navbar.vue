<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>
      <Info />
      <News />
      <!-- {{ userInfo.name }}
      <span>
        {{ userInfo.districtName || '上海市' }}
        {{ userInfo.streetName && userInfo.streetName != '0' ? ' / ' + userInfo.streetName : '' }}
        {{ userInfo.departmentName.length ? ' / ' + userInfo.departmentName[0] : '' }}
      </span> -->
      <el-button
        type="text"
        icon="el-icon-setting"
        class="right-menu-item hover-effect"
        @click="settingVisible = true"
      />
      <el-button
        class="right-menu-item hover-effect"
        type="text"
        icon="el-icon-switch-button"
        @click="logout"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Base/Breadcrumb'
import Hamburger from '@/components/Base/Hamburger'
import Info from './RightBar/Info'
import News from './RightBar/News'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Info,
    News
    // ErrorLog,
    // Screenfull,
    // SizeSelect,
    // Search
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device', 'userInfo'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: $white;
  box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.1);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    color: $white;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    // height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 16px;
      color: $subColor;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.person_wrap {
  padding: 0;
  .person_pabel {
    width: 300px;
    .person_avatar {
      height: 110px;
      border-radius: 4px 4px 0 0;
      background-color: #5b5bd5;
      .fl,
      .fr {
        height: 100%;
      }
      .fl {
        width: 100px;
        .person_avatar_img {
          width: 70px;
          height: 70px;
          background-color: #ffffff;
          border-radius: 50%;
          margin: 20px auto;
        }
      }
      .fr {
        width: calc(100% - 100px);
        padding: 15px 0;
        line-height: 40px;
        color: #ffffff;
        .person_avatar_name {
          font-size: 20px;
          font-weight: bold;
          padding-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .person_avatar_identy {
          padding-right: 10px;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .person_info {
      // border: 1px solid #dee0e3;
      // border-top: none;
      .el-dropdown-menu__item {
        font-size: 16px;
        line-height: 50px;
        &:last-child {
          border-top: 1px solid #dee0e3;
        }
      }
    }
  }
  .popper__arrow::after {
    border-bottom-color: #5b5bd5 !important;
  }
}
</style>
