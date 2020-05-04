<template>
  <div>
    <sys-user-profile v-if="type==='sysUserProfile'" />
    <reset-password v-if="type==='resetPassword'" />
  </div>
</template>

<script>
import SysUserProfile from './sysUserProfile'
import ResetPassword from './resetPassword'

export default {
    props: {
        type: {
            type: String,
            default: 'sysUserProfile'
        }
    },
    components: { SysUserProfile, ResetPassword },
    data() {
        return {}
    },
    created() {},
    methods: {}
}
</script>

