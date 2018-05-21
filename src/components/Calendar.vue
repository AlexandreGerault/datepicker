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
      <div class="datepicker__header__navigation">
        <span class="datepicker__header__navigation__previous datepicker__control" @click="previousMonth()"><i class="fas fa-angle-left"></i></span>
        <span class="datepicker__header__navigation__label">{{ formated_month }} {{formated_year }}</span>
        <span class="datepicker__header__navigation__next datepicker__control" @click="nextMonth()"><i class="fas fa-angle-right"></i></span>
      </div>
    </div>
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
          <td v-for="(day, index) in week" :key="index" @click.stop="select($event,day)" :class="{
            datepicker__table__cell__selected: isSelected(day),
            datepicker__table__day: isMomentInstance(day),
            datepicker__table__disabled__day: isDisabledDay(day) }"><span v-if="isMomentInstance(day)">{{ day.date() }} </span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import moment from 'moment'

export default {
  name: 'Calendar',
  props: ['disabledWeekdays', 'disabledDays', 'disableBeforeToday'],
  data () {
    return {
      date: moment(),
      selectedDay: moment(),
      weeks: []
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
    }
  },
  methods: {
    nextMonth () {
      this.date = moment(this.date.add(1, 'month'))
      this.weeks = this.getWeeks()
    },
    previousMonth () {
      this.date = moment(this.date.subtract(1, 'month'))
      this.weeks = this.getWeeks()
    },
    getWeeks () {
      let weeks = []
      let firstMonthDay = this.date.startOf('month').clone()
      let lastMonthDay = this.date.endOf('month').clone()
      let day = firstMonthDay.clone()
      let isFirstWeek = true

      while (moment(day).isSameOrBefore(lastMonthDay)) {
        let currentDay = day.clone()
        let line = []
        let daysInWeek = 0

        /* A calendar line from Monday to Sunday */
        for (let i = 0; i < 7; i++) {
          if (moment(currentDay).isSameOrBefore(lastMonthDay)) {
            /* Adding new days
               But add a blank cell if we're before the first day */
            if ((isFirstWeek && i >= firstMonthDay.weekday()) || (!isFirstWeek)) {
              line.push(currentDay.clone())
              currentDay.add(1, 'day')
              daysInWeek++
            } else {
              line.push('')
            }
          } else {
            line.push('')
          }
        }

        day.add(daysInWeek, 'day')
        weeks.push(line)
        isFirstWeek = false
      }
      return weeks
    },
    select (event, day) {
      if (day instanceof moment && !this.isDisabledDay(day)) {
        this.selectedDay = moment().set('year', this.date.year()).set('month', this.date.month()).set('date', event.target.innerText)
        this.$emit('select', day)
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
    isDisabledWeekday (weekday) {
      if (weekday instanceof moment) {
        let disabledWeekday = false
        this.disabledWeekdays.forEach(function (day) {
          if (day.index === weekday.weekday() && day.checked === true) {
            disabledWeekday = true
          }
        })
        return disabledWeekday
      }
      return false
    },
    isDisabledDay (day) {
      if (day instanceof moment) {
        return this.isDisabledWeekday(day) || (Array.isArray(this.disabledDays) && this.disabledDays.includes(day.format('dddd D MMMM YYYY'))) || (this.disableBeforeToday && day.isBefore(moment()))
      }
      return false
    }
  },
  created: function () {
    this.weeks = this.getWeeks()
    this.date = moment()
    this.selectedDay = this.date.clone()
  }
}
</script>

<style lang="scss">
$dark-color: #c66900;
$main-color: #ff9800;
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
