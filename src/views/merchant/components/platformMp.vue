<template>
    <div class="tab-container">
        <el-form
            ref="formData"
            :rules="rules"
            :model="formData"
            label-width="120px"
        >
            <el-form-item
                label="平台编号"
                prop="platformNo"
            >
                <el-input
                    :disabled="true"
                    v-model="formData.platformNo"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="公众号名称"
                prop="mpName"
            >
                <el-input
                    v-model="formData.mpName"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="App Id"
                prop="appId"
            >
                <el-input
                    v-model="formData.appId"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="App Secret"
                prop="appSecret"
            >
                <el-input
                    v-model="formData.appSecret"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="Js回调域名"
                prop="jsDomain"
            >
                <el-input
                    v-model="formData.jsDomain"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="回调域名"
                prop="notifyDomain"
            >
                <el-input
                    v-model="formData.notifyDomain"
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
    name: 'platformMp',
    components: { SysCode },
    data() {
        return {
            cacheData: {},
            formData: {
          id: null,
                platformNo: '',
                mpName: '',
                appId: '',
                appSecret: '',
                jsDomain: '',
                notifyDomain: ''
            },
            loading: false,
            rules: {
                platformNo: [
                    {
                        required: true,
                        message: '平台编号必选择',
                        trigger: 'blur'
                    }
                ],
                mpName: [
                    {
                        required: true,
                        message: '公众号名称必填',
                        trigger: 'blur'
                    }
                ],
                appId: [
                    {
                        required: true,
                        message: '公众号AppId必填',
                        trigger: 'blur'
                    }
                ],
                appSecret: [
                    {
                        required: true,
                        message: '公众号AppSecret必填',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    computed: {},
    mounted() {
        cacheData(this.cacheData, '1001,1002').then(() => {})
        this.formData.platformNo = this.$route.params.platformNo
        platformDetail(this.$route.params.platformNo, 'mp').then(data => {
            if (data) {
                this.formData = data
            }
        })
    },
    methods: {
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.loading = true
                    platformSave({
                        platformNo: this.formData.platformNo,
                        mp: this.formData
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
