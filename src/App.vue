<template>
  <div id="app">
    <p>Désactiver :<br/>
    <span v-for="(day,index) in this.disabledWeekDays" :key='index'>
      <input
      type='checkbox'
      v-model='day.checked'>
      Désactiver {{ day.name }}<br/>
    </span>
    </p>
    <p>Jour : {{ dayLabel }}</p>
    <Calendar :disabled-weekdays="disabledWeekDays" :disabled-days="disabledDays" v-on:select="updateDay($event, day)"/>
  </div>
</template>

<script>
import Calendar from './components/Calendar'
import moment from 'moment'

export default {
  name: 'App',
  data () {
    return {
      disabledWeekDays: [
        { name: 'lundi', index: 0, checked: false },
        { name: 'mardi', index: 1, checked: false },
        { name: 'mercredi', index: 2, checked: false },
        { name: 'jeudi', index: 3, checked: false },
        { name: 'vendredi', index: 4, checked: false },
        { name: 'samedi', index: 5, checked: false },
        { name: 'dimanche', index: 6, checked: false }
      ],
      disabledDays: [],
      day: moment()
    }
  },
  components: {
    Calendar
  },
  computed: {
    dayLabel () {
      if (this.day instanceof moment) {
        return this.day.format('dddd D MMMM')
      }
    }
  },
  methods: {
    updateDay (day) {
      this.day = day
      /* AJAX REQUEST TO GET SCHEDULES */
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  margin: auto;
  width: 280px;
}
</style>
