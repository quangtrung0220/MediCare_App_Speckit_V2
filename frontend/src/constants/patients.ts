/*
 * Created: 2026-05-03
 * Purpose: Reusable labels and tokens for patient pages.
 * Owner: Quang Trung
 */

export const PATIENTS_PAGE = {
  TITLE: "Danh sách bệnh nhân",
  TOTAL: (n: number) => `Tổng cộng: ${n} bệnh nhân`,
  NO_PATIENTS: "Không có bệnh nhân",
  LOADING: "Đang tải danh sách bệnh nhân...",
  EMPTY_TITLE: "Không có bệnh nhân",
  EMPTY_DESC: "Hiện chưa có bệnh nhân nào trong hệ thống.",
};

export default PATIENTS_PAGE;
