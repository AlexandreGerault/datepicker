<template>
  <div id="app">
    <div class="control">
      <h3 class="centered-text">Jours de semaines</h3>
      <p>Désactiver :<br/>
      <span v-for="(day,index) in disabledWeekdays" :key='index'>
        <input
        type='checkbox'
        v-model='day.disabled'>
        Désactiver {{ day.name }}<br/>
      </span>
      </p>
      <p class="centered-text">Jour : {{ dayLabel }}</p>
    </div>
    <div class="control">
      <h3 class="centered-text">Jours particuliers</h3>
      <div class="control-group">
        <h4 class="centered-text">Désactiver un jour</h4>
        <ul>
          <li v-for="(day,index) in this.disabledDays" :key="index">
            {{ day }}
          </li>
        </ul>
        <Calendar :disabled-weekdays="disabledWeekdays" :disabled-days="disabledDays" disable-before-today="true" @select="selectDayToDisable($event, day)"/>
        <button class="button alert" @click="addDayToDisable()">Désactiver ce jour</button>
      </div>
      <div class="control-group">
        <h4 class="centered-text">Réactiver un jour</h4>
        <Calendar :disabled-weekdays="disabledWeekdays" disable-before-today="true" v-on:select="selectDayToEnable($event, day)"/>
        <button class="button success" @click="removeDayToDisable()">Réactiver ce jour</button>
      </div>
    </div>
    <div class="control">
      <h3 class="centered-text">Périodes</h3>
      <div class="control-group" style="display: block;">
        <ul>
          <li v-for="(period, index) in this.periods.periods" :key="index">
            From {{ period.start.format('dddd D MMMM YYYY') }} to {{ period.end.format('dddd D MMMM YYYY') }}
            <button @click="removePeriod(period)" class="button alert" style="display: inline">Supprimer cette période</button>
          </li>
        </ul>
      </div>
      <div class="control-group">
        <daterange-picker @selectFirstDay='selectFirstPeriodDay($event)' @selectLastDay='selectLastPeriodDay($event)' />
      </div>
      <button class="button success" @click="addPeriod()">Désactiver cette période</button>
    </div>
    <div class="result">
      <h3 class="centered-text">Résultat final</h3>
      <Calendar :disabled-weekdays="disabledWeekdays" disable-before-today="true" :disabled-days="disabledDays" :disabled-periods="periods" v-on:select="updateDay($event, day)"/>
    </div>

    <div>
      <Agenda :disabled-weekdays="disabledWeekdays" disable-before-today="true" :disabled-days="disabledDays" :disabled-periods="periods" v-on:select="updateDay($event, day)"/>
    </div>
  </div>
</template>

<script>
import Calendar from './components/Calendar'
import DaterangePicker from './components/DaterangePicker'
import Agenda from './components/Agenda'
import moment from 'moment'
import Weekday from './modules/Weekday'
import Period from './modules/PeriodFactory'
import PeriodsCollection from './modules/PeriodsCollectionFactory'

const dateFormat = 'dddd D MMMM YYYY'

export default {
  name: 'App',
  data () {
    return {
      disabledWeekdays: [
        new Weekday('lundi', 0, false),
        new Weekday('mardi', 1, false),
        new Weekday('mercredi', 2, false),
        new Weekday('jeudi', 3, false),
        new Weekday('vendredi', 4, false),
        new Weekday('samedi', 5, false),
        new Weekday('dimanche', 6, false)
      ],
      disabledDays: [],
      day: moment(),
      dayToDisable: moment(),
      dayToEnable: moment(),
      periods: PeriodsCollection([]),
      firstPeriodDay: moment(),
      lastPeriodDay: moment().add(1, 'day')
    }
  },
  components: {
    Calendar,
    DaterangePicker,
    Agenda
  },
  computed: {
    dayLabel () {
      if (this.day instanceof moment) {
        return this.day.format(dateFormat)
      }
    }
  },
  methods: {
    updateDay (day) {
      this.day = day
      /* AJAX REQUEST TO GET SCHEDULES */
    },
    selectDayToDisable (day) {
      this.dayToDisable = day
    },
    selectDayToEnable (day) {
      this.dayToEnable = day
    },
    selectFirstPeriodDay (event) {
      this.firstPeriodDay = event.day
    },
    selectLastPeriodDay (event) {
      this.lastPeriodDay = event.day
    },
    addDayToDisable () {
      if (!this.disabledDays.includes(this.dayToDisable.format(dateFormat))) {
        this.disabledDays.push(this.dayToDisable.format(dateFormat))
      }
    },
    removeDayToDisable () {
      if (this.disabledDays.includes(this.dayToEnable.format(dateFormat))) {
        this.disabledDays.splice(this.disabledDays.indexOf(this.dayToEnable.format(dateFormat)), 1)
      }
    },
    addPeriod () {
      if (this.lastPeriodDay instanceof moment && this.firstPeriodDay instanceof moment && this.lastPeriodDay.isAfter(this.firstPeriodDay, 'day')) {
        this.periods.add(Period(this.firstPeriodDay.clone(), this.lastPeriodDay.clone()))
      }
    },
    removePeriod (period) {
      this.periods.remove(period)
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.centered-text {
  text-align: center;
  padding: 10px;
}
.control {
  background: lightgray;
  padding: 10px 10px;
  margin: 0;
  display: inline-block;
  vertical-align: top;
}
.control p {
  margin: 0;
}
.control-group {
  display: inline-block;
  margin-right: 15px;
  vertical-align: top;

  &:last-child {
    margin-right: 0;
  }
}
.button {
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: block;
    font-size: 16px;
    margin: 10px auto;

    &.alert {
      background-color: rgb(175, 76, 76); /* Red */
    }

    &.success {
      background-color: rgb(87, 175, 76); /* Green */
    }
}
.result {
  background: lightblue;
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  display: inline-block;
  vertical-align: top;
}
</style>
