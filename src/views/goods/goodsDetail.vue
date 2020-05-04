<template>
    <div class="tab-container">
        <el-tabs
            v-model="tabName"
            style="margin-top:15px;"
            type="border-card"
        >
            <el-tab-pane
                v-for="item in tabMapOptions"
                :label="item.label"
                :key="item.key"
                :name="item.key"
            >
                <span slot="label"><i :class="item.icon"></i> {{item.label}}</span>
                <keep-alive>
                    <tab-pane
                        v-if="tabName==item.key"
                        :type="item.key"
                    />
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import tabPane from './components/tabPane'

export default {
    name: 'goodsDetail',
    components: { tabPane },
    data() {
        return {
            tabMapOptions: [
                {
                    label: '基本设置',
                    key: 'goodsBasic',
                    icon: 'el-icon-third-survey1'
                },
                {
                    label: '图片',
                    key: 'goodsPictures',
                    icon: 'el-icon-third-survey1'
                },
                {
                    label: '操作记录',
                    key: 'goodsRecord',
                    icon: 'el-icon-third-wodedingdan'
                }
            ],
            tabName: 'goodsBasic'
        }
    },
    methods: {}
}
</script>

<style scoped>
.tab-container {
    margin: 20px;
}
</style>
