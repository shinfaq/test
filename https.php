<?php
include 'message.php';
include 'config.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get data from api
    $inputJSON   = file_get_contents('php://input');
    $input       = json_decode($inputJSON, TRUE); //convert JSON into array
    $body        = $input['webhook_event']['body'];
    $room        = $input['webhook_event']['room_id'];
    $account     = $input['webhook_event']['from_account_id'];
    $to          = $input['webhook_event']['to_account_id'];
    $message_id  = $input['webhook_event']['message_id'];
    //==========================CONFIG=======================================
    $roomReply   = $room;
    // =====================================CHECK COMMAND======================================
    $commandOK   = false;
    $xinnghi_cm  = false;
    $batdau_cm   = false;
    $ketthuc_cm  = false;
    $huongdan_cm = false;
    $overtime_cm = false;
    $logtime_cm  = false;
    
    foreach ($leaveOff as $value) {
        if (strpos($body, $value) > -1) {
            $commandOK  = true;
            $xinnghi_cm = true;
        }
    }
    foreach ($start as $value) {
        if (strpos($body, $value) > -1) {
            $commandOK = true;
            $batdau_cm = true;
        }
    }
    foreach ($end as $value) {
        if (strpos($body, $value) > -1) {
            $commandOK  = true;
            $ketthuc_cm = true;
        }
    }
    if (strpos($body, $tutorial) > -1) {
        $commandOK   = true;
        $huongdan_cm = true;
    }
    foreach ($ot as $value) {
        if (strpos($body, $value) > -1) {
            $commandOK   = true;
            $overtime_cm = true;
        }
    }
    foreach ($logtime as $value) {
        if (strpos($body, $value) > -1) {
            $commandOK  = true;
            $logtime_cm = true;
        }
    }
    if ($commandOK) {
        //==========================KIEM TRA USER TON TAI=======================================
        $postFields = "{\r\n    \"app\":" . $staffApp['app'] . ",\r\n    \"query\":\"chatworkid = \\\"" . $account . "\\\"\",\r\n    \"fields\":[\"$id\",\"sessionworkid\"]\r\n}";
        $token      = $staffApp['apiToken'];
        $res        = getRecord($postFields, $token);
        $shiftId    = "";
        $workHour   = 0;
        $otHour     = 0;
        $offDay     = 0;
        if (count($res['records']) == 0) {
            $shiftId    = $res['records'][0]['sessionworkid']['value'];
            $postFields = "{\r\n    \"app\":" . $warningApp['app'] . ",\r\n    \"query\":\"shiftid = \\\"" . $shiftId . "\\\"\",\r\n    \"fields\":[\"workhour\",\"othours\",\"offdays\"]\r\n}";
            $token      = $warningApp['apiToken'];
            $data       = getRecord($postFields, $token);
            $workHour   = $data['records'][0]['workhour']['value'];
            $otHour     = $data['records'][0]['othours']['value'];
            $offDay     = $data['records'][0]['offdays']['value'];
            $body       = $userNotExist;
            messageReply($body, $account, $roomReply, $message_id, $cwToken);
            exit();
        }
        //==========================XIN OVERTIME=======================================
        if ($overtime_cm) {
            $date   = "";
            $start  = "";
            $end    = "";
            $type   = "";
            $reason = "";
            foreach ($ot as $value) {
                if (strpos($body, $value) > 0) {
                    
                    $x    = strpos($body, $value) + strlen($value) + 1;
                    $date = substr($body, $x, 10);
                    $x += 11;
                    $start = substr($body, $x, 5);
                    $x += 6;
                    $end = substr($body, $x, 5);
                    $x += 6;
                    $lenghType1 = strlen($OTType['type1']);
                    $lenghType2 = strlen($OTType['type2']);
                    if (substr($body, $x, $lenghType1) == $OTType['type1']) {
                        $type = $OTType['type1'];
                        $x += $lenghType1 + 1;
                    } else {
                        $type = $OTType['type2'];
                        $x += $lenghType2 + 1;
                    }
                    $reason = substr($body, $x);
                    break;
                    
                }
            }
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $date_now   = date_create();
            $id         = date_format($date_now, "YmdHis") + "";
            $dateType   = getDayType($date, $holidayApp['app'], $holidayApp['apiToken']);
            $date_now   = date_create($date);
            $date       = date_format($date_now, "Y-m-d");
            $lastdate   = date("Y-m-t", strtotime($date));
            $firstdate  = date("Y-m-01", strtotime($date));
            //==============KIEM TRA NGAY HOM DO CO DI LAM KHONG=======================
            $postFields = "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"query\":\"(chatworkid = \\\"" . $account . "\\\") and (date = \\\"" . $date . "\\\")\",\r\n    \"fields\":[\"starttime\",\"endtime\"]\r\n}";
            $token      = $timeSheetApp['apiToken'];
            $sheetData  = getRecord($postFields, $token);
            if (count($sheetData['records']) == 0) {
                $body = $notWorkToday;
                messageReply($body, $account, $roomReply, $message_id, $cwToken);
                exit();
            }
            $enddd;
            $scheduleData    = getScheduleTime($account, $staffApp);
            $scheduleEndTime = "";
            $otStart         = "";
            //==================KIEM TRA DIEU KIEN XIN OT=====================
            if (count($scheduleData) > 0) {
                $scheduleStartTime = $scheduleData[0]['starttime']['value'];
                $scheduleEndTime   = $scheduleData[0]['endtime']['value'];
                $enddd             = $scheduleData[0]['endtime']['value'];
                $scheduleEndTime   = str_replace(":", "", $scheduleEndTime);
                $otStart           = $start;
                $otStart           = str_replace(":", "", $otStart);
                if (intval($scheduleEndTime) > intval($otStart) && $dateType == "Normal") {
                    $context = stream_context_create($options);
                    $result  = file_get_contents($url, false, $context);
                    $body    = $errorSchedule;
                    $body    = str_replace("scheduleStart", $scheduleStartTime, $body);
                    $body    = str_replace("scheduleEnd", $enddd, $body);
                    $body    = str_replace("otStart", $start, $body);
                    messageReply($body, $account, $roomReply, $message_id, $cwToken);
                    exit();
                }
                if ($end <= $start) {
                    $body = $error001;
                    messageReply($body, $account, $roomReply, $message_id, $cwToken);
                    exit();
                }
            }
            //=================TAO RECORD OT=====================
            $postFields = "{\r\n    \"app\":" . $OTApp['app'] . ",\r\n    \"record\":{\r\n        \"idfromdate\":{\r\n            \"value\":\"" . $id . "\"\r\n        },\r\n        \"date\":{\r\n            \"value\":\"" . $date . "\"\r\n        },\r\n        \"reason\":{\r\n            \"value\":\"" . $reason . "\"\r\n        },\r\n        \"chatworkid\":{\r\n            \"value\":\"" . $account . "\"\r\n        },\r\n        \"start\":{\r\n            \"value\":\"" . $start . "\"\r\n        },\r\n        \"type\":{\r\n            \"value\":\"" . $type . "\"\r\n        },\r\n        \"end\":{\r\n            \"value\":\"" . $end . "\"\r\n        }\r\n    }\r\n}";
            $token      = $OTApp['apiToken'];
            $data       = postRecord($postFields, $token);
            $idcc       = $data['id'];
            //============TRA LOI NGUOI XIN OT============
            $body       = $otSuccess;
            $body       = str_replace("start", $start, $body);
            $body       = str_replace("end", $end, $body);
            $body       = str_replace("id", $id, $body);
            messageReply($body, $account, $roomReply, $message_id, $cwToken);
            //===============LAY RECORD OT TRONG THANG=======
            $date_now   = date_create($date);
            $date       = date_format($date_now, "Y-m-d");
            $lastdate   = date("Y-m-t", strtotime($date));
            $firstdate  = date("Y-m-01", strtotime($date));
            $postFields = "{\r\n    \"app\":" . $OTApp['app'] . ",\r\n    \"query\" : \"date>=\\\"" . $firstdate . "\\\" and chatworkid = \\\"" . $account . "\\\"and date<=\\\"" . $lastdate . "\\\" order by date asc \",\r\n    \"fields\": [\"date\", \"overtime\"]\r\n\r\n}";
            $token      = $OTApp['apiToken'];
            $data       = getRecord($postFields, $token);
            $listOT     = $data['records'];
            $totalOT    = 0;
            foreach ($listOT as $item) {
                $strOT = $item['overtime']['value'];
                $arrOT = explode(":", $strOT);
                $totalOT += $arrOT[0] + $arrOT[1] / 60;
            }
            //==============OT QUA SO GIO===========
            if ($totalOT > $otHour) {
                $body = $warningOTHour;
                $body = str_replace("hour", $otHour, $body);
                messageReply($body, $account, $roomReply, $message_id, $cwToken);
            }
            //=============THONG BAO CHO NGUOI DUYET=======
            messageTo($roomReply, $account, $adminCWId, $id, $OTApp['app'], $idcc, $cwToken);
            exit();
        }
        //==========================XIN NGHI=======================================
        if ($xinnghi_cm) {
            $date   = "";
            $type   = "";
            $reason = "";
            foreach ($leaveOff as $value) {
                if (strpos($body, $value) > 0) {
                    
                    $x    = strpos($body, $value) + strlen($value) + 1;
                    $date = substr($body, $x, 10);
                    $x += 11;
                    $lenghType1 = strlen($offType['type1']);
                    $lenghType2 = strlen($offType['type2']);
                    if (substr($body, $x, $lenghType1) == $offType['type1']) {
                        $type = $offType['type1'];
                        $x += $lenghType1 + 1;
                    } else {
                        $type = $offType['type2'];
                        $x += $lenghType2 + 1;
                    }
                    
                    $reason = substr($body, $x);
                    break;
                    
                }
            }
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $date_now  = date_create();
            $id        = date_format($date_now, "YmdHis") + "";
            $date_now  = date_create($date);
            $date      = date_format($date_now, "Y-m-d");
            $lastdate  = date("Y-12-31", strtotime($date));
            $firstdate = date("Y-01-01", strtotime($date));
            
            //============TAO RECORD=============
            $postFields = "{ \"app\": " . $leaveOffApp['app'] . ",\"record\":{\"chatworkid\": {\"value\": \"" . $account . "\"},\"idfromdate\":{\"value\":\"" . $id . "\"},\"date\":{\"value\":\"" . $date . "\"},\"type\":{\"value\":\"" . $type . "\"},\"reason\":{\"value\":\"" . $reason . "\"}\r\n}\r\n}";
            $token      = $leaveOffApp['apiToken'];
            $data       = postRecord($postFields, $token);
            $idcc       = $data['id'];
            //=============TRA LOI NGUOI XIN NGHI==========
            $body       = $leaveOffSuccess;
            $body       = str_replace("id", $id, $body);
            messageReply($body, $account, $roomReply, $message_id, $cwToken);
            //================THONG BAO CHO NGUOI DUYET====
            messageTo($roomReply, $account, $adminCWId, $id, $leaveOffApp['app'], $idcc, $cwToken);
            //==============LAY RECORD LEAVE OFF TRONG NAM=======
            $postFields = "{\r\n    \"app\":" . $leaveOffApp['app'] . ",\r\n    \"query\" : \"date>=\\\"" . $firstdate . "\\\" and chatworkid = \\\"" . $account . "\\\"and date<=\\\"" . $lastdate . "\\\" order by date asc \",\r\n    \"fields\": [\"date\"]\r\n\r\n}";
            $token      = $leaveOffApp['apiToken'];
            $data       = getRecord($postFields, $token);
            $totalOff   = count($data['records']);
            if ($totalOff > $offDay) {
                $body = $warningOffDay;
                $body = str_replace("day", $offDay, $body);
                messageReply($body, $account, $roomReply, $message_id, $cwToken);
            }
            exit();
        }
        //==========================DIEM DANH START=======================================
        if ($batdau_cm) {
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $date_now   = date_create();
            $date       = date_format($date_now, "Y-m-d");
            $time       = date_format($date_now, "H:i");
            //=======================KIEM TRA TON TAI RECORD=============================
            $postFields = "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"query\":\"(chatworkid = \\\"" . $account . "\\\") and (date = \\\"" . $date . "\\\")\",\r\n    \"fields\":[\"id\"]\r\n}";
            $token      = $timeSheetApp['apiToken'];
            $data       = getRecord($postFields, $token);
            $id         = $data['records'][0]['id']['value'];
            //============DA DIEM DANH TRUOC DO========
            if ($id != "") {
                $body = $alreadyAttendance;
                messageReply($body, $account, $roomReply, $message_id, $cwToken);
                exit();
            }
            $dateType   = getDayType($date, $holidayApp['app'], $holidayApp['apiToken']);
            //======================THEM RECORD==========================================
            //==================LAY THONG TIN HE SO LUONG=====================
            $postFields = "{\r\n    \"app\":" . $OTMasterApp['app'] . ",\r\n    \"query\": \"\$id!=\\\"\\\"\",\r\n    \"fields\": [\"type\", \"coefficient\"]\r\n}";
            $token      = $OTMasterApp['apiToken'];
            $data       = getRecord($postFields, $token);
            $tdata      = $data['records'];
            for ($i = 0; $i < count($tdata); $i++) {
                if ($tdata[$i]['type']['value'] == $dateType) {
                    $coefficient = $tdata[$i]['coefficient']['value'];
                }
            }
            //==========LAY THON TIN CO BAN CUA NHAN VIEN=======
            $postFields   = "{\r\n    \"app\":" . $staffApp['app'] . ",\r\n    \"query\":\"chatworkid=" . $account . "\",\r\n    \"fields\":[\"starttime\",\"endtime\",\"staffname\",\"department\"]\r\n}";
            $token        = $staffApp['apiToken'];
            $data         = getRecord($postFields, $token);
            $staffname    = $data['records'][0]['staffname']['value'];
            $starttime    = $data['records'][0]['starttime']['value'];
            $endtime      = $data['records'][0]['endtime']['value'];
            $department   = $data['records'][0]['department']['value'];
            $strStartTime = str_replace(":", "", $starttime);
            $strTime      = str_replace(":", "", $time);
            //================ THEM RECORD============
            $postFields   = "{\n\t\"app\":" . $timeSheetApp['app'] . ",\n\t\"record\":{\n\t\t\"chatworkid\":{\n\t\t\t\"value\":" . $account . "\n\t\t},\n\t\t\"staffname\":{\n\t\t\t\"value\":\"" . $staffname . "\"\n\t\t},\n\t\t\"coefficient\":{\n\t\t\t\"value\":\"" . $coefficient . "\"\n\t\t},\n\t\t\"date\":{\n\t\t\t\"value\":\"" . $date . "\"\n\t\t},\n\t\t\"starttime\":{\n\t\t\t\"value\":\"" . $time . "\"\n\t\t},\n\t\t\"department\":{\n\t\t\t\"value\":\"" . $department . "\"\n\t\t},\n\t\t\"sessionbegintime\":{\n\t\t\t\"value\":\"" . $starttime . "\"\n\t\t},\n\t\t\"sessionendtime\":{\n\t\t\t\"value\":\"" . $endtime . "\"\n\t\t}\n\t}\n}";
            $token        = $timeSheetApp['apiToken'];
            $data         = postRecord($postFields, $token);
            //==============TRA LOI NGUOI NHAN==========
            $body         = $attendanceSuccess;
            messageReply($body, $account, $roomReply, $message_id, $cwToken);
            //=========CANH BAO DI TRE==========
            if ($strTime > $strStartTime && $dateType == "Normal") {
                $body = $lateAttendanceWarning;
                messageReply($body, $account, $roomReply, $message_id, $cwToken);
                exit();
            }
            //===========NHAC NHO XIN OT NGAY CUOI TUAN========
            if ($dateType == "Weekend") {
                $body = $weekendRemind;
                messageReply($body, $account, $roomReply, $message_id, $cwToken);
                exit();
            }
            //===========NHAC NHO XIN OT NGAY LE========
            if ($dateType == "Holiday") {
                //============LAY THONG NGAY LE HIEN TAI===========
                $postFields = "{\r\n    \"app\":" . $holidayApp['app'] . ",\r\n    \"query\": \"date=\\\"" . $date . "\\\"\",\r\n    \"fields\": [\"$id\", \"date\", \"description\"]\r\n}";
                $token      = $holidayApp['apiToken'];
                $tt         = getRecord($postFields, $token);
                //==============TRA LOI NGUOI NHAN========
                $body       = $holidayRemind;
                $body       = str_replace("holiday", $tt['records'][0]['description']['value'], $body);
                messageReply($body, $account, $roomReply, $message_id, $cwToken);
                exit();
            }
            exit();
        }
        //==========================DIEM DANH KET THUC=======================================
        if ($ketthuc_cm) {
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $date_now   = date_create();
            $date       = date_format($date_now, "Y-m-d");
            $time       = date_format($date_now, "H:i");
            $dayOfWeek  = date_format($date_now, "N");
            $curl       = curl_init();
            //=============LAY RECORDS DIEM DANH CUA THANG====
            $lastdate   = date("Y-m-t", strtotime($date));
            $firstdate  = date("Y-m-01");
            //==============LAY THON TIN DIEM DANH NGAY HOM DO MA CHUA CO ENDTIME
            $postFields = "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"query\":\"(chatworkid = \\\"" . $account . "\\\") and (endtime=\\\"\\\") and (date = \\\"" . $date . "\\\")\",\r\n    \"fields\":[\"id\"]\r\n}";
            $token      = $timeSheetApp['apiToken'];
            $data       = getRecord($postFields, $token);
            $id         = $data['records'][0]['id']['value'];
            $dateType   = getDayType($date, $holidayApp['app'], $holidayApp['apiToken']);
            //==========NEU TON TAI, THEM THOI GIAN KET THUC VAO RECORD====
            if ($id != "") {
                $postFields = "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"id\":" . $id . ",\r\n    \"record\":{\r\n        \"endtime\":{\r\n            \"value\":\"" . $time . "\"\r\n        }\r\n    }\r\n}";
                $token      = $timeSheetApp['apiToken'];
                $data       = putRecord($postFields, $token);
                //===========CAM ON DA LAM VIEC NGAY HOM NAY
                $body       = $endWorking;
                messageReply($body, $account, $roomReply, $message_id, $cwToken);
                $scheduleData = getScheduleTime($account, $staffApp);
                $endtime      = $scheduleData[0]['endtime']['value'];
                $strEndTime   = str_replace(":", "", $endtime);
                $strTime      = str_replace(":", "", $time);
                //===========CANH BAO RA VE SOM==========
                if ($strTime < $strEndTime && $dateType == "Normal") {
                    $body = $endEarlyWarning;
                    messageReply($body, $account, $roomReply, $message_id, $cwToken);
                }
                //==============LAY RECORD LOGTIME THANG HIEN TAI=========
                $postFields = "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"query\" : \"date>=\\\"" . $firstdate . "\\\" and chatworkid = \\\"" . $account . "\\\"and date<=\\\"" . $lastdate . "\\\" order by date asc \",\r\n    \"fields\": [\"starttime\", \"endtime\", \"date\", \"overtime\", \"worktime\"]\r\n\r\n}";
                $token      = $timeSheetApp['apiToken'];
                $data       = getRecord($postFields, $token);
                $totalWork  = 0;
                $listRecord = $data['records'];
                foreach ($listRecord as $item) {
                    $strOT = $item['worktime']['value'];
                    $arrOT = explode(":", $strOT);
                    $totalWork += $arrOT[0] + $arrOT[1] / 60;
                }
                if ($totalWork > $workHour) {
                    $body = $warningWorkHour;
                    $body = str_replace("hour", $workHour, $body);
                    messageReply($body, $account, $roomReply, $message_id, $cwToken);
                }
                exit();
            }
            // ===========LAY THONG TIN DIEM DANH NGAY HOM NAY===
            $postFields = "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"query\":\"(chatworkid = \\\"" . $account . "\\\") and (date = \\\"" . $date . "\\\")\",\r\n    \"fields\":[\"id\"]\r\n}";
            $token      = $timeSheetApp['apiToken'];
            $data       = getRecord($postFields, $token);
            $id         = $data['records'][0]['id']['value'];
            //============NEU TON TAI============
            if ($id) {
                //=============UPDATE ENDTIME===========
                $postFields = "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"id\":" . $id . ",\r\n    \"record\":{\r\n        \"endtime\":{\r\n            \"value\":\"" . $time . "\"\r\n        }\r\n    }\r\n}";
                $token      = $timeSheetApp['apiToken'];
                $data       = putRecord($postFields, $token);
                //===========THONG BAO UPDATE=======
                $body       = $updateEndWorking;
                messageReply($body, $account, $roomReply, $message_id, $cwToken);
                $scheduleData = getScheduleTime($account, $staffApp);
                $endtime      = $scheduleData[0]['endtime']['value'];
                $strEndTime   = str_replace(":", "", $endtime);
                $strTime      = str_replace(":", "", $time);
                //=============CANH BAO VE SOM======
                if ($strTime < $strEndTime && $dateType == "Normal") {
                    $body = $endEarlyWarning;
                    messageReply($body, $account, $roomReply, $message_id, $cwToken);
                }
                //==============LAY RECORD LOGTIME THANG HIEN TAI=========
                $postFields = "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"query\" : \"date>=\\\"" . $firstdate . "\\\" and chatworkid = \\\"" . $account . "\\\"and date<=\\\"" . $lastdate . "\\\" order by date asc \",\r\n    \"fields\": [\"starttime\", \"endtime\", \"date\", \"overtime\", \"worktime\"]\r\n\r\n}";
                $token      = $timeSheetApp['apiToken'];
                $data       = getRecord($postFields, $token);
                $totalWork  = 0;
                $listRecord = $data['records'];
                foreach ($listRecord as $item) {
                    $strOT = $item['worktime']['value'];
                    $arrOT = explode(":", $strOT);
                    $totalWork += $arrOT[0] + $arrOT[1] / 60;
                }
                if ($totalWork > $workHour) {
                    $body = $warningWorkHour;
                    $body = str_replace("hour", $workHour, $body);
                    messageReply($body, $account, $roomReply, $message_id, $cwToken);
                }
                exit();
            } else {
                //========THONG BAO HOM NAY CHUA DIEM DANH
                $body = $notAttendanceToday;
                messageReply($body, $account, $roomReply, $message_id, $cwToken);
                exit();
            }
        }
        //==========================HUONG DAN=======================================
        if ($huongdan_cm) {
            $url     = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
            $data    = array(
                'body' => '[To:' . $account . ']
勤怠管理システムの使い方についてご説明いたします。
対応コマンドは以下の通りです。:)
[info][title]コマンド情報[/title][info]
1.出勤した場合(CheckIn)➝In/出勤/上班/ :) のいずれか
2.退勤した場合(CheckOut)➝Out/退勤/下班/ (handshake) のいずれか
3.休暇を取りたい場合(Leave application)➝ Leave/休暇 yyyy-MM-dd 分類（Type)　理由(Reason)
  ***** 分類（Type): 1- 有休(Annual leave)　 2- 振替休(Compensatory leave)  ***** 
4.残業を取りたい場合(OT application)➝OT/残業 yyyy-MM-dd HH:mm~HH:mm 分類（Type)　理由
  ***** 分類（Type): 1- 支払(Payment)　 2- 振替休(Compensatory leave)  ***** 
5.今月タイムシート参照(Timesheet)➝ TS/タイムシート
6.ヘルプ表示(Help)→そのた(Others)
[/info]
■以下アプリ版のみ
位置情報を送信すると以下の動作をおこないます。
１回目は出勤
２回目は退勤
■使用例
[info] [To:5084344]ChatBot
出勤しました。
[/info]
※かならずBotに「To」をつけるようにして下さい。

[hr]
■モバイルから位置情報を送信して出退勤する場合
[info]１０４台番台北市中山○南京東路二段１２３○－１２５○
http://maps.google.com/maps?q=25.052044,121.534186
[/info]
※位置情報を送信する場合は反映までに最大５分程度要します。
（出勤時間・退勤時間に影響はありませんのでご安心ください。）[/info]
'
            );
            $options = array(
                'http' => array(
                    'header' => "Content-type: application/x-www-form-urlencoded\r\nX-ChatWorkToken:" . $cwToken . "\r\n",
                    'method' => 'POST',
                    'content' => http_build_query($data)
                )
            );
            $context = stream_context_create($options);
            $result  = file_get_contents($url, false, $context);
        }
    }
    //===============LAY THONG TIN LOGTIME=========
    if ($logtime_cm) {
        date_default_timezone_set("Asia/Ho_Chi_Minh");
        $date_now      = date_create();
        $date          = date_format($date_now, "Y-m-d");
        $lastdate      = date("Y-m-t", strtotime($date));
        $firstdate     = date("Y-m-01");
        //==============LAY RECORD LOGTIME THANG HIEN TAI=========
        $postFields    = "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"query\" : \"date>=\\\"" . $firstdate . "\\\" and chatworkid = \\\"" . $account . "\\\"and date<=\\\"" . $lastdate . "\\\" order by date asc \",\r\n    \"fields\": [\"starttime\", \"endtime\", \"date\", \"overtime\", \"worktime\"]\r\n\r\n}";
        $token         = $timeSheetApp['apiToken'];
        $data          = getRecord($postFields, $token);
        $listRecord    = $data['records'];
        $strLogtime    = "";
        $totalWorkTime = 0.0;
        $totalOverTime = 0.0;
        //=======NEU CO RECORD==========
        if (count($listRecord) > 0) {
            for ($i = 0; $i < count($listRecord); $i++) {
                $strOverTime   = $listRecord[$i]['overtime']['value'] ? $listRecord[$i]['overtime']['value'] : "-";
                $strLogtime    = $strLogtime . $listRecord[$i]['date']['value'] . ": " . $listRecord[$i]['starttime']['value'] . "-" . $listRecord[$i]['endtime']['value'] . ", 作業時間: " . $listRecord[$i]['worktime']['value'] . ", 残業時間: " . $strOverTime . "
";
                $strWorkTime   = $listRecord[$i]['worktime']['value'];
                $arrWorkTime   = explode(":", $strWorkTime);
                $totalWorkTime = $totalWorkTime + (float) $arrWorkTime[0] + ((float) $arrWorkTime[1]) / 60;
                $strOverTime   = $listRecord[$i]['overtime']['value'];
                $arrOverTime   = explode(":", $strOverTime);
                $totalOverTime = $totalOverTime + (float) $arrOverTime[0] + ((float) $arrOverTime[1]) / 60;
            }
            $url     = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
            $data    = array(
                'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
あなたの作業時間です。

' . $strLogtime . '
作業時間合計： ' . $totalWorkTime . 'h, 残業時間合計: ' . $totalOverTime . 'h'
            );
            $options = array(
                'http' => array(
                    'header' => "Content-type: application/x-www-form-urlencoded\r\nX-ChatWorkToken:" . $cwToken . "\r\n",
                    'method' => 'POST',
                    'content' => http_build_query($data)
                )
            );
            $context = stream_context_create($options);
            $result  = file_get_contents($url, false, $context);
        } else {
            //========== KHONG CO RECORD=============
            $url     = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
            $data    = array(
                'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
今月の作業時間を記録しませんでした。'
            );
            $options = array(
                'http' => array(
                    'header' => "Content-type: application/x-www-form-urlencoded\r\nX-ChatWorkToken:" . $cwToken . "\r\n",
                    'method' => 'POST',
                    'content' => http_build_query($data)
                )
            );
            $context = stream_context_create($options);
            $result  = file_get_contents($url, false, $context);
        }
    }
}
//===============LAY THONG TIN THOI GIAN LAM VIEC CUA NHAN VIEN======
function getScheduleTime($chatworkid, $staffApp)
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://kintoneivsdemo.cybozu.com/k/v1/records.json",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,  
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_POSTFIELDS => "{\r\n    \"app\":" . $staffApp['app'] . ",\r\n    \"query\":\"chatworkid = \\\"" . $chatworkid . "\\\"\",\r\n    \"fields\":[\"starttime\",\"endtime\"]\r\n}",
        CURLOPT_HTTPHEADER => array(
            "X-Cybozu-API-Token: " . $staffApp['apiToken'],
            "Content-Type: application/json",
            "Cookie: __ctc=Z08OKV8heJmYazESA/8lAg==; JSESSIONID=BQzz3u5eivhHlwSmpB6JeUAkEersLrwNIuonkBBHN1COh09XZyTfeZLaA7GcCtFg"
        )
    ));
    $response = curl_exec($curl);
    curl_close($curl);
    $data = json_decode($response, TRUE);
    return $data['records'];
}
//=========== LOAI NGAY==========
function getDayType($date, $app, $token)
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://kintoneivsdemo.cybozu.com/k/v1/records.json",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_POSTFIELDS => "{\r\n    \"app\":" . $app . ",\r\n    \"query\": \"date=\\\"" . $date . "\\\"\",\r\n    \"fields\": [\"$id\", \"date\", \"description\"]\r\n}",
        CURLOPT_HTTPHEADER => array(
            "X-Cybozu-API-Token: " . $token,
            "Content-type: application/json",
            "Cookie: __ctc=Z08OKV8ICaFkKd6eBB/jAg==; JSESSIONID=xTxB7OTJrHxMPEWBCVKQd1fN2fuYig14i5uVJur9nRqfH447YG8Hr4O7bzEQeVWp"
        )
    ));
    $response  = curl_exec($curl);
    $dayofweek = date_format($date, "N");
    curl_close($curl);
    $data = json_decode($response, TRUE);
    if (count($data['records']) > 0) {
        return "Holiday";
    } elseif ($dayofweek == "6" || $dayofweek == "7") {
        return "Weekend";
    } else
        return "Normal";
}
function messageReply($body, $account, $roomReply, $message_id, $cwToken)
{
    $url     = 'https://api.chatwork.com/v2/rooms/' . $roomReply . '/messages';
    $data    = array(
        'body' => '[rp aid=' . $account . ' to=' . $roomReply . '-' . $message_id . ']' . $body
    );
    $options = array(
        'http' => array(
            'header' => "Content-type: application/x-www-form-urlencoded\r\nX-ChatWorkToken:" . $cwToken . "\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        )
    );
    $context = stream_context_create($options);
    $result  = file_get_contents($url, false, $context);
}
function messageTo($roomReply, $account, $adminCWId, $id, $app, $idRecord, $cwToken)
{
    $url     = 'https://api.chatwork.com/v2/rooms/' . $roomReply . '/messages';
    $data    = array(
        'body' => '[To:' . $adminCWId . ']
[piconname:' . $account . '] の「' . $id . '」休暇申請を作成してお願いします。
https://kintoneivsdemo.cybozu.com/k/' . $app . '/show#record=' . $idRecord
    );
    $options = array(
        'http' => array(
            'header' => "Content-type: application/x-www-form-urlencoded\r\nX-ChatWorkToken:" . $cwToken . "\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        )
    );
    $context = stream_context_create($options);
    $result  = file_get_contents($url, false, $context);
}
function getRecord($postFields, $token)
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://kintoneivsdemo.cybozu.com/k/v1/records.json",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_POSTFIELDS => $postFields,
        CURLOPT_HTTPHEADER => array(
            "X-Cybozu-API-Token:" . $token,
            "Content-Type: application/json"
        )
    ));
    $response = curl_exec($curl);
    curl_close($curl);
    $data = json_decode($response, TRUE);
    return $data;
}
function postRecord($postFields, $token)
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://kintoneivsdemo.cybozu.com/k/v1/record.json",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => $postFields,
        CURLOPT_HTTPHEADER => array(
            "X-Cybozu-API-Token: " . $token,
            "Content-Type: application/json"
        )
    ));
    $response = curl_exec($curl);
    curl_close($curl);
    $data = json_decode($response, TRUE);
    return $data;
}
function putRecord($postFields, $token)
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://kintoneivsdemo.cybozu.com/k/v1/record.json",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "PUT",
        CURLOPT_POSTFIELDS => $postFields,
        CURLOPT_HTTPHEADER => array(
            "X-Cybozu-API-Token: " . $token,
            "Content-Type: application/json"
        )
    ));
    $response = curl_exec($curl);
    curl_close($curl);
    $data = json_decode($response, TRUE);
    return $data;
}
?>