<template>
  <div class="contain">
    <Table
      :loading="loading"
      :height="tableHeight"
      stripe
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
          @click="handleCanBuy"
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
      form: {
        name: '',
        minPrice: 0.2,
        maxPrice: 1,
        sellNum: 2
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
        title: 'steam求购价',
        key: 'steamBuyPrice',
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
        title: 'steam售价',
        key: 'steamMinPrice',
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
        title: '操作',
        key: 'id',
        width: 180,
        align: 'center',
        render: (h, obj) => {
          let hrefIgxe = `https://www.igxe.cn/dota2/570?keyword=${obj.row.goodsName}`
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
      disabled: false
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
      'DotaCanBuy',
      'DotaCanSell',
      'DotaStore',
      'PostSteamPrice'
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
      this.isRequesting = true
      this.DotaStore().then(data => {
        let min = parseInt(data.time / 60) + 1
        this.allTime = parseInt(data.time + 60)
        this.count = 0
        this.percent = 0
        this.$Notice.open({
          title: '通知',
          render: () => (<div style={{ lineHeight: '25px' }}>
            <p>{'导入已开始进行，预计' + min + '分钟'}</p>
            <p style={{ fontWeight: 'bold' }}>建议：导入触发频率请勿过快！！！</p>
            <Progress percent={parseFloat(this.percent)} />
          </div>)
        })
        let interval = setInterval(() => {
          if (parseInt(this.count) >= parseInt(this.allTime)) {
            this.isRequesting = false
            window.clearInterval(interval)
          } else {
            this.count++
            this.percent = parseFloat(this.count / this.allTime * 100).toFixed(2)
          }
        }, 1000)
      }).catch(err => {
        this.$Message.error(err.message || '导入失败')
      })
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
      if (query.length > 3) {
        this.PostSteamPrice(query).then(data => {
          let arr = data.arr
          this.$Message.destroy()
          if (parseInt(data.err) > 0) {
            this.$Message['info']({
              background: true,
              content: data.err + '条steam商品求购价获取失败',
              duration: 0,
              closable: true
            })
          }
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
    handleCanBuy (form = {}) {
      this.loading = true
      this.DotaCanBuy(form).then(data => {
        this.loading = false
        this.buffData = data
      }).catch(err => {
        this.loading = false
        this.$Message.error(err.message || '数据加载失败')
      })
    },
    handleCanSell () {
      this.loading = true
      this.DotaCanSell().then(data => {
        this.loading = false
        this.buffData = data
      }).catch(err => {
        this.loading = false
        this.$Message.error(err.message || '数据加载失败')
      })
    },
    handleOpenQuery () {
      this.isModalShow = true
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

<style scoped lang="less">
.contain{
  &__table-header{
    text-align: right;
  }
  &__time{
    vertical-align: -2px;
    font-size: 14px;
    margin-right: 10px;
  }
  &__store{
    float: left;
    margin-top: 8px;
    margin-left: 10px;
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
