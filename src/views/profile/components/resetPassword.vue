<template>
  <div class="resetPassword-container">
    <el-row>
      <el-col
        :span="12"
        :xs="{span: 24, offset: 0}"
      >
        <el-form
          :model="formData"
          status-icon
          :rules="rules"
          ref="formData"
          label-width="100px"
          class="form-container"
        >
          <el-form-item
            :label="$t('views.profile.resetPassword.formData.originalPassword')"
            prop="originalPassword"
          >
            <el-input
              type="password"
              v-model="formData.originalPassword"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('views.profile.resetPassword.formData.currentPassword')"
            prop="currentPassword"
          >
            <el-input
              type="password"
              v-model="formData.currentPassword"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('formData')"
            >{{ $t('table.submit')}}
            </el-button>
            <el-button @click="resetForm('formData')">{{ $t('table.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {resetPassword} from '@/api/login'

  export default {
    name: 'resetPassword',
    data() {
      const validatorRequired = (rule, value, callback) => {
        if (!value) {
          callback(new Error(i18n.t(`views.profile.resetPassword.formData.${rule.field}`) + i18n.t('action.required')))
        } else {
          callback()
        }
      };
      return {
        formData: {
          originalPassword: '',
          currentPassword: ''
        },
        rules: {
          originalPassword: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ],
          currentPassword: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            resetPassword(this.formData)
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/mixin.scss';

  .resetPassword-container {
    position: relative;
    padding: 40px 50px;
  }
</style>
