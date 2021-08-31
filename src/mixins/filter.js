export default {
  methods: {
    /**
     * 为element-ui的Select和Cascader添加弹层底部操作按钮
     * @param visible
     * @param refName  设定的ref名称
     * @param onClick  底部操作按钮点击监听
     */
    visibleChange(visible, refName, onClickAll, onclickInvert) {
      if (visible) {
        const ref = this.$refs[refName]
        let popper = ref.$refs.popper
        if (popper.$el) popper = popper.$el
        if (!Array.from(popper.children).some((v) => v.className === 'el-select-dropdown__list')) {
          const el = document.createElement('ul')
          el.className = 'el-select-dropdown__list'
          el.style =
            'border-top: solid 1px #E4E7ED; padding:0; color: #606266;text-align:right;height:38px;line-height: 38px;'
          const btn1 = document.createElement('button')
          btn1.className = 'el-button el-button--primary el-button--mini'
          btn1.innerHTML = '全选'

          const btn2 = document.createElement('button')
          btn2.className = 'el-button el-button--primary el-button--mini'
          btn2.innerHTML = '反选'

          el.appendChild(btn1)
          el.appendChild(btn2)

          // el.innerHTML = `${btn1}${btn2}`
          popper.appendChild(el)
          btn1.onclick = () => {
            // 底部按钮的点击事件 点击后想触发的逻辑也可以直接写在这
            if (typeof onClickAll === 'function') {
              onClickAll()
            }
            // 以下代码实现点击后弹层隐藏 不需要可以删掉
            // if (ref.toggleDropDownVisible) {
            //   ref.toggleDropDownVisible(false);
            // } else {
            //   ref.visible = false;
            // }
          }
          btn2.onclick = () => {
            // 底部按钮的点击事件 点击后想触发的逻辑也可以直接写在这
            if (typeof onclickInvert === 'function') {
              onclickInvert()
            }
            // 以下代码实现点击后弹层隐藏 不需要可以删掉
            // if (ref.toggleDropDownVisible) {
            //   ref.toggleDropDownVisible(false);
            // } else {
            //   ref.visible = false;
            // }
          }
        }
      }
    }
  }
}
