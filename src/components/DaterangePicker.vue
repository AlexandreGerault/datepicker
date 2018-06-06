<template>
  <div>
    <div style="display: inline-block;">
      <Agenda :selected-period="selectedPeriod" @select="selectFirstDay($event)"/>
    </div>
    <div style="display: inline-block;">
      <Agenda :selected-period="selectedPeriod" @select="selectLastDay($event)" />
    </div>
    <button class="button alert" @click="resetPeriod()">Recommencer la sélection</button>
  </div>
</template>

<script>
import moment from 'moment'
import Agenda from './Agenda'
import MonthGenerator from '../modules/MonthGenerator'
import Period from '../modules/PeriodFactory'

export default {
  name: 'DaterangePicker',
  data () {
    return {
      firstDate: moment(),
      lastDate: moment().add(1, 'day'),
      weeks: []
    }
  },
  components: {
    Agenda
  },
  computed: {
    selectedPeriod () {
      return Period(this.firstDate, this.lastDate)
    }
  },
  methods: {
    isMomentInstance (day) {
      return day instanceof moment
    },
    isFirstDay (day) {
      if (day instanceof moment) {
        return day.isSame(this.firstDate, 'day')
      }
    },
    isLastDay (day) {
      if (day instanceof moment) {
        return day.isSame(this.lastDate, 'day')
      }
    },
    selectFirstDay (event) {
      if (event.day instanceof moment && (!(this.lastDate instanceof moment) || event.day.isBefore(this.lastDate, 'day'))) {
        this.firstDate = event.day.clone()
        this.$emit('selectFirstDay', event)
      }
    },
    selectLastDay (event) {
      if (event.day instanceof moment && (!(this.lastDate instanceof moment) || event.day.isAfter(this.firstDate, 'day'))) {
        this.lastDate = event.day.clone()
        this.$emit('selectLastDay', event)
      }
    },
    resetPeriod () {
      this.firstDate = moment()
      this.lastDate = moment().add(1, 'day')
    }
  },
  created: function () {
    this.weeks = MonthGenerator.weeks(this.date)
  }
}
</script>

<style lang="scss">
$main-color: #ff9800;
$dark-color: darken($main-color, 15);
$light-color: lighten($main-color, 15);
$width: 280px;
</style>
