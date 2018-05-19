<template>
  <div id="app">
    <div class="control">
      <h3 class="centered-text">Jours de semaines</h3>
      <p>Désactiver :<br/>
      <span v-for="(day,index) in this.disabledWeekDays" :key='index'>
        <input
        type='checkbox'
        v-model='day.checked'>
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
        <Calendar :disabled-weekdays="disabledWeekDays" :disabled-days="disabledDays" v-on:select="selectDayToDisable($event, day)"/>
        <button class="button alert" @click="addDayToDisable()">Désactiver ce jour</button>
      </div>
      <div class="control-group">
        <h4 class="centered-text">Réactiver un jour</h4>
        <Calendar :disabled-weekdays="disabledWeekDays" :disabled-days="reverseDisabledDays" v-on:select="selectDayToEnable($event, day)"/>
        <button class="button success" @click="removeDayToDisable()">Réactiver ce jour</button>
      </div>
    </div>
    <div class="result">
      <h3 class="centered-text">Résultat final</h3>
      <Calendar :disabled-weekdays="disabledWeekDays" :disabled-days="disabledDays" v-on:select="updateDay($event, day)"/>
    </div>
  </div>
</template>

<script>
import Calendar from './components/Calendar'
import moment from 'moment'

const dateFormat = 'dddd D MMMM YYYY'

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
      disabledDays: [
        moment().add(1, 'day').format(dateFormat)
      ],
      day: moment(),
      dayToDisable: moment(),
      dayToEnable: moment()
    }
  },
  components: {
    Calendar
  },
  computed: {
    dayLabel () {
      if (this.day instanceof moment) {
        return this.day.format(dateFormat)
      }
    },
    reverseDisabledDays () {
      let result = []
      if (this.day instanceof moment) {
        for (var i = 1; i <= this.day.daysInMonth(); i++) {
          if (!this.disabledDays.includes(moment().date(i).format(dateFormat))) {
            result.push(moment().date(i).format(dateFormat))
          }
        }
      }
      console.log(result)
      return result
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
    addDayToDisable () {
      if (!this.disabledDays.includes(this.dayToDisable.format(dateFormat))) {
        this.disabledDays.push(this.dayToDisable.format(dateFormat))
      }
    },
    removeDayToDisable () {
      if (this.disabledDays.includes(this.dayToEnable.format(dateFormat))) {
        this.disabledDays.splice(this.disabledDays.indexOf(this.dayToEnable.format(dateFormat)), 1)
      }
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
  border: 1px solid gray;
  display: inline-block;
  width: 300px;
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
