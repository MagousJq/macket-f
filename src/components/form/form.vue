<template>
  <form>
    <slot />
  </form>
</template>
<script>
export default {
  name: 'IForm',
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>
<style scoped lang="less">
</style>
