<template>
  <div>
    <job-details-manager v-if="type==='jobDetailsManager'"/>
    <job-trigger-manager v-if="type==='jobTriggerManager'"/>
    <job-instance-manager v-if="type==='jobInstanceManager'"/>
  </div>
</template>

<script>
  import JobDetailsManager from './jobDetailsManager'
  import JobTriggerManager from './jobTriggerManager'
  import JobInstanceManager from './jobInstanceManager'

  export default {
    props: {
      type: {
        type: String,
        default: 'jobDetailsManager'
      }
    },
    components: {
      JobDetailsManager,
      JobTriggerManager,
      JobInstanceManager
    },
    data() {
      return {}
    },
    created() {
    },
    methods: {}
  }
</script>

