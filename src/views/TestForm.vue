<template>
  <div>
    <i-form
      :model="formValidate"
      :rules="ruleValidate"
    >
      <i-form-item
        label="用户名"
        prop="name"
      >
        <Input
          v-model="formValidate.name"
          style="width:40%"
          type="text"
          placeholder="输入物品名称关键字即可"
        /></Input>
      </i-form-item>
      <i-form-item
        label="邮箱"
        prop="mail"
      >
        <Input
          v-model="formValidate.mail"
          style="width:40%"
          type="text"
          placeholder="输入物品名称关键字即可"
        /></Input>
      </i-form-item>
    </i-form>
  </div>
</template>
<script>
import iForm from '../components/form/form.vue'
import iFormItem from '../components/form/form-item.vue'

export default {
  components: { iForm, iFormItem },
  data () {
    return {
      formValidate: {
        name: '',
        mail: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>
