export const ThaiLocaleText = {
  // Root
  noRowsLabel: "ไม่มีรายการ",
  noResultsOverlayLabel: "ไม่พบผลลัพธ์",
  errorOverlayDefaultLabel: "เกิดข้อผิดพลาด.",

  // Density selector toolbar button text
  toolbarDensity: "หนาแน่น",
  toolbarDensityLabel: "รูปแบบ",
  toolbarDensityCompact: "กะทัดรัด",
  toolbarDensityStandard: "มาตรฐาน",
  toolbarDensityComfortable: "สบายตา",

  // Columns selector toolbar button text
  toolbarColumns: "คอลัมน์",
  toolbarColumnsLabel: "เลือกคอลัมน์",

  // Filters toolbar button text
  toolbarFilters: "ตัวกรอง",
  toolbarFiltersLabel: "แสดงตัวกรอง",
  toolbarFiltersTooltipHide: "ซ่อนตัวกรอง",
  toolbarFiltersTooltipShow: "แสดงตัวกรอง",
  toolbarFiltersTooltipActive: (count: number) =>
    count !== 1 ? `${count} ตัวกรองที่ใช้งาน` : `${count} ตัวกรองที่ใช้งาน`,

  // Export selector toolbar button text
  toolbarExport: "ส่งออก",
  toolbarExportLabel: "ส่งออก",
  toolbarExportCSV: "ดาวน์โหลดเป็น CSV",
  toolbarExportPrint: "พิมพ์",

  // Columns panel text
  columnsPanelTextFieldLabel: "ค้นหาคอลัมน์",
  columnsPanelTextFieldPlaceholder: "ชื่อคอลัมน์",
  columnsPanelDragIconLabel: "จัดลำดับคอลัมน์",
  columnsPanelShowAllButton: "แสดงทั้งหมด",
  columnsPanelHideAllButton: "ซ่อนทั้งหมด",

  // Filter panel text
  filterPanelAddFilter: "เพิ่มตัวกรอง",
  filterPanelDeleteIconLabel: "ลบ",
  filterPanelLinkOperator: "ตัวดำเนินการลอจิก",
  filterPanelOperators: "โอเปอเรเตอร์", // TODO v6: rename to filterPanelOperator
  filterPanelOperatorAnd: "และ",
  filterPanelOperatorOr: "หรือ",
  filterPanelColumns: "คอลัมน์",
  filterPanelInputLabel: "ค่า",
  filterPanelInputPlaceholder: "ค่าตัวกรอง",

  // Filter operators text
  filterOperatorContains: "มีค่า",
  filterOperatorEquals: "เท่ากับ",
  filterOperatorStartsWith: "เริ่มต้นด้วย",
  filterOperatorEndsWith: "ลงท้ายด้วย",
  filterOperatorIs: "เป็น",
  filterOperatorNot: "ไม่ใช่",
  filterOperatorAfter: "หลังจาก",
  filterOperatorOnOrAfter: "อยู่บนหรือหลัง",
  filterOperatorBefore: "ก่อน",
  filterOperatorOnOrBefore: "อยู่บนหรือก่อนหน้า",
  filterOperatorIsEmpty: "มีค่าว่าง",
  filterOperatorIsNotEmpty: "ไม่เป็นค่าว่าง",
  filterOperatorIsAnyOf: "เป็นใดๆ ของ",

  // Filter values text
  filterValueAny: "ใดๆ",
  filterValueTrue: "จริง",
  filterValueFalse: "เท็จ",

  // Column menu text
  columnMenuLabel: "เมนู",
  columnMenuShowColumns: "แสดงคอลัมน์",
  columnMenuFilter: "กรอง",
  columnMenuHideColumn: "ซ่อน",
  columnMenuUnsort: "ยกเลิกการจัดเรียง",
  columnMenuSortAsc: "เรียงตามมากไปหาน้อย",
  columnMenuSortDesc: "เรียงตามน้อยไปหามาก",

  // Column header text
  columnHeaderFiltersTooltipActive: (count: number) =>
    count !== 1 ? `${count} ตัวกรองที่ใช้งาน` : `${count} ตัวกรองที่ใช้งาน`,
  columnHeaderFiltersLabel: "แสดงตัวกรอง",
  columnHeaderSortIconLabel: "เรียงลำดับ",

  // Rows selected footer text
  footerRowSelected: (count: number) =>
    count !== 1
      ? `${count?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} แถวที่เลือก`
      : `${count?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} แถวที่เลือก`,

  // Total row amount footer text
  footerTotalRows: "แถวทั้งหมด:",

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
    `${visibleCount?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} of ${totalCount?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: "การเลือกช่องทำเครื่องหมาย",
  checkboxSelectionSelectAllRows: "เลือกแถวทั้งหมด",
  checkboxSelectionUnselectAllRows: "ยกเลิกการเลือกแถวทั้งหมด",
  checkboxSelectionSelectRow: "เลือกแถว",
  checkboxSelectionUnselectRow: "ยกเลิกการเลือกแถว",

  // Boolean cell text
  booleanCellTrueLabel: "ใช่",
  booleanCellFalseLabel: "ไม่",

  // Actions cell more text
  actionsCellMore: "แสดงมากกว่า",

  // Column pinning text
  pinToLeft: "ปักหมุดไปทางซ้าย",
  pinToRight: "ปักหมุดไปทางขวา",
  unpin: "ลบหมุด",

  // Tree Data
  treeDataGroupingHeaderName: "กลุ่ม",
  treeDataExpand: "ดูลูก",
  treeDataCollapse: "ซ่อนลูก",

  // Grouping columns
  groupingColumnHeaderName: "กลุ่ม",
  groupColumn: (name: string) => `จัดกลุ่มโดย ${name}`,
  unGroupColumn: (name: string) => `หยุดการจัดกลุ่มโดย ${name}`,

  // Master/detail
  expandDetailPanel: "ขยาย",
  collapseDetailPanel: "ยุบ",

  // Used core components translation keys
  MuiTablePagination: {},

  // Row reordering text
  rowReorderingHeaderName: "การเรียงลำดับแถวใหม่",
};
