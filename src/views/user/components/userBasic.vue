<template>
    <div class="tab-container">
        <el-form
            ref="formData"
            :rules="rules"
            :model="formData"
            label-width="100px"
            style="width: 75%"
        >
            <el-form-item
                label="用户名"
                prop="username"
            >
                <el-input
                    :disabled="true"
                    v-model="formData.user.username"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="昵称"
                prop="realName"
            >
                <el-input
                    v-model="formData.user.nickName"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="手机号"
                prop="phoneNo"
            >
                <el-input
                    v-model="formData.user.phoneNo"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="邮箱"
                prop="email"
            >
                <el-input
                    v-model="formData.user.email"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="真实姓名"
                prop="email"
            >
                <el-input
                    v-model="formData.profile.realName"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <sys-code
                    v-if="cacheData.codes"
                    :cache-options="cacheData['codes']"
                    :type-code="'1001'"
                    :selected.sync="formData.profile.gender"
                />
            </el-form-item>
            <el-form-item label="备注">
                <el-input
                    v-model="formData.user.remark"
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
import { userSave, userBasic } from '@/api/user'
import { validatePhoneNumber } from '@/utils/validate'

export default {
    name: 'userBasic',
    components: { SysCode },
    data() {
        const validatorPhoneNumber = (rule, value, callback) => {
            if (!validatePhoneNumber(value)) {
                callback(new Error('请输入正确的手机号'))
            } else {
                callback()
            }
        }
        return {
            cacheData: {},
            formData: {
                user: {
                    id: '',
                    username: '',
                    nickName: '',
                    phoneNo: '',
                    email: '',
                    remark: ''
                },
                profile: {
                    id: '',
                    remark: '',
                    realName: '',
                    gender: ''
                }
            },
            loading: false,
            rules: {
                phoneNo: [
                    {
                        required: true,
                        message: '联系人手机号必填',
                        trigger: 'blur'
                    },
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validatorPhoneNumber
                    }
                ]
            }
        }
    },
    computed: {},
    mounted() {
        cacheData(this.cacheData, '1001').then(() => {
            userBasic(this.$route.params.uid).then(data => {
                this.formData = data
            })
        })
    },
    methods: {
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.loading = true
                    // merchantSave({
                    //     merchantNo: this.formData.merchantNo,
                    //     merchant: this.formData
                    // })
                    //     .then(data => {
                    //         this.$notify({
                    //             title: '成功',
                    //             message: '保存成功',
                    //             type: 'success',
                    //             duration: 2000
                    //         })
                    //     })
                    //     .catch(err => {
                    //         console.log(err)
                    //     })
                    //     .finally(() => {
                    //         this.loading = false
                    //     })
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
