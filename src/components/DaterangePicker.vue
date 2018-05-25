<template>
  <div class="datepicker__container">
    <table class="datepicker__table">
      <thead class="datepicker__days__label">
        <tr class="tr">
          <th class="datepicker__day__label">Lun</th>
          <th class="datepicker__day__label">Mar</th>
          <th class="datepicker__day__label">Mer</th>
          <th class="datepicker__day__label">Jeu</th>
          <th class="datepicker__day__label">Ven</th>
          <th class="datepicker__day__label">Sam</th>
          <th class="datepicker__day__label">Dim</th>
        </tr>
      </thead>
      <tbody class="datepicker__table__content">
        <tr v-for="(week, index) in weeks" :key="index" class="datepicker__table__line">
          <td v-for="(day, index) in week" :key="index" @click.stop="select(day, $event)" :class="{
            datepicker__table__day: isMomentInstance(day),
            datepicker__table__period: isInPeriod(day),
            datepicker__table__first: isFirstDay(day),
            datepicker__table__last: isLastDay(day) }"><span v-if="isMomentInstance(day)">{{ day.date() }} </span></td>
        </tr>
      </tbody>
    </table>
    <button class="button alert" @click="resetPeriod()">Recommencer la sélection</button>
  </div>
</template>

<script>
import moment from 'moment'
import MonthGenerator from '../modules/MonthGenerator'

export default {
  name: 'DaterangePicker',
  data () {
    return {
      firstDate: moment(),
      lastDate: moment().add(1, 'day'),
      weeks: []
    }
  },
  methods: {
    isMomentInstance (day) {
      return day instanceof moment
    },
    isInPeriod (day) {
      if (day instanceof moment && this.firstDate instanceof moment && this.lastDate instanceof moment) {
        return day.isBetween(this.firstDate, this.lastDate, 'day', '()')
      }
      return false
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
    select (day, event) {
      if (day instanceof moment) {
        if (day.isBefore(this.firstDate, 'day')) {
          this.firstDate = day.clone()
        } else if (day.isAfter(this.lastDate, 'day')) {
          this.lastDate = day.clone()
        }
        this.$emit('select', day)
      }
    },
    resetPeriod () {
      this.firstDate = moment()
    }
  },
  created: function () {
    this.weeks = MonthGenerator.weeks(this.firstDate)
  }
}
</script>

<style lang="scss">
$dark-color: #c66900;
$main-color: #ff9800;
$width: 280px;

.datepicker__table__period {
  background: $main-color;
  border-radius: 0!important;
}
.datepicker__table__first {
  background: $main-color;
  border-radius: 50% 0 0 50% !important;
}
.datepicker__table__last {
  background: $main-color;
  border-radius: 0 50% 50% 0 !important;
}
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
.datepicker__table {
  border-collapse: collapse;
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
