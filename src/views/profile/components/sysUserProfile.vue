<template>
  <div class="createUser-container">
    <el-row>
      <el-col
        :span="12"
        :xs="{span: 24, offset: 0}"
      >
        <el-form
          ref="formData"
          label-width="80px"
          :model="formData"
          :rules="rules"
          class="form-container"
        >
          <el-form-item
            :label="$t('views.profile.sysUserProfile.formData.username')"
            prop="username"
          >
            <el-input
              v-model="formData.username"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('views.profile.sysUserProfile.formData.realName')"
            prop="realName">
            <el-input v-model="formData.realName"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('views.profile.sysUserProfile.formData.phoneNo')"
            prop="phoneNo">
            <el-input
              v-model="formData.phoneNo"
              prefix-icon="el-icon-mobile-phone"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('views.profile.sysUserProfile.formData.email')"
            prop="email">
            <el-input
              v-model="formData.email"
              prefix-icon="el-icon-message"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
            >{{ $t('table.submit')}}
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {getUserDetail, updateUserDetail} from '@/api/login'
  import SysCode from '@/components/SysCode'
  import {validatorPhoneNumber} from '@/utils/validatorForm'

  const defaultForm = {
    username: '', // 登录名
    realName: '', // 用户姓名
    phoneNo: '', // 移动电话
    email: '', // 邮箱
  }

  export default {
    name: 'sysUserProfile',
    components: {SysCode},
    data() {
      const validatorRequired = (rule, value, callback) => {
        if (!value) {
          callback(new Error(i18n.t(`views.profile.sysUserProfile.formData.${rule.field}`) + i18n.t('action.required')))
        } else {
          callback()
        }
      };
      return {
        cacheData: {},
        formData: defaultForm,
        loading: false,
        rules: {
          realName: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ],
          phoneNo: [
            {
              required: true,
              validator: validatorRequired,
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
    created() {
      this.remoteUserDetail()
    },
    mounted() {
    },
    methods: {
      onSubmit() {
        this.$refs.formData.validate(valid => {
          if (valid) {
            this.loading = true
            updateUserDetail(this.formData).then(response => {
              this.loading = false
              this.remoteUserDetail()
            })
          } else {
            return false
          }
        })
      },
      remoteUserDetail() {
        getUserDetail().then(response => {
          this.formData = Object.assign(this.formData, response)
          this.loading = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/mixin.scss';

  .createUser-container {
    position: relative;
    padding: 40px 30px;

    .user-avatar {
      width: 80px;
      height: 70px;
      border-radius: 10px;
    }
  }
</style>
