<template>
  <Menu
    class="layout-menu"
    :active-name="activeName"
    theme="dark"
    width="auto"
    :class="menuitemClasses"
  >
    <MenuItem
      name="buffCsgo"
      to="/buffCsgo"
    >
      <Icon type="logo-steam" />
      <span>BUFF-CSGO</span>
    </MenuItem>
    <MenuItem
      name="buffDota"
      to="/buffDota"
    >
      <Icon type="logo-steam" />
      <span>BUFF-DOTA2</span>
    </MenuItem>
    <MenuItem
      name="igxeCsgo"
      to="/igxeCsgo"
    >
      <Icon type="logo-steam" />
      <span>IGXE-CSGO</span>
    </MenuItem>
    <MenuItem
      name="igxeDota"
      to="/igxeDota"
    >
      <Icon type="logo-steam" />
      <span>IGXE-DOTA2</span>
    </MenuItem>
    <MenuItem
      name="chart"
      to="/chart"
    >
      <Icon type="md-trending-up" />
      <span>数据分析</span>
    </MenuItem>
    <MenuItem
      name="swiper"
      to="/swiper"
    >
      <Icon type="md-beer" />
      <span>轮播图demo</span>
    </MenuItem>
    <!-- <MenuItem name="/admin/charts" to="/admin/charts">
      <Icon to="/admin/charts" type="md-podium" />
      <span>图表管理</span>
    </MenuItem> -->
  </Menu>
</template>
<script>
export default {
  props: {
    menuitemClasses: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      activeName: ''
    }
  },
  watch: {
    '$route.name': {
      handler (val) {
        this.activeName = val
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style scoped lang="less">
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    padding-left: 5px;
    width: 110px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 18px;
  }
  .collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
</style>
