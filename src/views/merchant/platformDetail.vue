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
import tabPane from './components/platformTabPane'

export default {
    name: 'platformDetail',
    components: { tabPane },
    data() {
        return {
            tabMapOptions: [
                {
                    label: '基本设置',
                    key: 'platformBasic',
                    icon: 'el-icon-third-survey1'
                },
                {
                    label: '公众号设置',
                    key: 'platformMp',
                    icon: 'el-icon-third-custom-wechat'
                }
            ],
            tabName: 'platformBasic'
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
