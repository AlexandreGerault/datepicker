<template>
  <div class="ui-datepicker">
    <table class="table">
      <thead class="datepicker-header">
        <th>
          <span class="button previous" @click="previousMonth">
            <i class="fas fa-angle-left"></i>
          </span>
        </th>
        <th colspan="5">
          <p class="has-text-centered">
            <span id="month">
              {{ month() }}
            </span>
            <span id="year">
              {{ year() }}
            </span>
          </p>
        </th>
        <th>
          <span class="button next" @click="nextMonth">
            <i class="fas fa-angle-right"></i>
          </span>
        </th>
      </thead>
      <tbody id='updateCalendarForm'>
        <tr class="tr">
          <th>Lun</th>
          <th>Mar</th>
          <th>Mer</th>
          <th>Jeu</th>
          <th>Ven</th>
          <th>Sam</th>
          <th>Dim</th>
        </tr>
        <tr v-for="week in weeks">
          <td v-for="day in week" @click="select"><span v-if="typeof(day) === 'object'" >{{ day.date() }} </span></td>
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
      selected: moment(),
      weeks: []
    }
  },
  methods: {
    month () {
      return this.date.format('MMMM')
    },
    year () {
      return this.date.year()
    },
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
            if (isFirstWeek && i >= firstMonthDay.weekday()) {
              line.push(currentDay.clone())
              currentDay.add(1, 'day')
              daysInWeek++
            } else if (isFirstWeek && i < firstMonthDay.weekday()) {
              console.log('Push empty cell')
              line.push('')
            }

            if (!isFirstWeek) {
              line.push(currentDay.clone())
              currentDay.add(1, 'day')
              daysInWeek++
            }
          } else {
            console.log('Push empty cell')
            line.push('')
          }
        }

        day.add(daysInWeek, 'day')
        console.log(line)
        weeks.push(line)
        isFirstWeek = false
      }
      return weeks
    },
    select (event) {
      let year = this.date.year()
      let month = this.date.month()
      let day = event.target.innerText
      this.selected = moment({ y: year, m: month, d: day })
    },
    isSelected (element) {
      console.log(element)
      return this.date.date() === element.innerHTML
    }
  },
  created: function () {
    this.weeks = this.getWeeks()
    this.date = moment()
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
}
td:not(:empty):hover {
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  transition: background 0.2s;
}
.selected {
  background: rgba(0,0,0,0.5);
}
</style>
