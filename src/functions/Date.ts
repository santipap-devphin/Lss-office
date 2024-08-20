import moment from "moment";
export const toThaiDateString = (date: Date, format: string) => {
  const dateMoment = moment(date)
  const christianYear = dateMoment.format('YYYY')
  const buddhishYear = (parseInt(christianYear) + 543).toString()
  return dateMoment
    .format(format.replace('YYYY', buddhishYear).replace('YY', buddhishYear.substring(2, 4)))
    .replace(christianYear, buddhishYear)
};

export const overDue = (paymentDate: Date, dueDate: Date) => {
  const months = moment(paymentDate).diff(moment(dueDate), "months");
  const days = moment(paymentDate).diff(moment(dueDate), "days");
  return {
    months: months,
    days: months > 0 ? days % months : days,
  };
};
