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
    name: 'merchantDetail',
    components: { tabPane },
    data() {
        return {
            tabMapOptions: [
                {
                    label: '基本设置',
                    key: 'merchantBasic',
                    icon: 'el-icon-third-survey1'
                },
                {
                    label: '广告',
                    key: 'merchantAds',
                    icon: 'el-icon-third-survey1'
                },
                {
                    label: '客服设置',
                    key: 'merchantKefu',
                    icon: 'el-icon-service'
                },
                {
                    label: '账户流水',
                    key: 'merchantAccountRecord',
                    icon: 'el-icon-third-wodedingdan'
                }
            ],
            tabName: 'merchantBasic'
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
