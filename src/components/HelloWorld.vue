<template>
  <div class="box">
    <div id="mapChart" class="chart" />
  </div>
</template>

<script>
import cityMap from '@/js/china-main-city-map.js'
import echarts from 'echarts'
import chinaProvince from '@/js/chinaProvince.js'
// 中国地图（第一级地图）的ID、Name、Json数据
var chinaId = 100000
var chinaName = 'china'
// 记录父级ID、Name
var mapStack = []
var parentId = null
var parentName = null
// Echarts地图全局变量，主要是在返回上级地图的方法中会用到
var myChart = null
export default {
  name: 'ChinaMap',
  props: {
    paramsOld: {
      type: Array,
      default: function() {
        return [{ orderNum: '13', provinceCode: '350000', provinceName: '福建省', count: '5' },
          { orderNum: '13', provinceCode: '350000', provinceName: '福建省', count: '5' },
          { orderNum: '2', provinceCode: '120000', provinceName: '天津市', count: '4' },
          { orderNum: '4', provinceCode: '140000', provinceName: '山西省', count: '4' },
          { orderNum: '7', provinceCode: '220000', provinceName: '吉林省', count: '4' },
          { orderNum: '22', provinceCode: '500000', provinceName: '重庆市', count: '3' },
          { orderNum: '3', provinceCode: '130000', provinceName: '河北省', count: '2' },
          { orderNum: '1', provinceCode: '110000', provinceName: '北京市', count: '12' },
          { orderNum: '11', provinceCode: '330000', provinceName: '浙江省', count: '1' },
          { orderNum: '5', provinceCode: '150000', provinceName: '内蒙古自治区', count: '0' },
          { orderNum: '6', provinceCode: '210000', provinceName: '辽宁省', count: '0' },
          { orderNum: '9', provinceCode: '310000', provinceName: '上海市', count: '0' },
          { orderNum: '10', provinceCode: '320000', provinceName: '江苏省', count: '0' },
          { orderNum: '12', provinceCode: '340000', provinceName: '安徽省', count: '0' },
          { orderNum: '14', provinceCode: '360000', provinceName: '江西省', count: '0' },
          { orderNum: '15', provinceCode: '370000', provinceName: '山东省', count: '0' },
          { orderNum: '16', provinceCode: '410000', provinceName: '河南省', count: '0' },
          { orderNum: '17', provinceCode: '420000', provinceName: '湖北省', count: '0' },
          { orderNum: '19', provinceCode: '440000', provinceName: '广东省', count: '0' },
          { orderNum: '20', provinceCode: '450000', provinceName: '广西壮族自治区', count: '0' },
          { orderNum: '23', provinceCode: '510000', provinceName: '四川省', count: '0' },
          { orderNum: '24', provinceCode: '520000', provinceName: '贵州省', count: '0' },
          { orderNum: '25', provinceCode: '530000', provinceName: '云南省', count: '0' },
          { orderNum: '27', provinceCode: '610000', provinceName: '陕西省', count: '0' },
          { orderNum: '30', provinceCode: '640000', provinceName: '宁夏回族自治区', count: '0' },
          { orderNum: '31', provinceCode: '650000', provinceName: '新疆维吾尔自治区', count: '0' }]
      }
    },
    provinceData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      mounthData: '',
      chinaProvince,
      value: '',
      aaa: '1111'
    }
  },
  mounted() {
    this.getMapMaxAndMin()
    this.mapChart('mapChart')
  },
  methods: {
    getMapMaxAndMin() {
      const arr = this.paramsOld.map(item => {
        return item.count
      })
      arr.sort()
      this.max = Number(arr[arr.length - 1])
      this.min = Number(arr[0])
    },
    /**
     * Echarts地图
     */
    mapChart(divid) {
      var that = this
      var json = require('@/../static/map/' + chinaId + '.json')
      const mapJson = json
      myChart = echarts.init(document.getElementById(divid))
      that.registerAndsetOption(myChart, chinaId, chinaName, mapJson, false)
      parentId = chinaId
      parentName = 'china'
      myChart.on('click', function(param) {
        console.log(that.aaa)
        var cityId = cityMap[param.name]
        if (cityId) {
          // 代表有下级地图
          var json = require('@/../static/map/' + cityId + '.json')
          const mapJson = json
          that.registerAndsetOption(
            myChart,
            cityId,
            param.name,
            mapJson,
            true
          )
        } else {
          // 没有下级地图，回到一级中国地图，并将mapStack清空
          that.registerAndsetOption(myChart, chinaId, chinaName, mapJson, false)
          mapStack = []
          parentId = chinaId
          parentName = chinaName
        }
      })
    },
    registerAndsetOption(myChart, id, name, mapJson, flag) {
      echarts.registerMap(name, mapJson)
      myChart.setOption({
        title: {
          text: '地图'
        },
        tooltip: {
          show: true,
          backgroundColor: 'rgba(14,54,108,0.9)',
          formatter: function(params) {
            var str = ''
            str += "<span style='color:rgba(83,249,255);font-weight:bold;font-size:16px;'>" + params.name + '</span><br/>'
            return "<div style='padding:6px;'>" + str + '</div>'
          }
        },
        visualMap: {
          min: this.min,
          max: this.max,
          type: 'continuous',
          orient: 'horizontal',
          itemWidth: 10,
          itemHeight: 100,
          text: ['高', '低'],
          showLabel: true,
          seriesIndex: [0],
          textStyle: {
            color: '#7B93A7'
          },
          bottom: '10%',
          left: '10%',
          inRange: {
            color: ['rgba(24, 116, 242, 1)', 'rgba(32, 182, 253, 1)', 'rgba(34, 229, 222, 1)', 'rgba(255, 205, 32, 1)', 'rgba(255, 137, 32, 1)']
          }
        },
        series: [
          {
            type: 'map',
            map: name,
            zoom: 1,
            label: {
              normal: {
                show: true,
                color: '#fff'
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                areaColor: 'rgba(24, 116, 242, 1)',
                borderColor: 'rgba(163, 199, 250, 1)',
                shadowBlur: 0,
                borderWidth: 2
              },
              emphasis: {
                areaColor: 'rgba(18, 0, 236, 0.8)'
              }
            },
            data: this.initMapData(mapJson)
          }
        ]
      })

      if (flag) {
        // 往mapStack里添加parentId，parentName,返回上一级使用
        mapStack.push({
          mapId: parentId,
          mapName: parentName
        })
        parentId = id
        parentName = name
      }
    },
    initMapData(mapJson) {
      var mapData = []
      for (var i = 0; i < mapJson.features.length; i++) {
        const name = mapJson.features[i].properties.name
        // const obj = this.initMapTooLtipData(mapJson.features[i].id)
        mapData.push({
          name: name,
          value: this.initMapColorData(mapJson.features[i].id),
          id: mapJson.features[i].id
        })
      }
      return mapData
    },
    // 初始化鼠标划过时，展示的数据
    initMapTooLtipData(data) {
      const arr = this.provinceData.map(item => {
        return item.currProvince
      })
      return this.provinceData[arr.indexOf(data)]
    },
    // 初始化颜色深浅对应的数据
    initMapColorData(data) {
      const arr = this.paramsOld.map(item => {
        return item.provinceCode
      })
      const num = arr.indexOf(data)
      if (num < 0) {
        return 0
      } else {
        return this.paramsOld[num].count
      }
    }
  }
}
</script>
<style scoped>
.chart {
  width: 100%;
  height: 90vh;
  margin:0 auto;
}
</style>
