<template>
  <div class="datepicker__container">
    <div class="datepicker__header">
      <div class="datepicker__header__day">
        {{ locale_day }}
      </div>
      <div class="datepicker__header__formated_date">
        <div class="datepicker__header__formated_month">{{ formated_selected_month }}</div>
        <div class="datepicker__header__formated_month_day">{{ formated_date }}</div>
        <div class="datepicker__header__formated_year">{{ formated_selected_year }}</div>
      </div>
    </div>
    <Agenda :disabled-weekdays="disabledWeekdays" disable-before-today="true" :disabled-days="disabledDays" :disabled-periods="disabledPeriods" v-on:select="select($event)"/>
  </div>
</template>

<script>

import moment from 'moment'
import Agenda from './Agenda'
/* import MonthGenerator from '../modules/MonthGenerator'
import Period from '../modules/Period' */
import PeriodsCollection from '../modules/PeriodsCollectionFactory'
// import Weekday from '../modules/Weekday'

export default {
  name: 'Calendar',
  props: {
    disabledWeekdays: [Array],
    disabledDays: [Array, String],
    disabledBeforeToday: {
      type: Boolean,
      default: true
    },
    disabledPeriods: {
      type: Object,
      default: () => { PeriodsCollection([]) }
    }
  },
  data () {
    return {
      date: moment(),
      selectedDay: ''
    }
  },
  components: {
    Agenda
  },
  computed: {
    locale_day () {
      return this.selectedDay.format('dddd')
    },
    formated_date () {
      return this.selectedDay.format('D')
    },
    formated_selected_month () {
      return this.selectedDay.format('MMM')
    },
    formated_selected_year () {
      return this.selectedDay.format('YYYY')
    }
  },
  methods: {
    select (args) {
      this.selectedDay = args.selected
      this.$emit('select', this.selectedDay)
    }
  },
  created: function () {
    this.date = moment()
    this.selectedDay = this.date.clone()
  }
}
</script>

<style lang="scss">
$main-color: #ff9800;
$dark-color: darken($main-color, 15);
$light-color: lighten($main-color, 15);
$width: 280px;

.datepicker__container * {
  box-sizing: border-box;
}

.datepicker__container {
  width: $width;
  margin: auto;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}

.datepicker__header__day {
  height: 32px;
  line-height: 32px;
  background: $dark-color;
  text-transform: capitalize;
  font-size: 14px;
  font-weight: 300;
  color: white;
  text-align: center;
}
.datepicker__header__formated_date {
  height: 135px;
  background: $main-color;
}
.datepicker__header__formated_date div {
  display: block;
  color: white;
  text-align: center;
}
.datepicker__header__formated_month {
  padding: 8px 0px;
  font-size: 22px;
  text-transform: uppercase;
}
.datepicker__header__formated_month_day {
  font-size: 55px;
  height: 39px;
  margin-top: -10px;
  margin-bottom: 24px;
}
.datepicker__header__formated_year {
  font-size: 26px;
  color: rgba(255, 255, 255, 0.75) !important;
  margin-bottom: 12px 0px;
}
.datepicker__header__navigation {
  position: relative;
  margin-top: 8px;
  padding: 7px;
  text-align: center;
  font-size: 14px;
}
.datepicker__header__navigation__label {
  text-transform: capitalize;
}
.datepicker__control {
  position: absolute;
  cursor: pointer;
  font-size: 15px;
  color: $main-color;
  font-weight: 300;
  top: 7px;
}
.datepicker__header__navigation__previous {
  left: 62px;
}
.datepicker__header__navigation__next {
  right: 62px;
}
.datepicker__day__label {
  color: grey;
  font-weight: 400;
}
.datepicker__day__disabled {
  color: lightgrey;
}
.datepicker__table, .datepicker__header {
  background: white;
}
.datepicker__table tr {
  height: $width / 7;
}
.datepicker__table td, .datepicker__table th {
  width: $width / 7;
  text-align: center;
}
.datepicker__table__day {
  font-size: 12px;
  text-align: center;
  font-weight: 300;
  cursor: pointer;
  transition: background .5s;
  transition-timing-function: ease;
  border-radius: 50%;
}
.datepicker__table__day:hover {
  background: $main-color;
}
.datepicker__table__cell__selected {
  background: $main-color;
}
.datepicker__table__disabled__day {
  color: lightgray;
  cursor: default;

  &:hover {
    background: inherit;
  }
}
</style>
