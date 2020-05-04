<template>
  <div>
    <merchant-basic v-if="type=='merchantBasic'" />
    <merchant-ads v-if="type=='merchantAds'" />
    <merchant-kefu v-if="type=='merchantKefu'" />
    <merchant-account-record v-if="type=='merchantAccountRecord'" />
  </div>
</template>

<script>
import MerchantBasic from './merchantBasic'
import MerchantAds from './merchantAds'
import MerchantKefu from './merchantKefu'
import MerchantAccountRecord from './merchantAccountRecord'
export default {
    props: {
        type: {
            type: String,
            default: 'merchantBasic'
        }
    },
    components: {
        MerchantBasic,
        MerchantAds,
        MerchantKefu,
        MerchantAccountRecord
    },
    data() {
        return {}
    },
    created() {},
    methods: {}
}
</script>

