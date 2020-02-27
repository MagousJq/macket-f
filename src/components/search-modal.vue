<template>
  <Modal
    v-model="modal"
    title="请输入你想要的筛选项"
    draggable
    @on-ok="handleOk"
    @on-cancel="handleCancle"
  >
    <Form
      ref="form"
      :model="form"
      :label-width="90"
    >
      <FormItem label="物品名称">
        <Input
          v-model="form.name"
          style="width:90%"
          type="text"
          placeholder="输入物品名称关键字即可"
        /></Input>
      </FormItem>
      <FormItem label="buff最低价格">
        <InputNumber
          v-model="form.minPrice"
          :step="0.1"
          :min="0"
        />
      </FormItem>
      <FormItem label="buff最高价格">
        <InputNumber
          v-model="form.maxPrice"
          :step="0.1"
          :min="0"
        />
      </FormItem>
      <FormItem label="在售最小数目">
        <InputNumber
          v-model="form.sellNum"
          :step="1"
          :min="1"
        />
      </FormItem>
      <FormItem>
        <RadioGroup v-model="form.searchWay">
          <Radio label="查找可买" />
          <Radio label="差价利用" />
        </RadioGroup>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
export default {
  props: {
    isModalShow: Boolean
  },
  data () {
    return {
      form: {
        name: '',
        minPrice: 0.3,
        maxPrice: 40,
        sellNum: 1,
        searchWay: '差价利用'
      },
      modal: false
    }
  },
  watch: {
    isModalShow (val) {
      this.modal = val
    }
  },
  methods: {
    handleOk () {
      this.$emit('handleSearch', this.form)
    },
    handleCancle () {
      this.$emit('handleCancle')
    }
  }
}
</script>

<style scoped lang="less">
</style>
