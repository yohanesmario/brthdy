import * as moment from 'moment-timezone';

export class DateHelper {
  static getNextBirthdayTimestamp(
    birthdayDate: string,
    timezone: string,
  ): number {
    let birthday = moment(birthdayDate);
    let now = moment().tz(timezone);
    let date = birthday.date().toString();
    let month = (birthday.month() + 1).toString();
    let year = now.year().toString();

    if (parseInt(date) < 10) {
      date = `0${date}`;
    }
    if (parseInt(month) < 10) {
      month = `0${month}`;
    }

    let thisYearBirthday = moment.tz(
      `${year}-${month}-${date} 09:00:00`,
      timezone,
    );
    if (thisYearBirthday.valueOf() < now.valueOf()) {
      return thisYearBirthday.add(1, 'years').valueOf();
    } else {
      return thisYearBirthday.valueOf();
    }
  }
}
