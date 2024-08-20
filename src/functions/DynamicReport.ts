export const dynamicReportParameterType = {
    Text: "TEXT",
    Date: "DATE",
    DateTime: "DATE_TIME",
    Number: "NUMBER",
    FlagYN: "FLAG_YN",
    CompanyOptions: "COMPANY_OPTIONS",
    AccountTypeOptions: "ACCOUNT_TYPE_OPTIONS",
    CEYearOptions: "CE_YEAR_OPTIONS",
    BEYearOptions: "BE_YEAR_OPTIONS",
    QuarterOptions: "QUARTER_OPTIONS",
    MonthOptions: "Month_OPTIONS",
}

export const dynamicReportParameterTypeOptions = [
    { value: "TEXT", label: "ข้อความ" },
    { value: "DATE", label: "วันที่" },
    { value: "DATE_TIME", label: "วันที่และเวลา" },
    { value: "NUMBER", label: "ตัวเลข" },
    { value: "FLAG_YN", label: "Flag Y/N" },
    { value: "COMPANY_OPTIONS", label: "ตัวเลือกบริษัท" },
    { value: "ACCOUNT_TYPE_OPTIONS", label: "ตัวเลือกประเภทบัญชี" },
    { value: "CE_YEAR_OPTIONS", label: "ตัวเลือกปี (รับค่า ค.ศ.)" },
    { value: "BE_YEAR_OPTIONS", label: "ตัวเลือกปี (รับค่า พ.ศ.)" },
    { value: "QUARTER_OPTIONS", label: "ตัวเลือกไตรมาส" },
    { value: "Month_OPTIONS", label: "ตัวเลือกเดือน" }
]