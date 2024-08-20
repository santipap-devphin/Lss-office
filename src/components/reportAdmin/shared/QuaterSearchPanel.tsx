import { ChangeEvent, FC, useCallback, useEffect, useState, memo } from "react";

import { monthsToQuarters, format } from "date-fns";
import th from "date-fns/locale/th";

import { Col, Form } from "react-bootstrap";

const QuaterSearchPanel: FC<{
  onChanged(year: number, quarter: number, month: number): void;
}> = ({ onChanged }) => {
  const [years, setYears] = useState<{ BE: number; AD: number }[]>([]);
  const [quater, setQuater] = useState<string[]>([]);
  const [months, setMonths] = useState<{ value: string; label: string }[]>([]);

  const [selectedYear, setSelectedYear] = useState<string>("0");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("0");
  const [selectedMonth, setSelectedMonth] = useState<string>("0");

  const handleYearChanged = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedYear(e.target.value);
      setSelectedQuarter(() => "0");
      setSelectedMonth(() => "0");
      if (new Date().getFullYear() === Number(e.target.value)) {
        let tempQuater: string[] = [];
        for (let i = monthsToQuarters(new Date().getMonth() + 1); i >= 1; i--) {
          tempQuater.push(i.toString());
        }
        setQuater(() => tempQuater.sort((a, b) => Number(a) - Number(b)));
      } else {
        setQuater(() => ["1", "2", "3", "4"]);
      }
      setSelectedQuarter(() => "0");

      onChanged(Number(e.target.value), Number(0), Number(0));
    },
    [onChanged]
  );

  const handleQuarterChanged = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedQuarter(() => e.target.value);
      setSelectedMonth(() => "0");

      const endMonth = Number(e.target.value) * 3;
      const startMonth = endMonth - 3;

      let tempMonths: { value: string; label: string }[] = [];
      for (let i = startMonth; i < endMonth; i++) {
        tempMonths.push({
          value: (i + 1).toString(),
          label: format(new Date().setMonth(i), "LLLL", { locale: th }),
        });
      }

      setMonths(() => tempMonths);

      onChanged(Number(selectedYear), Number(e.target.value), Number(0));
    },
    [onChanged, selectedYear]
  );

  const handleMonthChanged = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedMonth(() => e.target.value);
      onChanged(
        Number(selectedYear),
        Number(selectedQuarter),
        Number(e.target.value)
      );
    },
    [onChanged, selectedQuarter, selectedYear]
  );

  const handleGenerateYears = useCallback(() => {
    const currentYear = new Date().getUTCFullYear();
    let tempYears: { AD: number; BE: number }[] = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      tempYears.push({ BE: i + 543, AD: i });
    }

    setYears(() => tempYears);
  }, []);

  useEffect(() => {
    handleGenerateYears();
  }, [handleGenerateYears]);

  return (
    <>
      <Col className="d-flex align-items-center justify-content-end">ปี:</Col>
      <Col>
        <Form.Select value={selectedYear} onChange={handleYearChanged}>
          <option value="0">เลือกปี</option>
          {years.map((year, i) => (
            <option key={i} value={year.AD}>
              {year.BE}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col className="d-flex align-items-center justify-content-end">
        ไตรมาส:
      </Col>
      <Col>
        <Form.Select value={selectedQuarter} onChange={handleQuarterChanged}>
          <option value="0">เลือกไตรมาส</option>
          {quater.map((q, i) => (
            <option value={q} key={i}>
              {q}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col className="d-flex align-items-center justify-content-end">
        เดือน:
      </Col>
      <Col>
        <Form.Select value={selectedMonth} onChange={handleMonthChanged}>
          <option value="0">เลือกเดือน</option>
          {months.map((m, i) => (
            <option key={i} value={m.value}>
              {m.label}
            </option>
          ))}
        </Form.Select>
      </Col>
    </>
  );
};

export default memo(QuaterSearchPanel);
