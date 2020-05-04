<template>
  <div>
    <order-basic v-if="type=='orderBasic'" />
    <order-record v-if="type=='orderRecord'" />
    <order-traces v-if="type=='orderTraces'" />
  </div>
</template>

<script>
import orderBasic from './orderBasic'
import orderRecord from './orderRecord'
import orderTraces from './orderTraces'

export default {
    props: {
        type: {
            type: String,
            default: 'orderBasic'
        }
    },
    components: { orderBasic, orderRecord, orderTraces },
    data() {
        return {}
    },
    created() {},
    methods: {}
}
</script>

