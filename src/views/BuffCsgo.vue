<template>
  <div class="contain">
    <Table
      :loading="loading"
      :height="tableHeight"
      stripe
      draggable
      border
      :columns="columns"
      :data="buffData"
    >
      <div
        slot="header"
        class="contain__table-header"
      >
        <Button
          class="contain__store"
          type="primary"
          :disabled="isRequesting"
          @click="handleStore"
        >
          导一把
        </Button>
        <Button
          class="contain__store"
          :disabled="isRequesting"
          @click="handleValidIP"
        >
          校验代理IP
        </Button>
        <Button
          class="contain__store"
          :disabled="isRequesting"
          @click="handleValidSession"
        >
          校验SESSION
        </Button>
        <span
          v-show="time"
          class="contain__time"
        >
          {{ '导入时间：' + time }}
        </span>
        <Button
          class="contain__buy"
          type="primary"
          @click="handleOpenQuery"
        >
          高级筛选
        </Button>
        <Button
          class="contain__buy"
          type="primary"
          @click="() => handleCanBuy({})"
        >
          查询可买
        </Button>
        <Button
          class="contain__buy"
          type="primary"
          :disabled="buffData.length === 0 || disabled"
          @click="handleGetSteamPrice"
        >
          Steam求购价
        </Button>
        <!-- <Button
          class="contain__buy"
          type="primary"
          :disabled="storeDisabled"
          @click="handleGetAva"
        >
          载入刀均价
        </Button> -->
        <!-- <Button
          class="cont ain__buy"
          type="primary"
          :disabled="buyDisabled"
          @click="handleGetAvaList"
        >
          查询刀可买
        </Button> -->
        <Button
          class="contain__sell"
          type="primary"
          @click="handleCanSell"
        >
          查询可卖
        </Button>
      </div>
    </Table>
    <search-modal
      :is-modal-show="isModalShow"
      :form="form"
      @handleCancle="handleCancle"
      @handleSearch="handleSearch"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ClipboardJS from 'clipboard'
import searchModal from '@/components/search-modal.vue'
import Util from '@/utils'
export default {
  components: {
    searchModal
  },
  data () {
    return {
      loading: false,
      isRequesting: false,
      isModalShow: false,
      storeDisabled: false,
      form: {
        name: '',
        minPrice: 0.18,
        maxPrice: 100,
        sellNum: 1
      },
      columns: [{
        title: '序号',
        key: 'id',
        width: 75,
        align: 'center',
        render: (h, obj) => {
          return (<div>
            {obj.index + 1}
          </div>)
        }
      }, {
        title: '物品名称',
        key: 'goodsName',
        align: 'center',
        render: (h, obj) => {
          let href = `https://buff.163.com/market/goods?goods_id=${obj.row.buffId}&from=market#tab=selling`
          return (<div>
            <a href={href} target="_blank">
              <input id={'copy' + obj.row.buffId} style={{ position: 'fixed', top: '-2000px' }} value={obj.row.goodsName} />
              <span style={{ cursor: 'pointer', color: '#36cfc9' }} class="btn-clip" data-clipboard-target={'#copy' + obj.row.buffId}>{obj.row.goodsName}</span>
            </a>
          </div>)
        }
      },
      {
        title: 'buff售价',
        key: 'buffMinPrice',
        align: 'center',
        render: (h, obj) => {
          let hrefSteam = obj.row.steamMarketUrl
          return (
            <div className="opt-div">
              <a href={hrefSteam} target="_blank">{obj.row.buffMinPrice}</a>
            </div>)
        },
        sortable: true
      },
      {
        title: 'buff求购价',
        key: 'buffBuyPrice',
        align: 'center',
        sortable: true
      },
      {
        title: 'steam求购价',
        key: 'steamBuyPrice',
        align: 'center',
        render: (h, obj) => {
          let steamBuyPrice = obj.row.steamBuyPrice
          return (
            <div>
              { steamBuyPrice ? steamBuyPrice + '(' + (parseFloat(steamBuyPrice) * 0.875).toFixed(2) + ')' : '' }
            </div>)
        },
        sortable: true
      },
      {
        title: 'steam售价',
        key: 'steamMinPrice',
        align: 'center',
        sortable: true
      },
      {
        title: 'igxe售价',
        key: 'igxeMinPrice',
        align: 'center',
        sortable: true
      },
      {
        title: '当前在售量',
        key: 'sellNum',
        align: 'center',
        sortable: true
      },
      {
        title: '刀均价',
        key: 'avaPrice',
        align: 'center',
        sortable: true,
        render: (h, obj) => {
          // let exp = parseFloat(obj.row.avaPrice) - parseFloat(obj.row.buffMinPrice)
          let win = (parseFloat(obj.row.avaPrice) * 0.975 - parseFloat(obj.row.buffMinPrice)).toFixed(2)
          return (<div>{obj.row.avaPrice}<span style="color: rgb(54, 207, 201)">{'(' + win + ')'}</span></div>)
        }
      },
      {
        title: '操作',
        key: 'id',
        width: 180,
        align: 'center',
        render: (h, obj) => {
          let hrefIgxe = `https://www.igxe.cn/csgo/730?keyword=${obj.row.goodsName}`
          let href = `https://buff.163.com/market/goods?goods_id=${obj.row.buffId}&from=market#tab=selling`
          let hrefSteam = obj.row.steamMarketUrl
          return (
            <div className="opt-div">
              <a href={hrefIgxe} target="_blank">去igxe </a>
              <a href={href} target="_blank">去buff </a>
              <a href={hrefSteam} target="_blank">去steam</a>
            </div>)
        }
      }],
      buffData: [],
      allTime: 0,
      count: 0,
      percent: 0,
      tableHeight: 300,
      disabled: false,
      buyDisabled: false
    }
  },
  computed: {
    time: function () {
      return this.buffData[0] ? Util.formatDate(this.buffData[0].time) : ''
    }
  },
  created () {
    // 配置提示框
    this.$Message.config({
      duration: 3
    })
    this.$Notice.config({
      top: 20,
      duration: 0
    })
  },
  mounted () {
    // 复制事件
    let clipboard = new ClipboardJS('.btn-clip')
    clipboard.on('success', function (e) {
      e.clearSelection()
    })
    clipboard.on('error', function () {})
    this.setTableHeight()
  },
  destroyed () {
    this.$Notice.destroy()
  },
  methods: {
    ...mapActions([
      'CsgoCanBuy',
      'CsgoCanSell',
      'CsgoStore',
      'PostSteamPrice',
      'CsgoGetAavKnife',
      'CsgoBuyAavKnife',
      'validSession',
      'validIp'
    ]),
    /**
     * 设置表格高度 js控制自适应
     */
    setTableHeight () {
      let windowHeight = window.innerHeight ? window.innerHeight : document.body.clientWidth
      let height = windowHeight - 84 - 20
      this.tableHeight = parseInt(height) < 300 ? 300 : height
    },
    handleStore () {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>你确定要导入，频率过高易被封号</p>',
        loading: true,
        closable: true,
        onOk: () => {
          this.$Message.destroy()
          this.$Modal.remove()
          this.isRequesting = true
          this.CsgoStore().then(data => {
            // let min = parseInt(data.time / 60) + 1
            // this.allTime = parseInt(data.time + 60)
            // this.count = 0
            // this.percent = 0
            // this.$Notice.open({
            //   title: '通知',
            //   render: () => (<div style={{ lineHeight: '25px' }}>
            //     <p>{'导入已开始进行，预计' + min + '分钟'}</p>
            //     <p style={{ fontWeight: 'bold' }}>建议：导入触发频率请勿过快！！！</p>
            //     <Progress percent={parseFloat(this.percent)} />
            //   </div>)
            // })
            // let interval = setInterval(() => {
            //   if (parseInt(this.count) >= parseInt(this.allTime)) {
            //     this.isRequesting = false
            //     window.clearInterval(interval)
            //   } else {
            //     this.count++
            //     this.percent = parseFloat(this.count / this.allTime * 100).toFixed(2)
            //   }
            // }, 1000)
            setTimeout(() => {
              this.isRequesting = false
            }, 1000)
            this.$Message.success(data)
          }).catch(err => {
            setTimeout(() => {
              this.isRequesting = false
            }, 1000)
            this.$Message.error(err.message || '导入失败')
          })
        }
      })
    },
    showSpin () {
      this.$Message.destroy()
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('Icon', {
              'class': 'demo-spin-icon-load',
              props: {
                type: 'ios-loading',
                size: 28
              }
            }),
            h('div', {
              domProps: {
                innerHTML: '<p style="font-size:18px;margin-top: 8px;">去后台查看具体的执行情况</p><p style="font-size:18px;">后台执行完毕，页面会自动恢复</p>'
              }
            })
          ])
        }
      })
    },
    handleValidSession () {
      this.showSpin()
      this.isRequesting = true
      this.validSession().then(data => {
        this.$Spin.hide()
        this.isRequesting = false
        this.$Message['info']({
          background: true,
          content: data,
          duration: 0,
          closable: true
        })
      }).catch(() => {
        this.$Spin.hide()
        this.isRequesting = false
        this.$Message.error('服务端出错')
      })
    },
    handleValidIP () {
      this.showSpin()
      this.isRequesting = true
      this.validIp().then(data => {
        this.$Spin.hide()
        this.isRequesting = false
        this.$Message['info']({
          background: true,
          content: data,
          duration: 0,
          closable: true
        })
      }).catch(() => {
        this.$Spin.hide()
        this.isRequesting = false
        this.$Message.error('服务端出错')
      })
    },
    handleOpenQuery () {
      this.isModalShow = true
    },
    handleGetSteamPrice () {
      this.disabled = true
      this.buffData = this.buffData.filter((item, index) => index < 180)
      let query = this.buffData.map((item, index) => {
        return {
          index: index,
          url: item.steamMarketUrl,
          name: item.goodsName,
          steamBuyPrice: item.steamBuyPrice
        }
      })
      query = query.filter(item => !item.steamBuyPrice)
      if (query.length) {
        this.PostSteamPrice(query).then(data => {
          let arr = data.arr
          this.$Message.destroy()
          this.$Message['info']({
            background: true,
            content: '剩余' + data.error + '条steam求购价未获取到',
            duration: 0,
            closable: true
          })
          arr.forEach(item => {
            this.buffData[item.index].steamBuyPrice = item.steamBuyPrice
          })
          this.buffData.sort((a, b) => {
            return b.steamBuyPrice / b.buffMinPrice - a.steamBuyPrice / a.buffMinPrice
          })
          this.disabled = false
        }).catch(err => {
          this.$Message.error(err.message || '获取求购价失败')
          this.disabled = false
        })
      } else {
        this.$Message.success('steam价格已经基本都获取到了')
      }
    },
    handleCanBuy (form) {
      this.loading = true
      this.CsgoCanBuy(form).then(data => {
        this.loading = false
        this.buffData = data
      }).catch(err => {
        this.loading = false
        this.$Message.error(err.message || '数据加载失败')
      })
    },
    handleCanSell () {
      this.loading = true
      this.CsgoCanSell().then(data => {
        this.loading = false
        this.buffData = data
      }).catch(err => {
        this.loading = false
        this.$Message.error(err.message || '数据加载失败')
      })
    },
    handleGetAva () {
      this.storeDisabled = true
      this.CsgoGetAavKnife().then(data => {
        this.storeDisabled = false
        this.$Message.success(data.data)
      }).catch(err => {
        this.storeDisabled = false
        this.$Message.error(err.message || '数据加载失败')
      })
    },
    handleGetAvaList () {
      this.buyDisabled = true
      this.CsgoBuyAavKnife().then(data => {
        this.buyDisabled = false
        this.buffData = data.data
      }).catch(err => {
        this.buyDisabled = false
        this.$Message.error(err.message || '数据加载失败')
      })
    },
    handleCancle () {
      this.isModalShow = false
    },
    handleSearch (form) {
      this.isModalShow = false
      this.handleCanBuy(form)
    }
  }
}
</script>

<style>
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
</style>
<style scoped lang="less">
.contain{
  &__table-header{
    text-align: right;
  }
  &__store{
    float: left;
    margin-top: 8px;
    margin-left: 10px;
  }
  &__time{
    vertical-align: -2px;
    font-size: 14px;
    margin-right: 10px;
  }
  &__buy{
    margin-right: 10px;
  }
  &__sell{
    margin-right: 20px;
  }
  .go-buff{
    margin-right: 4px;
  }
}
</style>
