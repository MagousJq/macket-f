<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <div>
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'IFormItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    }
  }
}
</script>
