<template>
  <div class="contain">
    <Table
      :loading="loading"
      :height="tableHeight"
      stripe
      border
      :columns="columns"
      :data="igxeData"
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
          @click="() => handleCanBuy({})"
        >
          查询可买
        </Button>
        <Button
          class="contain__buy"
          type="primary"
          :disabled="igxeData.length === 0 || disabled"
          @click="handleGetSteamPrice"
        >
          Steam求购价
        </Button>
        <Button
          class="contain__buy"
          type="primary"
          @click="() => handleCanUse()"
        >
          差价利用
        </Button>
      </div>
    </Table>
    <search-modal
      :is-modal-show="isModalShow"
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
          let href = `https://www.igxe.cn/dota2/570?keyword=${obj.row.goodsName}`
          return (<div>
            <a href={href} target="_blank">
              <input id={'copy' + obj.row.buffId} style={{ position: 'fixed', top: '-2000px' }} value={obj.row.goodsName} />
              <span style={{ cursor: 'pointer', color: '#36cfc9' }} class="btn-clip" data-clipboard-target={'#copy' + obj.row.buffId}>{obj.row.goodsName}</span>
            </a>
          </div>)
        }
      },
      {
        title: 'igxe售价',
        key: 'igxeMinPrice',
        align: 'center',
        render: (h, obj) => {
          let hrefSteam = obj.row.steamMarketUrl
          return (
            <div className="opt-div">
              <a href={hrefSteam} target="_blank">{obj.row.igxeMinPrice}</a>
            </div>)
        },
        sortable: true
      },
      {
        title: 'buff求购价',
        key: 'buffBuyPrice',
        align: 'center',
        render: (h, obj) => {
          let hrefBuff = `https://buff.163.com/market/goods?goods_id=${obj.row.buffId}&from=market#tab=selling`
          return (
            <div className="opt-div">
              <a href={hrefBuff} target="_blank">{obj.row.buffBuyPrice}</a>
            </div>)
        },
        sortable: true
      },
      {
        title: '平台倒卖价',
        key: 'cs',
        align: 'center',
        sortable: true,
        render: (h, obj) => {
          return (<div>{(obj.row.buffBuyPrice * 0.98 - obj.row.igxeMinPrice).toFixed(2)}</div>)
        }
      },
      {
        title: 'steam求购价',
        key: 'steamBuyPrice',
        align: 'center',
        sortable: true
      },
      {
        title: 'buff售价',
        key: 'buffMinPrice',
        align: 'center',
        render: (h, obj) => {
          let hrefBuff = `https://buff.163.com/market/goods?goods_id=${obj.row.buffId}&from=market#tab=selling`
          return (
            <div className="opt-div">
              <a href={hrefBuff} target="_blank">{obj.row.buffMinPrice}</a>
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
        title: '当前在售量',
        key: 'igxeSellNum',
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
          let hrefBuff = `https://buff.163.com/market/goods?goods_id=${obj.row.buffId}&from=market#tab=selling`
          let hrefSteam = obj.row.steamMarketUrl
          return (
            <div className="opt-div">
              <a href={hrefIgxe} target="_blank">去igxe </a>
              <a href={hrefBuff} target="_blank">去buff </a>
              <a href={hrefSteam} target="_blank">去steam</a>
            </div>)
        }
        // <Button size="small" type="success" onClick={() => this.goSteam(obj.row)}>去steam</Button>
      }],
      igxeData: [],
      allTime: 0,
      count: 0,
      percent: 0,
      tableHeight: 300,
      disabled: false
    }
  },
  computed: {
    time: function () {
      return this.igxeData[0] ? Util.formatDate(this.igxeData[0].time) : ''
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
      'IgxeDotaStore',
      'IgxeDotaCanBuy',
      'IgxeDotaCanUse',
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
      this.IgxeDotaStore().then((data) => {
        this.$Message.success(data.data)
        this.isRequesting = false
      }).catch((err) => {
        this.$Message.error(err.message || '导入失败')
        this.isRequesting = false
      })
    },
    handleOpenQuery () {
      this.isModalShow = true
    },
    handleGetSteamPrice () {
      this.disabled = true
      this.igxeData = this.igxeData.filter((item, index) => index < 90)
      const query = this.igxeData.map((item, index) => {
        return {
          index: index,
          url: item.steamMarketUrl,
          name: item.goodsName
        }
      })
      this.PostSteamPrice(query).then(data => {
        data.forEach(item => {
          this.igxeData[item.index].steamBuyPrice = item.steamBuyPrice
        })
        this.igxeData.sort((a, b) => {
          return b.steamBuyPrice / b.igxeMinPrice - a.steamBuyPrice / a.igxeMinPrice
        })
        this.disabled = false
      }).catch(err => {
        this.$Message.error(err.message || '获取求购价失败')
        this.disabled = false
      })
    },
    handleCanBuy (form) {
      this.loading = true
      if (this.columns.length >= 10) {
        this.columns.splice(3, 2)
      }
      this.IgxeDotaCanBuy(form).then(data => {
        this.loading = false
        this.igxeData = data
      }).catch(err => {
        this.loading = false
        this.$Message.error(err.message || '数据加载失败')
      })
    },
    handleCanUse () {
      this.loading = true
      if (this.columns.length < 10) {
        this.columns.splice(3, 0,
          {
            title: 'buff求购价',
            key: 'buffBuyPrice',
            align: 'center',
            render: (h, obj) => {
              let hrefBuff = `https://buff.163.com/market/goods?goods_id=${obj.row.buffId}&from=market#tab=selling`
              return (
                <div className="opt-div">
                  <a href={hrefBuff} target="_blank">{obj.row.buffBuyPrice}</a>
                </div>)
            },
            sortable: true
          },
          {
            title: '平台倒卖价',
            key: 'cs',
            align: 'center',
            sortable: true,
            render: (h, obj) => {
              return (<div>{(obj.row.buffBuyPrice * 0.975 - obj.row.igxeMinPrice).toFixed(2)}</div>)
            }
          })
      }
      this.IgxeDotaCanUse().then(data => {
        this.loading = false
        this.igxeData = data
      }).catch(err => {
        this.loading = false
        this.$Message.error(err.message || '数据加载失败')
      })
    },
    goSteam (obj) {
      const url = `https://buff.163.com/market/goods?goods_id=${obj.buffId}&from=market#tab=selling`
      window.open(url, '_blank')
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
