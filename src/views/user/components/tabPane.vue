<template>
  <div>
    <user-basic v-if="type=='userBasic'" />
    <user-log v-if="type=='userLog'" />
    <user-social v-if="type=='userSocial'" />
  </div>
</template>

<script>
import UserBasic from './userBasic'
import UserSocial from './userSocial'
import UserLog from './userLog'

export default {
    props: {
        type: {
            type: String,
            default: 'userBasic'
        }
    },
    components: { UserBasic, UserSocial, UserLog },
    data() {
        return {}
    },
    created() {},
    methods: {}
}
</script>

