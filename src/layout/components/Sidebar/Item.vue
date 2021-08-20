<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    path: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, value } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon iconClass={icon} className="icon" />)
    }

    if (value) {
      vnodes.push(
        <el-badge hidden={value == 0} max={99} value={value} class="item_menus">
          <span>{title}</span>
        </el-badge>
      )
    } else {
      vnodes.push(<span slot="title">{title}</span>)
    }
    return vnodes
  }
}
</script>

<style lang="scss" scoped>
.to-disable {
  color: rgba(204, 204, 204, 0.5) !important;
}

.icon {
  font-size: 20px;
  padding: 0 6px 0 0;
  filter: drop-shadow(#5b5bd5 80px 0);
  transform: translateX(-80px);
  transition: none;
}

.menu-wrapper {
  .el-menu {
    border: 0;
  }
}

.item_menus {
  .el-badge__content {
    top: 26px;
    right: -8px;
  }

  .el-badge__content {
    line-height: 16px;
    padding: 0 5px;
  }
}
</style>
