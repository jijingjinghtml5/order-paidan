<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        @select="select"
      >
        <!-- <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        /> -->
        <template v-for="route in menus">
          <sidebar-item v-if="!route.hidden" :key="route.id" :item="route" :base-path="route.id" />
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'
import Logo from './Logo'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['menus', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      console.log(route, 'route')
      // if set path, the sidebar will highlight the path you set
      if (route.name === 'case-detail-new') {
        return route.query.type
      }
      if (route.params && route.params.id) {
        return route.params.id
      }
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    // 点击菜单
    select(name) {
      if (!Number.isNaN(Number(name))) {
        this.$router.push({
          path: `/list/${name}`
        })
      } else {
        this.$router.push({
          path: name
        })
      }
    }
  }
}
</script>
