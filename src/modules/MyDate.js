import moment from 'moment'

export default class MyDate {
  constructor (date, selected) {
    this.date = moment()
    this.isSelected = selected
  }
}
