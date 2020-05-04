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
    name: 'userDetail',
    components: { tabPane },
    data() {
        return {
            tabMapOptions: [
                {
                    label: '基本资料',
                    key: 'userBasic',
                    icon: 'el-icon-third-survey1'
                },
                {
                    label: '绑定社交',
                    key: 'userSocial',
                    icon: 'el-icon-third-survey1'
                },
                {
                    label: '登录日志',
                    key: 'userLog',
                    icon: 'el-icon-third-logistic'
                }
            ],
            tabName: 'userBasic'
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
