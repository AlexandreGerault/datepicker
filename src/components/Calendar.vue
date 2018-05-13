<template>
  <div class="ui-datepicker">
    <div class="datepicker-header">
        <p class="has-text-centered">
          <span class="button previous" @click="previousMonth">
            <i class="fas fa-angle-left"></i>
          </span>
          <span id="month">
            {{ month }}
          </span>
          <span id="year">
            {{ year }}
          </span>
          <span class="button next" @click="nextMonth">
            <i class="fas fa-angle-right"></i>
          </span>
        </p>
    </div>
    <table class="table">
      <thead class="datepicker-header">
        <tr class="tr">
          <th>Lun</th>
          <th>Mar</th>
          <th>Mer</th>
          <th>Jeu</th>
          <th>Ven</th>
          <th>Sam</th>
          <th>Dim</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in weeks" :key="index">
          <td v-for="(day, index) in week" :key="index" @click="select" :class="{ active: isSelected(day) }"><span v-if="typeof(day) === 'object'" >{{ day.date() }} </span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import moment from 'moment'

export default {
  name: 'Calendar',
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
      let firstMonthDay = moment(this.date.date(1))
      let lastMonthDay = moment(this.date.endOf('month'))
      let day = firstMonthDay.clone()
      let isFirstWeek = true

      while (moment(day).isSameOrBefore(lastMonthDay)) {
        let currentDay = day.clone()
        let line = []
        let daysInWeek = 0

        /* A calendar line from Monday to Sunday */
        for (let i = 0; i < 7; i++) {
          if (moment(currentDay).isSameOrBefore(lastMonthDay)) {
            if ((isFirstWeek && i >= firstMonthDay.weekday()) || (!isFirstWeek)) {
              line.push(currentDay.clone())
              currentDay.add(1, 'day')
              daysInWeek++
            } else if (isFirstWeek && i < firstMonthDay.weekday()) {
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
    select (event) {
      this.selectedDay = moment({
        y: this.date.year(),
        m: this.date.month(),
        d: event.target.innerText
      })
    },
    isSelected (day) {
      if (typeof (day) === 'object') {
        return this.selectedDay.date() === day.date()
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

<style>
td:empty {
  cursor: default;
}
td {
  cursor: pointer;
  text-align: center !important;
  vertical-align: middle !important;
  width: 58px;
  height: 58px;
  padding: 5px !important;
  border-radius: 50%;
}
td:not(:empty):hover {
  background: rgba(0,0,0,0.5);
  transition: background 0.2s;
}
.active {
  background: rgba(0,0,0,0.5);
}
</style>
