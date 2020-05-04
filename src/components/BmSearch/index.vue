<template>
    <baidu-map
        :zoom="zoom"
        :center="center"
        :scroll-wheel-zoom="true"
        @ready="handleReady"
        @click="handleMapPoint"
    >
        <bm-view class="map-container"></bm-view>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :showAddressBar="true"
            :autoLocation="true"
            :locationIcon="{url:require('@/assets/logo/location.gif'),size:{width:300,height:175}}"
            @locationSuccess="handleLoctionSuccess"
            @locationError="handleLocationError"
        ></bm-geolocation>
        <bm-marker
            :position="autoLocationPoint"
            :icon="{url:require('@/assets/logo/location.gif'),size:{width:300,height:175}}"
            v-if="geolocationReady"
        ></bm-marker>
        <bm-control :offset="{width: 20, height: 10}">
            <bm-auto-complete
                :location="location"
                v-model="keyword"
                :sugStyle="{zIndex: zIndex}"
                @confirm="handleSelect"
            >
                <el-input
                    prefix-icon="el-icon-search"
                    clearable
                    :placeholder="placeholder"
                    v-model="keyword"
                    style="width: 350px;"
                ></el-input>
            </bm-auto-complete>
        </bm-control>
        <bm-local-search
            :panel="panel"
            :forceLocal="forceLocal"
            :keyword="keyword"
            :auto-viewport="true"
        ></bm-local-search>
    </baidu-map>
</template>

<script>
import { placeSearch } from '@/api/bm'
import waves from '@/directive/waves' // Waves directive
export default {
    name: 'BmSearch',
    props: {
        placeholder: {
            type: String,
            default: '请输入关键地点'
        },
        // 表示是否将搜索范围约束在当前城市
        forceLocal: {
            type: Boolean,
            default: false
        },
        zIndex: {
            type: Number,
            default: 1
        },
        //是否显示搜索结果面板
        panel: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Object,
            default() {
                return {
                    point: { lng: 0, lat: 0 },
                    item: {},
                    fullAdress: ''
                }
            }
        },
        point: {
            type: Object
        },
        inputStyle: {
            type: String,
            default: 'width: 100%;'
        }
    },
    directives: { waves },
    data() {
        return {
            keyword: '',
            center: { lng: 0, lat: 0 },
            location: '成都市',
            zoom: 16,
            geolocationReady: false
        }
    },
    computed: {
        currentSelected: {
            get() {
                return this.selected
            },
            set(val) {
                this.$emit('update:selected', val)
            }
        }
    },
    mounted() {},
    methods: {
        // 地图组件初始化完成
        handleReady({ BMap, map }) {
            if (this.point && !(this.point.lng ===0 || this.point.lat ===0)) {
                this.autoLocationPoint = {
                    lng: this.point.lng,
                    lat: this.point.lat
                }
                this.geolocationReady = true
            } else {
                let that = this
                var geolocation = new BMap.Geolocation()
                geolocation.getCurrentPosition(
                    function(r) {
                        console.log(r)
                        that.location = r.address.city
                        that.center = { lng: r.longitude, lat: r.latitude } // 设置center属性值
                        that.autoLocationPoint = {
                            lng: r.longitude,
                            lat: r.latitude
                        } // 自定义覆盖物
                        that.geolocationReady = true
                    },
                    { enableHighAccuracy: true }
                )
            }
            this.zoom = 16
        },
        //获取地图指定位置信息
        handleMapPoint({ point }) {
            console.log('point', point)
            this.currentSelected = {
                ...this.currentSelected,
                ...{ point: point }
            }
        },
        handleSelect({ type, target, item }) {
            console.log('item', item)
            let it = item.value
            this.currentSelected = {
                ...this.currentSelected,
                ...{
                    item: item.value,
                    fullAdress:
                        it.province +
                        it.city +
                        it.district +
                        it.business +
                        it.street +
                        it.streetNumber
                }
            }
        },
        handleSearchcomplete(autocompleteResult) {
            console.log('检索地点完成', autocompleteResult)
        },
        handleLoctionSuccess({ point, AddressComponent, marker }) {
            console.log('定位成功', point)
        },
        handleLocationError({ StatusCode }) {
            console.warn('获取定位失败', StatusCode)
        }
    }
}
</script>

<style>
.el-select {
    width: 110px;
}

.input-with-select {
    width: 400px;
}
.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
.map-container {
    width: 100%;
    height: 500px;
}
</style>
