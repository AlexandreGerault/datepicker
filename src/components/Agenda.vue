<template>
  <div class="agenda">
    <div class="agenda__header__navigation">
      <span class="agenda__header__navigation__previous agenda__control" @click="previousMonth()"><i class="fas fa-angle-left"></i></span>
      <span class="agenda__header__navigation__label">{{ formated_month }} {{formated_year }}</span>
      <span class="agenda__header__navigation__next agenda__control" @click="nextMonth()"><i class="fas fa-angle-right"></i></span>
    </div>
    <table class="agenda__table">
      <thead class="agenda__days__label">
        <tr class="tr">
          <th class="agenda__day__label">Lun</th>
          <th class="agenda__day__label">Mar</th>
          <th class="agenda__day__label">Mer</th>
          <th class="agenda__day__label">Jeu</th>
          <th class="agenda__day__label">Ven</th>
          <th class="agenda__day__label">Sam</th>
          <th class="agenda__day__label">Dim</th>
        </tr>
      </thead>
      <tbody class="agenda__table__content">
        <tr v-for="(week, index) in weeks" :key="index" class="agenda__table__line">
          <td v-for="(day, index) in week" :key="index" @click="select($event, day)" :class="{
            agenda__table__cell__selected: isSelected(day),
            agenda__table__day: isMomentInstance(day),
            agenda__table__period: isInSelectedPeriod(day),
            agenda__table__first: isFirstSelectedPeriodDay(day),
            agenda__table__last: isLastSelectedPeriodDay(day),
            agenda__table__disabled__day: isDisabledDay(day) }"><span v-if="isMomentInstance(day)">{{ day.date() }} </span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
import MonthGenerator from '../modules/MonthGenerator'
import PeriodsCollection from '../modules/PeriodsCollectionFactory'

const dateFormat = 'dddd D MMMM YYYY'

export default {
  name: 'Agenda',
  props: {
    disabledWeekdays: [Array],
    disabledDays: [Array, String],
    disabledBeforeToday: {
      type: Boolean,
      default: true
    },
    disabledPeriods: {
      type: Object,
      default: () => { return PeriodsCollection([]) }
    },
    selectedPeriod: Object,
    min: {
      type: null,
      default: function () { return moment() }
    },
    max: {
      type: null,
      default: function () { return moment().add(1, 'year') }
    }
  },
  data () {
    return {
      date: moment(),
      selectedDay: ''
    }
  },
  computed: {
    month () {
      return this.date.format('MMMM')
    },
    year () {
      return this.date.year()
    },
    locale_day () {
      return this.selectedDay.format('dddd')
    },
    formated_month () {
      return this.date.format('MMM')
    },
    formated_year () {
      return this.date.format('YYYY')
    },
    formated_date () {
      return this.selectedDay.format('D')
    },
    formated_selected_month () {
      return this.selectedDay.format('MMM')
    },
    formated_selected_year () {
      return this.selectedDay.format('YYYY')
    },
    weeks () {
      return MonthGenerator.weeks(this.date)
    }
  },
  methods: {
    nextMonth () {
      this.date = moment(this.date.add(1, 'month'))
    },
    previousMonth () {
      this.date = moment(this.date.subtract(1, 'month'))
    },
    select (event, day) {
      if (day instanceof moment && !this.isDisabledDay(day)) {
        this.selectedDay = day.clone()
        let tmp = this.selectedDay.clone()
        this.$emit('select', {
          event: event,
          day: day,
          selected: tmp
        })
      }
    },
    isFirstSelectedPeriodDay (day) {
      if (day instanceof moment && this.selectedPeriod !== undefined) {
        return day.isSame(this.selectedPeriod.start, 'day')
      }
    },
    isLastSelectedPeriodDay (day) {
      if (day instanceof moment && this.selectedPeriod !== undefined) {
        return day.isSame(this.selectedPeriod.end, 'day')
      }
    },
    isSelected (day) {
      if (day instanceof moment && !this.isDisabledDay(day)) {
        return this.selectedDay.date() === day.date() && this.selectedDay.month() === day.month() && this.selectedDay.year() === day.year()
      }
      return false
    },
    /* Trick to bypass the impossibility of using the instanceof keyword with vuejs */
    isMomentInstance (day) {
      return day instanceof moment
    },
    isInSelectedPeriod (day) {
      if (day instanceof moment && this.selectedPeriod instanceof Object) {
        return this.selectedPeriod.contains(day)
      }
    },
    isDisabledWeekday (day) {
      if (day instanceof moment) {
        let disabledWeekday = false
        if (Array.isArray(this.disabledWeekdays)) {
          this.disabledWeekdays.forEach(weekday => {
            if (weekday.isWeeklyDisabled(day)) {
              disabledWeekday = true
            }
          })
        }
        return disabledWeekday
      }
      return false
    },
    isInPeriod (day) {
      return this.disabledPeriods.contains(day)
    },
    isDisabledDay (day) {
      if (day instanceof moment) {
        return !(day.isBetween(this.min, this.max, 'day', '[]')) || this.isInPeriod(day) || this.isDisabledWeekday(day) || (Array.isArray(this.disabledDays) && this.disabledDays.includes(day.format(dateFormat))) || (this.disableBeforeToday && day.isBefore(moment()))
      }
      return false
    }
  },
  created: function () {
    this.date = moment()
    this.selectedDay = this.date.clone()
  }
}
</script>

<style lang="scss">
$dark-color: #c66900;
$main-color: #ff9800;
$width: 280px;

.agenda {
  width: $width;
}
.agenda__table {
  border-collapse: collapse;
}
.agenda__table__period {
  background: $main-color;
  border-radius: 0!important;
}
.agenda__table__first {
  background: $main-color;
  border-radius: 25% 0 0 25% !important;
}
.agenda__table__last {
  background: $main-color;
  border-radius: 0 25% 25% 0 !important;
}
.agenda__control {
  position: absolute;
  cursor: pointer;
  font-size: 15px;
  color: $main-color;
  font-weight: 300;
  top: 15px;
}
.agenda__header__navigation {
  box-sizing: border-box;
  background: white;
  position: relative;
  padding: 7px;
  padding-top: 15px;
  text-align: center;
  font-size: 14px;
}
.agenda__header__navigation__label {
  text-transform: capitalize;
}
.agenda__header__navigation__previous {
  left: 62px;
}
.agenda__header__navigation__next {
  right: 62px;
}
.agenda__day__label {
  color: grey;
  font-weight: 400;
}
.agenda__day__disabled {
  color: lightgrey;
}
.agenda__table, .datepicker__header {
  background: white;
}
.agenda__table tr {
  height: $width / 7;
}
.agenda__table td, .datepicker__table th {
  width: $width / 7;
  text-align: center;
}
.agenda__table__day {
  font-size: 12px;
  text-align: center;
  font-weight: 300;
  cursor: pointer;
  transition: background .5s;
  transition-timing-function: ease;
  border-radius: 50%;
}
.agenda__table__day:hover {
  background: $main-color;
}
.agenda__table__cell__selected {
  background: $main-color;
}
.agenda__table__disabled__day {
  color: lightgray;
  cursor: default;

  &:hover {
    background: inherit;
  }
}
</style>
