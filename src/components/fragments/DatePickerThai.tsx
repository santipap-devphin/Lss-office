import { FC } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";

import "react-datepicker/dist/react-datepicker.css";

registerLocale("th", th);

const DatePickerThai: FC<{
  selected: Date;
  onChanged(date: any): void;
  locale: string;
}> = ({ selected, onChanged, locale, ...rest }) => {
  const handleCalendarChanged = () => {
    const els = document.querySelectorAll(
      ".react-datepicker__current-month"
    ) as NodeListOf<Element>;
    els.forEach((el) => {
      let parts = (el as HTMLElement).innerText.split(" ");
      if (parts.length > 1) {
        parts[1] = (Number.parseInt(parts[1]) + 543).toString();
        (el as HTMLElement).innerText = parts.join(" ");
      }
    });
  };

  return (
    <DatePicker
      selected={selected}
      onChange={onChanged}
      locale={locale}
      onSelect={() => {
        // const el = document.querySelector(
        //   ".react-datepicker__input-container .form-control"
        // );
        // if (el) {
        //   setTimeout(() => {
        //     let parts = el.value.split("/");
        //     if (parts.length === 3) {
        //       parts[2] = Number.parseInt(parts[2]) + 543;
        //       el.value = parts.join("/");
        //       //console.log(el.value);
        //     }
        //   }, 100);
        // }
      }}
      onCalendarOpen={handleCalendarChanged}
      onMonthChange={handleCalendarChanged}
      onYearChange={handleCalendarChanged}
      dateFormat="dd/MM/yyyy"
      {...rest}
    />
  );
};

export default DatePickerThai;
