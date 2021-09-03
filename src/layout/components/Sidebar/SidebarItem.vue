<template>
  <el-menu-item
    v-if="
      hasOneShowingChild(item.children, item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
      !item.alwaysShow
    "
    :index="item.category == 1 ? item.id : item.url"
    :class="{ 'submenu-title-noDropdown': !isNest }"
  >
    <Item
      :icon="onlyOneChild.icon || item.icon"
      :title="onlyOneChild.name"
      :value="onlyOneChild.calcu == 1 ? onlyOneChild.count : 0"
      :path="basePath"
    />
  </el-menu-item>

  <el-submenu v-else ref="subMenu" :index="item.id" popper-append-to-body>
    <template slot="title">
      <Item
        v-if="item"
        :icon="item.icon"
        :value="item.calcu == 1 ? item.count : 0"
        :title="item.name"
      />
    </template>
    <template v-for="child in item.children">
      <sidebar-item
        v-if="!child.hidden"
        :key="child.id"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child)"
        class="nest-menu"
      />
    </template>
  </el-submenu>
</template>

<script>
// import path from 'path'
import Item from './Item'

export default {
  name: 'SidebarItem',
  components: { Item },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(item) {
      if (item.category == 2) {
        return item.url
      }
      return `/list/${item.id}`
    }
  }
}
</script>
