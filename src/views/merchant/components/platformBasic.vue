<template>
    <div class="tab-container">
        <el-form
            ref="formData"
            :rules="rules"
            :model="formData"
            label-width="120px"
        >
            <el-form-item
                label="编号"
                prop="platformNo"
            >
                <el-input
                    v-model="formData.platformNo"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="名称"
                prop="platformName"
            >
                <el-input
                    v-model="formData.platformName"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="平台地区"
                prop="area"
            >
                <el-input
                    v-model="formData.area"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <div>
                <el-form-item>
                    <el-button
                        waves
                        type="primary"
                        @click="handleFormSave"
                    >{{ $t('table.submit') }}</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
import SysCode from '@/components/SysCode'
import { cacheData } from '@/utils/cache'
import { platformSave, platformDetail } from '@/api/merchant'

export default {
    name: 'platformBasic',
    components: { SysCode },
    data() {
        return {
            cacheData: {},
            formData: {
                id: null,
                area: '',
                logo: '',
                platformName: '',
                platformNo: ''
            },
            loading: false,
            rules: {
                platformNo: [
                    {
                        required: true,
                        message: '编号必选择',
                        trigger: 'blur'
                    }
                ],
                platformName: [
                    {
                        required: true,
                        message: '名称必填',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    computed: {},
    mounted() {
        cacheData(this.cacheData, '1000').then(() => {
            platformDetail(this.$route.params.platformNo, 'basic').then(
                data => {
                    if (data) {
                        this.formData = data
                    }
                }
            )
        })
    },
    methods: {
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.loading = true
                    platformSave({
                        platformNo: this.formData.platformNo,
                        basic: this.formData
                    })
                        .then(data => {
                            this.$notify({
                                title: '成功',
                                message: '保存成功',
                                type: 'success',
                                duration: 2000
                            })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => {
                            this.loading = false
                        })
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.tab-container {
    position: relative;
    padding: 40px 30px;
}
</style>
