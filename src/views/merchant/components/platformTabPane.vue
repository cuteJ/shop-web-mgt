<template>
  <div>
    <platform-basic v-if="type=='platformBasic'" />
    <platform-mp v-if="type=='platformMp'" />
  </div>
</template>

<script>
import PlatformBasic from './platformBasic'
import PlatformMp from './platformMp'

export default {
    props: {
        type: {
            type: String,
            default: 'platformBasic'
        }
    },
    components: { PlatformBasic, PlatformMp },
    data() {
        return {}
    },
    created() {},
    methods: {}
}
</script>

