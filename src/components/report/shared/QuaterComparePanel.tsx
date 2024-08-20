import { ChangeEvent, FC, useCallback, useEffect, useState, memo } from "react";

import { monthsToQuarters } from "date-fns";

import { Col, Form, Row } from "react-bootstrap";

const QuaterComparePanel: FC<{
  onChanged(year: number, quarter: number): void;
  onCompareChanged(year: number, quarter: number): void;
}> = ({ onChanged, onCompareChanged }) => {
  const [years, setYears] = useState<{ BE: number; AD: number }[]>([
    { BE: new Date().getFullYear() + 543, AD: new Date().getFullYear() },
  ]);
  const [quater, setQuater] = useState<string[]>(["1", "2", "3", "4"]);
  const [compareQuater, setCompareQuater] = useState<string[]>([
    "1",
    "2",
    "3",
    "4",
  ]);

  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedQuarter, setSelectedQuarter] = useState<string>(() => {
    return monthsToQuarters(new Date().getMonth() + 1).toString();
  });
  const [selectedCompareYear, setSelectedCompareYear] = useState<string>(() => {
    const currentQuarter = monthsToQuarters(new Date().getMonth() + 1);
    return (currentQuarter > 1
      ? new Date().getFullYear().toString()
      : new Date().getFullYear() - 1).toString();
  });
  const [selectedCompareQuarter, setSelectedCompareQuarter] = useState<string>(
    () => {
      const currentQuarter = monthsToQuarters(new Date().getMonth() + 1);
      return (currentQuarter > 1 ? currentQuarter - 1 : 4).toString();
    }
  );

  const handleYearChanged = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedYear(e.target.value);
      setSelectedQuarter(() => "1");

      setQuater(() => ["1", "2", "3", "4"]);

      setSelectedQuarter(() => "1");

      onChanged(Number(e.target.value), Number(1));
    },
    [onChanged]
  );

  const handleQuarterChanged = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedQuarter(() => e.target.value);

      onChanged(Number(selectedYear), Number(e.target.value));
    },
    [onChanged, selectedYear]
  );

  const handleCompareYearChanged = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedCompareYear(e.target.value);
      setSelectedCompareQuarter(() => "1");

      setCompareQuater(() => ["1", "2", "3", "4"]);

      setSelectedCompareQuarter(() => "1");

      onCompareChanged(Number(e.target.value), Number(1));
    },
    [onCompareChanged]
  );

  const handleCompareQuarterChanged = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedCompareQuarter(() => e.target.value);
      onCompareChanged(Number(selectedCompareYear), Number(e.target.value));
    },
    [onCompareChanged, selectedCompareYear]
  );

  const handleGenerateYears = useCallback(() => {
    const currentYear = new Date().getUTCFullYear();
    let tempYears: { AD: number; BE: number }[] = [];
    for (let i = currentYear; i >= currentYear - 20; i--) {
      tempYears.push({ BE: i + 543, AD: i });
    }

    setYears(() => tempYears);
  }, []);

  useEffect(() => {
    handleGenerateYears();
  }, [handleGenerateYears]);

  return (
    <>
      <Row className="mb-2">
        <Col className="d-flex align-items-center justify-content-end">ปี:</Col>
        <Col>
          <Form.Select value={selectedYear} onChange={handleYearChanged}>
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
            {quater.map((q, i) => (
              <option value={q} key={i}>
                {q}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex align-items-center justify-content-end">
          ปีที่เทียบ:
        </Col>
        <Col>
          <Form.Select
            value={selectedCompareYear}
            onChange={handleCompareYearChanged}
          >
            {years.map((year, i) => (
              <option key={i} value={year.AD}>
                {year.BE}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col className="d-flex align-items-center justify-content-end">
          ไตรมาสที่เทียบ:
        </Col>
        <Col>
          <Form.Select
            value={selectedCompareQuarter}
            onChange={handleCompareQuarterChanged}
          >
            {compareQuater.map((q, i) => (
              <option value={q} key={i}>
                {q}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
    </>
  );
};

export default memo(QuaterComparePanel);
