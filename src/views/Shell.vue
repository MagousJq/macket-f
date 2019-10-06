<template>
  <div class="layout">
    <Layout>
      <Sider
        ref="side"
        v-model="isCollapsed"
        hide-trigger
        collapsible
        :collapsed-width="78"
      >
        <sider-menu :menuitem-classes="menuitemClasses" />
      </Sider>
      <Layout>
        <Header class="layout-header-bar">
          <Col span="8" /><i
            class="ivu-icon ivu-icon-md-menu"
            type="navicon-round"
            :class="rotateIcon"
            @click="collapsedSider"
          /></Col>
        </Header>
        <Content class="layout-content">
          <transition
            name="slide-fade"
            mode="out-in"
          >
            <router-view />
          </transition>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import SiderMenu from '../components/sidebar.vue'
export default {
  components: {
    SiderMenu
  },
  data () {
    return {
      isCollapsed: false
    }
  },
  computed: {
    rotateIcon () {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    },
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  created () {
  },
  methods: {
    collapsedSider () {
      this.$refs.side.toggleCollapse()
    }
  }
}
</script>
<style scoped lang='less'>
  @head-height: 64px;
  .layout{
    background: #f5f7f9;
    position: relative;
    overflow: hidden;
    &-menu{
      height: 100vh;
    }
    &-header-bar{
      height: @head-height;
      padding: 0 40px 0 0;
      background: #fff;
      box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    &-username{
      cursor: pointer;
      font-weight: bold;
      vertical-align: middle;
      font-size: 14px;
      padding:0 10px;
      border-right: 1px solid;
    }
    &-logout{
      cursor: pointer;
      color: rgb(81,90,110);
      vertical-align: middle;
      font-size: 14px;
      padding:0 10px;
      &:hover{
        color: rgb(45,140,240);
      }
    }
    &-content{
      height: calc(100vh - @head-height);
      overflow: auto;
      padding: 20px;
      background: '#fff';
    }
    .menu-icon{
      font-size: 26px;
      margin: 0 20px;
      cursor: pointer;
      transition: all .3s;
    }
    .rotate-icon{
      cursor: pointer;
      margin: 0 20px;
      font-size: 26px;
      transform: rotate(-90deg);
    }
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
      transition: all .3s ease;
    }
    .slide-fade-leave-active {
      transition: all .3s ease;
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
      // transform: translateX(400px);
      transform: translateY(-100px);
      opacity: 0;
    }
  }
</style>
