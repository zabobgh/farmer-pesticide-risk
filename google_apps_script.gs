/**
 * Google Apps Script สำหรับรับข้อมูลจากแบบประเมินความเสี่ยงเกษตรกร นบก.1-56
 * บันทึกลง Google Sheet อัตโนมัติ พร้อมสร้างหัวตารางและจัดรูปแบบให้อัตโนมัติ
 *
 * วิธีใช้งาน:
 * 1. เปิด Google Sheet เปล่า หรือ Sheet ที่ต้องการเก็บข้อมูล
 * 2. ไปที่เมนู "ส่วนขยาย" (Extensions) -> "Apps Script"
 * 3. ลบโค้ดเดิมทั้งหมดใน Code.gs แล้ววางโค้ดชุดนี้ลงไป
 * 4. กดปุ่ม "บันทึก" (รูปแผ่นดิสก์)
 * 5. กดปุ่ม "ทำให้ใช้งานได้" (Deploy) -> "การทำให้ใช้งานได้รายการใหม่" (New deployment)
 * 6. เลือกประเภทเป็น "เว็บแอป" (Web app)
 * 7. ตั้งค่า:
 *    - คำอธิบาย: นบก.1-56 API
 *    - ดำเนินการในฐานะ: ตัวฉัน (Me)
 *    - ผู้ที่มีสิทธิ์เข้าถึง: ทุกคน (Anyone)  <-- สำคัญมาก! ต้องเลือก Anyone
 * 8. กด "ทำให้ใช้งานได้" และอนุญาตสิทธิ์ (Authorize access)
 * 9. คัดลอก "URL ของเว็บแอป" (Web App URL) ที่ขึ้นต้นด้วย https://script.google.com/macros/s/...
 * 10. นำ URL มาใส่ในตัวแปร GAS_URL ในไฟล์ index.html
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "นบก.1-56 Assessment API is running."
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  // รอคิวไม่เกิน 30 วินาที เพื่อป้องกันกรณีส่งพร้อมกันหลายคน
  lock.waitLock(30000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = {};

    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No payload received"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // กำหนดหัวตาราง (Headers)
    var headers = [
      "วันเวลาที่ส่งข้อมูล", "วันที่ประเมิน", "เลขบัตรประชาชน", "เลขบัตร ปชช. (จัดรูปแบบ)",
      "คำนำหน้า", "ชื่อ - นามสกุล", "เพศ", "อายุ (ปี)", "บ้านเลขที่/หมู่",
      "ตำบล", "อำเภอ", "จังหวัด", "ถนน/ซอย", "อาชีพหลัก", "พืชที่ปลูก",
      "ลักษณะการสัมผัสสารเคมี", "สถานบริการสุขภาพ", "ผู้สัมภาษณ์", "ตำแหน่งผู้สัมภาษณ์",
      "คะแนนส่วน A (9-17)", "คะแนนส่วน B (18-23)", "คะแนนรวม", "กลุ่มอาการ", "ระดับความเสี่ยง",
      "อาการกลุ่มที่ 1", "อาการกลุ่มที่ 2", "อาการกลุ่มที่ 3 (รุนแรง)",
      "โรคประจำตัว", "ทานยาคลายกล้ามเนื้อ", "สัมผัสสารเคมีล่าสุด", "จำนวนวันใช้/เดือน", "วัตถุประสงค์การใช้",
      "สารเคมี 1 (ชื่อการค้า)", "สารเคมี 1 (ชื่อสามัญ)",
      "สารเคมี 2 (ชื่อการค้า)", "สารเคมี 2 (ชื่อสามัญ)",
      "สารเคมี 3 (ชื่อการค้า)", "สารเคมี 3 (ชื่อสามัญ)",
      "สารเคมี 4 (ชื่อการค้า)", "สารเคมี 4 (ชื่อสามัญ)",
      "สารเคมี 5 (ชื่อการค้า)", "สารเคมี 5 (ชื่อสามัญ)",
      "ผลตรวจเลือด (เอ็นไซม์)",
      "ข้อ 9", "ข้อ 10", "ข้อ 11", "ข้อ 12", "ข้อ 13", "ข้อ 14", "ข้อ 15",
      "ข้อ 16", "ข้อ 17", "ข้อ 18", "ข้อ 19", "ข้อ 20", "ข้อ 21", "ข้อ 22", "ข้อ 23"
    ];

    // ตรวจสอบว่ามีแถวหัวตารางหรือยัง หากยังไม่มีให้สร้างและจัดรูปแบบให้อัตโนมัติ
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#0a5742");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(10);
      headerRange.setVerticalAlignment("middle");
      sheet.setFrozenRows(1);
    }

    // ฟังก์ชันช่วยแปลง Array ให้เป็นข้อความคั่นด้วยจุลภาค
    var formatArr = function(v) {
      if (!v) return "-";
      if (Array.isArray(v)) return v.length > 0 ? v.join(", ") : "-";
      return String(v);
    };

    var nowStr = Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy-MM-dd HH:mm:ss");

    // เตรียมแถวข้อมูลที่จะบันทึก
    var rowData = [
      nowStr,
      payload.survey_date || "-",
      "'" + (payload.id_card || "-"), // เติม ' เพื่อให้เลข 13 หลักคงสภาพเป็น Text
      payload.id_card_formatted || "-",
      payload.prefix || "-",
      payload.fullname || "-",
      payload.gender || "-",
      payload.age || "-",
      payload.address || "-",
      payload.tambon || "-",
      payload.amphoe || "บ้านแพ้ว",
      payload.province || "สมุทรสาคร",
      payload.road || "-",
      payload.occupation || "-",
      payload.crop_type || "-",
      formatArr(payload.involvement),
      payload.hospital || "-",
      payload.interviewer || "-",
      payload.interviewer_pos || "-",
      payload.score_a !== undefined ? payload.score_a : 0,
      payload.score_b !== undefined ? payload.score_b : 0,
      payload.score_total !== undefined ? payload.score_total : 0,
      payload.symptom_group || "-",
      payload.risk_level || "-",
      formatArr(payload.symptoms_g1),
      formatArr(payload.symptoms_g2),
      formatArr(payload.symptoms_g3),
      formatArr(payload.disease),
      payload.med_pyridostigmine || "-",
      payload.last_exposure || "-",
      payload.days_per_month || "-",
      formatArr(payload.chem_purpose),
      payload.chem1_trade || "-", payload.chem1_common || "-",
      payload.chem2_trade || "-", payload.chem2_common || "-",
      payload.chem3_trade || "-", payload.chem3_common || "-",
      payload.chem4_trade || "-", payload.chem4_common || "-",
      payload.chem5_trade || "-", payload.chem5_common || "-",
      payload.blood_result || "ไม่ได้ตรวจ",
      payload.q9 || "-", payload.q10 || "-", payload.q11 || "-", payload.q12 || "-", payload.q13 || "-",
      payload.q14 || "-", payload.q15 || "-", payload.q16 || "-", payload.q17 || "-", payload.q18 || "-",
      payload.q19 || "-", payload.q20 || "-", payload.q21 || "-", payload.q22 || "-", payload.q23 || "-"
    ];

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      status: "ok",
      row: sheet.getLastRow(),
      timestamp: nowStr
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
