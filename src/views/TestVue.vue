<template>
  <div class="content">
    <div
      ref="noprintcnt"
      class="noprint"
    >
      <Button @click="print()">
        打印
      </Button>
      xxxxxxxxxxx
    </div>
    <div
      ref="printcnt"
      :class="{'show': show}"
      class="printcnt"
    >
      <div
        ref="page1"
        style="page-break-after:always;break-after: page;"
      >
        <Form
          v-for="item in [1,2,3,4,5,6]"
          :key="item"
          ref="formValidate"
          :model="formValidate"
          :label-width="80"
        >
          <FormItem
            label="Name"
            prop="name"
          >
            <Input
              v-model="formValidate.name"
              placeholder="Enter your name"
            /></Input>
          </FormItem>
          <FormItem
            label="E-mail"
            prop="mail"
          >
            <Input
              v-model="formValidate.mail"
              placeholder="Enter your e-mail"
            /></Input>
          </FormItem>
          <FormItem
            label="City"
            prop="city"
          >
            <Select
              v-model="formValidate.city"
              placeholder="Select your city"
            >
              <Option value="beijing">
                New York
              </Option>
              <Option value="shanghai">
                London
              </Option>
              <Option value="shenzhen">
                Sydney
              </Option>
            </Select>
          </FormItem>
          <div
            v-if="item === 1"
            style="display: inline-block;"
          >
            <img
              v-for="node in imgArr"
              :key="node"
              style="display: inline-block;width: 200px;height: auto;"
              :src="node"
              alt="大图"
            >
          </div>
          <FormItem label="Date">
            <Row>
              <Col span="11" />
              <FormItem prop="date">
                <DatePicker
                  v-model="formValidate.date"
                  type="date"
                  placeholder="Select date"
                />
              </FormItem>
              </Col>
              <Col
                span="2"
                style="text-align: center"
              />-</Col>
              <Col span="11" />
              <FormItem prop="time">
                <TimePicker
                  v-model="formValidate.time"
                  type="time"
                  placeholder="Select time"
                />
              </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem
            label="Gender"
            prop="gender"
          >
            <RadioGroup v-model="formValidate.gender">
              <Radio label="male">
                Male
              </Radio>
              <Radio label="female">
                Female
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            label="Hobby"
            prop="interest"
          >
            <CheckboxGroup v-model="formValidate.interest">
              <Checkbox label="Eat" />
              <Checkbox label="Sleep" />
              <Checkbox label="Run" />
              <Checkbox label="Movie" />
            </CheckboxGroup>
          </FormItem>
          <FormItem
            label="Desc"
            prop="desc"
          >
            <Input
              v-model="formValidate.desc"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="Enter something..."
            /></Input>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="handleSubmit('formValidate')"
            >
              Submit
            </Button>
            <Button
              style="margin-left: 8px"
              @click="handleReset('formValidate')"
            >
              Reset
            </Button>
          </FormItem>
        </Form>
      </div>
      <div
        ref="page2"
        style="page-break-after:always;break-after: page;"
      >
        报告单2
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      interval: '',
      show: true,
      imgArr: ['https://cdn.pixabay.com/photo/2019/09/13/14/31/elephant-4474027_1280.jpg', 'https://cdn.pixabay.com/photo/2018/11/17/16/33/forest-3821416_1280.jpg', 'https://cdn.pixabay.com/photo/2019/09/20/09/36/edinburgh-4491305_1280.jpg', 'https://cdn.pixabay.com/photo/2018/09/03/11/52/autumn-3651043_1280.png'],
      formValidate: {
        name: '',
        mail: '',
        city: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
      }
    }
  },
  mounted () {

  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    print () {
      this.show = false
      this.$nextTick(() => {
        window.WaterMark.clear()
        window.WaterMark.mark({
          text: '江前江前江前江前江前',
          zIndex: 9999
        })
        this.interval = setInterval(() => {
          let imgDom = document.getElementsByTagName('img')
          let imgLen = imgDom.length
          let imgStart = 0
          for (let i = 0; i < imgLen; i++) {
            if (imgDom[i].complete) {
              imgStart++
              if (imgStart === imgLen) {
                window.print()
                clearInterval(this.interval)
              }
            }
          }
        }, 500)
        this.show = true
      })
    },
    /**
   * 获取DPI
   * @returns {Array}
   */
    conversion_getDPI () {
      var arrDPI = []
      if (window.screen.deviceXDPI) {
        arrDPI[0] = window.screen.deviceXDPI
        arrDPI[1] = window.screen.deviceYDPI
      } else {
        var tmpNode = document.createElement('DIV')
        tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
        document.body.appendChild(tmpNode)
        arrDPI[0] = parseInt(tmpNode.offsetWidth)
        arrDPI[1] = parseInt(tmpNode.offsetHeight)
        tmpNode.parentNode.removeChild(tmpNode)
      }
      return arrDPI
    }
  }
}
</script>
<style scoped lang="less">
// 要打印的div 隐藏
.printcnt{
  visibility: hidden;
}
.show{
  display: none;
}

@media print {
  @page {
    margin: 0;
  }
  body {
    position: relative;
    margin: 4cm;
  }
  // 不要打印的div隐藏
  .noprint{
    display: none;
  }
  // 要打印的div显示
  .printcnt{
    display: block;
    visibility: visible;
  }
}
</style>
