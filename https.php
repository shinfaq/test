<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get data from api
    $inputJSON  = file_get_contents('php://input');
    $input      = json_decode($inputJSON, TRUE); //convert JSON into array
    $body       = $input['webhook_event']['body'];
    $room       = $input['webhook_event']['room_id'];
    $account    = $input['webhook_event']['from_account_id'];
    $to         = $input['webhook_event']['to_account_id'];
    $message_id = $input['webhook_event']['message_id'];
    
    //==========================CONFIG=======================================
    
    //===========================test======================================
    $start        = array(
        ":)",
        "上班",
        "出勤"
    );
    $end          = array(
        "(handshake)",
        "下班",
        "退勤"
    );
    $logtime      = "logtime";
    $leaveOff     = "[休暇]";
    $tutorial     = "(lightbulb)";
    $ot           = "[OT]";
    $cwToken      = "98b4cb2714f0ded7c49363fb9f72c313";
    $roomReply    = $room ;
    $staffApp     = array(
        "app" => "5017",
        "apiToken" => "gEfz7JEmgcYxcG4osF9R2KTdeFGw7R1NnDO8MalI"
    );
    $OTApp        = array(
        "app" => "5022",
        "apiToken" => "WOhDc0p7OiYsRDG0lz33BrDpCEBK31toTI760LDe"
    );
    $leaveOffApp  = array(
        "app" => "5016",
        "apiToken" => "2SmQXGcCwE3GWGFSl1lfyPCCZlf2LCASDrC3v0Qe"
    );
    $timeSheetApp = array(
        "app" => "5015",
        "apiToken" => "33bSe8mcrbRL6nwgIQR5OOcI2JTR5qHMARnIi6qW"
    );
    // =====================================CHECK COMMAND======================================
    $commandOK    = false;
    $xinnghi_cm   = false;
    $batdau_cm    = false;
    $ketthuc_cm   = false;
    $huongdan_cm  = false;
    $overtime_cm  = false;
    $logtime_cm   = false;
    if (strpos($body, $leaveOff) > -1) {
        $commandOK  = true;
        $xinnghi_cm = true;
        
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
    if (strpos($body, $ot) > -1) {
        $commandOK   = true;
        $overtime_cm = true;
    }
    if (strpos($body, $logtime) > -1) {
        $commandOK  = true;
        $logtime_cm = true;
    }
    if ($commandOK) {
        //==========================KIEM TRA USER TON TAI=======================================
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
            CURLOPT_POSTFIELDS => "{\r\n    \"app\":" . $staffApp['app'] . ",\r\n    \"query\":\"chatworkid = \\\"" . $account . "\\\"\",\r\n    \"fields\":[\"$id\"]\r\n}",
            CURLOPT_HTTPHEADER => array(
                "X-Cybozu-API-Token: " . $staffApp['apiToken'] . "",
                "Content-Type: application/json",
                "Cookie: __ctc=Z08OKV8heJmYazESA/8lAg==; JSESSIONID=KBzFFpXQdBEuwDOishoFTPiYTHmnI4RRCHXOJejJBqk75WhxX48Jvw1NcmqhPOWG"
            )
        ));
        
        $response = curl_exec($curl);
        
        curl_close($curl);
        echo $response;
        
        $res = json_decode($response, true);
        
        if (count($res['records']) == 0) {
            $url     = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
            $data    = array(
                'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
このチャットワークアカウントはまだKintoneに連携されていません。
最初にKintoneアカウントを作成または設定してください。
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
            exit();
            
        }
        //==========================XIN OVERTIME=======================================
        if ($overtime_cm) {
            $x      = strpos($body, $ot);
            $date   = substr($body, $x + 5, 10);
            $start  = substr($body, $x + 16, 5);
            $end    = substr($body, $x + 22, 5);
            $reason = substr($body, $x + 28);
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $date_now  = date_create();
            $id        = date_format($date_now, "YmdHis") + "";
            $dateType  = getDayType($date);
            //==============KIEM TRA NGAY HOM DO CO DI LAM KHONG=======================
            $sheetData = getTimeSheet($account, $date, $timeSheetApp);
            if (count($sheetData) == 0) {
                $url     = 'https://api.chatwork.com/v2/rooms/' . $roomReply . '/messages';
                $data    = array(
                    'body' => '[rp aid=' . $account . ' to=' . $roomReply . '-' . $message_id . ']
まず出勤してください。'
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
                
                $otStart = $start;
                $otStart = str_replace(":", "", $otStart);
                
                if (intval($scheduleEndTime) > intval($otStart) && $dateType == "Normal") {
                    
                    $url     = 'https://api.chatwork.com/v2/rooms/' . $roomReply . '/messages';
                    $data    = array(
                        'body' => '[rp aid=' . $account . ' to=' . $roomReply . '-' . $message_id . ']
勤務時間が' . $scheduleStartTime . '～' . $enddd . 'であるため、' . $start . 'からの残業時間が登録できません。'
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
                    
                    
                    exit();
                }
                
            }
            //=================TAO RECORD OT=====================
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
                CURLOPT_POSTFIELDS => "{\r\n    \"app\":" . $OTApp['app'] . ",\r\n    \"record\":{\r\n        \"idfromdate\":{\r\n            \"value\":\"" . $id . "\"\r\n        },\r\n        \"date\":{\r\n            \"value\":\"" . $date . "\"\r\n        },\r\n        \"reason\":{\r\n            \"value\":\"" . $reason . "\"\r\n        },\r\n        \"chatworkid\":{\r\n            \"value\":\"" . $account . "\"\r\n        },\r\n        \"start\":{\r\n            \"value\":\"" . $start . "\"\r\n        },\r\n        \"end\":{\r\n            \"value\":\"" . $end . "\"\r\n        }\r\n    }\r\n}",
                CURLOPT_HTTPHEADER => array(
                    "X-Cybozu-API-Token: " . $OTApp['apiToken'] . "",
                    "Content-Type: application/json",
                    "Cookie: __ctc=Z08OKV8heJmYazESA/8lAg==; JSESSIONID=gRyjwE6nYdeVaCzka2IozO12o5glrL1U3cJMA4ol9bTVheVFprA478Yoa3t8I1W5"
                )
            ));
            
            $response = curl_exec($curl);
            
            curl_close($curl);
            echo $response;
            $data    = json_decode($response, TRUE);
            $idcc    = $data['id'];
            //============TRA LOI NGUOI XIN OT============
            $url     = 'https://api.chatwork.com/v2/rooms/' . $roomReply . '/messages';
            $data    = array(
                'body' => '[rp aid=' . $account . ' to=' . $roomReply . '-' . $message_id . ']' . ' ' . $start . '-' . $end . ' の残業時間が登録しました。
承認されるまでお待ちください。申し込み番号 = 「' . $id . '」'
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
            //=============THONG BAO CHO NGUOI DUYET=======
            $url     = 'https://api.chatwork.com/v2/rooms/' . $roomReply . '/messages';
            $data    = array(
                'body' => '[To:461435]
[piconname:' . $account . '] の「' . $id . '」のOT申請をご承認してください。
https://kintoneivsdemo.cybozu.com/k/' . $OTApp['app'] . '/show#record=' . $idcc
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
        //==========================XIN NGHI=======================================
        if ($xinnghi_cm) {
            
            $x      = strpos($body, $leaveOff);
            $date   = substr($body, $x + 9, 10);
            $reason = substr($body, $x + 19);
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $date_now = date_create();
            $id       = date_format($date_now, "YmdHis") + "";
            
            
            
            
            //============TAO RECORD=============
            $curl = curl_init();
            
            // insert new record
            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://kintoneivsdemo.cybozu.com/k/v1/record.json",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => "{ \"app\": " . $leaveOffApp['app'] . ",\"record\":{\"chatworkid\": {\"value\": \"" . $account . "\"},\"idfromdate\":{\"value\":\"" . $id . "\"},\"date\":{\"value\":\"" . $date . "\"},\"reason\":{\"value\":\"" . $reason . "\"}\r\n}\r\n}",
                CURLOPT_HTTPHEADER => array(
                    "X-Cybozu-API-Token: " . $leaveOffApp['apiToken'] . "",
                    "Content-Type: application/json",
                    "Cookie: __ctc=Z08OKV8ICaFkKd6eBB/jAg==; JSESSIONID=XZosRE8amy5b7zKVZjUaFap4JiAGApiEeTFnHxcQASFLerQnjgQ4x94wZE1Q7327"
                )
            ));
            $response = curl_exec($curl);
            curl_close($curl);
            $data = json_decode($response, TRUE);
            $idcc = $data['id'];
            
            //=============TRA LOI NGUOI XIN NGHI==========
            $url     = 'https://api.chatwork.com/v2/rooms/' . $roomReply . '/messages';
            $data    = array(
                'body' => '[rp aid=' . $account . ' to=' . $roomReply . '-' . $message_id . ']
休暇届の申請が受理されました。
承認までしばらくお待ちくださいませ。申し込み番号 = 「' . $id . '」'
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
            //================THONG BAO CHO NGUOI DUYET====
            $url     = 'https://api.chatwork.com/v2/rooms/' . $roomReply . '/messages';
            $data    = array(
                'body' => '[To:461435]
[piconname:' . $account . '] の「' . $id . '」休暇申請を作成してお願いします。
https://kintoneivsdemo.cybozu.com/k/' . $leaveOffApp['app'] . '/show#record=' . $idcc
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
        
        //==========================DIEM DANH START=======================================
        if ($batdau_cm) {
            
            
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $date_now = date_create();
            $date     = date_format($date_now, "Y-m-d");
            $time     = date_format($date_now, "H:i");
            
            //=======================KIEM TRA TON TAI RECORD=============================
            
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
                CURLOPT_POSTFIELDS => "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"query\":\"(chatworkid = \\\"" . $account . "\\\") and (endtime=\\\"\\\") and (date = \\\"" . $date . "\\\")\",\r\n    \"fields\":[\"id\"]\r\n}",
                CURLOPT_HTTPHEADER => array(
                    "X-Cybozu-API-Token: " . $timeSheetApp['apiToken'] . "",
                    "Content-Type: application/json",
                    "Cookie: __ctc=Z08OKV8fkr5SRURIA/s1Ag==; JSESSIONID=Kbgu7RqnqCgBvSYLftcJzb1MeqflXaiMvNpnSy26aZOVGVFTL0bajl8ZqcxMG5FO"
                )
            ));
            
            $response = curl_exec($curl);
            
            curl_close($curl);
            echo $response;
            $data = json_decode($response, TRUE);
            $id   = $data['records'][0]['id']['value'];
            
            //============DA DIEM DANH TRUOC DO========
            if ($id != "") {
                
                $url     = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
                $data    = array(
                    'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
すでにチェックインしました。'
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
                exit();
            }
            //======================THEM RECORD==========================================
            
            
            
            $dateType = getDayType($date);
            //==================LAY THONG TIN HE SO LUONG=====================
            $curl     = curl_init();
            
            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://kintoneivsdemo.cybozu.com/k/v1/records.json",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_POSTFIELDS => "{\r\n    \"app\":5074,\r\n    \"query\": \"\$id!=\\\"\\\"\",\r\n    \"fields\": [\"type\", \"coefficient\"]\r\n}",
                CURLOPT_HTTPHEADER => array(
                    "X-Cybozu-API-Token: uwmjMbzCoD7PaUeGsQ53EDyZvRaAN3gifje1YvUZ",
                    "Content-type: application/json",
                    "Cookie: __ctc=Z08OKV8ICaFkKd6eBB/jAg==; JSESSIONID=xTxB7OTJrHxMPEWBCVKQd1fN2fuYig14i5uVJur9nRqfH447YG8Hr4O7bzEQeVWp"
                )
            ));
            
            $response = curl_exec($curl);
            
            curl_close($curl);
            echo $response;
            $testdata = json_decode($response, TRUE);
            $tdata    = $testdata['records'];
            
            for ($i = 0; $i < count($tdata); $i++) {
                if ($tdata[$i]['type']['value'] == $dateType) {
                    $coefficient = $tdata[$i]['coefficient']['value'];
                }
            }
            $curl = curl_init();
            //==========LAY THON TIN CO BAN CUA NHAN VIEN=======
            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://kintoneivsdemo.cybozu.com/k/v1/records.json",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_POSTFIELDS => "{\r\n    \"app\":" . $staffApp['app'] . ",\r\n    \"query\":\"chatworkid=" . $account . "\",\r\n    \"fields\":[\"starttime\",\"endtime\",\"staffname\",\"department\"]\r\n}",
                CURLOPT_HTTPHEADER => array(
                    "X-Cybozu-API-Token: " . $staffApp['apiToken'] . "",
                    "Content-Type: application/json",
                    "Cookie: __ctc=Z08OKV8ICaFkKd6eBB/jAg==; JSESSIONID=tZD69BOecwGyMAwC7kePSCN9izALZryJWhDGLKjmg8Q12B90OttsYVo5J6GIEeNt"
                )
            ));
            
            $response = curl_exec($curl);
            
            curl_close($curl);
            echo $response;
            $data         = json_decode($response, TRUE);
            $staffname    = $data['records'][0]['staffname']['value'];
            $starttime    = $data['records'][0]['starttime']['value'];
            $endtime      = $data['records'][0]['endtime']['value'];
            $department   = $data['records'][0]['department']['value'];
            $strStartTime = str_replace(":", "", $starttime);
            $strTime      = str_replace(":", "", $time);
            
            //================ THEM RECORD============
            $curl = curl_init();
            
            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://kintoneivsdemo.cybozu.com/k/v1/record.json",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => "{\n\t\"app\":" . $timeSheetApp['app'] . ",\n\t\"record\":{\n\t\t\"chatworkid\":{\n\t\t\t\"value\":" . $account . "\n\t\t},\n\t\t\"staffname\":{\n\t\t\t\"value\":\"" . $staffname . "\"\n\t\t},\n\t\t\"coefficient\":{\n\t\t\t\"value\":\"" . $coefficient . "\"\n\t\t},\n\t\t\"date\":{\n\t\t\t\"value\":\"" . $date . "\"\n\t\t},\n\t\t\"starttime\":{\n\t\t\t\"value\":\"" . $time . "\"\n\t\t},\n\t\t\"department\":{\n\t\t\t\"value\":\"" . $department . "\"\n\t\t},\n\t\t\"sessionbegintime\":{\n\t\t\t\"value\":\"" . $starttime . "\"\n\t\t},\n\t\t\"sessionendtime\":{\n\t\t\t\"value\":\"" . $endtime . "\"\n\t\t}\n\t}\n}",
                CURLOPT_HTTPHEADER => array(
                    "cache-control: no-cache",
                    "content-type: application/json",
                    "x-cybozu-api-token: " . $timeSheetApp['apiToken'] . ""
                )
            ));
            
            $response = curl_exec($curl);
            $err      = curl_error($curl);
            
            curl_close($curl);
            echo $response;
            
            
            
            
            
            // $mysqli    = new mysqli("localhost", "id14361225_phap", "Chichchich1.", "id14361225_chatwork_db");
            
            // // Check connection 
            // if ($mysqli->connect_errno) {
            //     echo "Failed to connect to MySQL: " . $mysqli->connect_error;
            //     exit();
            // }
            // $result    = $mysqli->query("INSERT INTO `inbox`(`body`, `room`, `account`,`begin`,`end`,`datatest`)".
            // " VALUES ('" . $body . "','" . $room . "','" . $account . "','" . $time . "','" . $endtime . "','".$staffname."')");
            
            
            
            
            //==============TRA LOI NGUOI NHAN==========
            
            $url     = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
            $data    = array(
                'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
おつかれさまです。良い一日を。'
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
            //=========CANH BAO DI TRE==========
            if ($strTime > $strStartTime && $dateType == "Normal") {
                
                $url     = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
                $data    = array(
                    'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
今日あなたは遅刻しました。'
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
                exit();
            }
            //===========NHAC NHO XIN OT NGAY CUOI TUAN========
            if ($dateType == "Weekend") {
                
                $url     = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
                $data    = array(
                    'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
今日は週末です。残業申請を行ってください。
残業申請を行わない場合、平日と見なします。'
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
                exit();
            }
            //===========NHAC NHO XIN OT NGAY LE========
            if ($dateType == "Holiday") {
                //============LAY THONG NGAY LE HIEN TAI===========
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
                    CURLOPT_POSTFIELDS => "{\r\n    \"app\":5073,\r\n    \"query\": \"date=\\\"" . $date . "\\\"\",\r\n    \"fields\": [\"$id\", \"date\", \"description\"]\r\n}",
                    CURLOPT_HTTPHEADER => array(
                        "X-Cybozu-API-Token: ASTEsXZxxZAaIAefs2FJvznQNvtnTgRcw9pgvOR4",
                        "Content-type: application/json",
                        "Cookie: __ctc=Z08OKV8ICaFkKd6eBB/jAg==; JSESSIONID=xTxB7OTJrHxMPEWBCVKQd1fN2fuYig14i5uVJur9nRqfH447YG8Hr4O7bzEQeVWp"
                    )
                ));
                
                $response = curl_exec($curl);
                curl_close($curl);
                $tt      = json_decode($response, TRUE);
                //==============TRA LOI NGUOI NHAN========
                $url     = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
                $data    = array(
                    'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
今日は ' . $tt['records'][0]['description']['value'] . ' です。残業申請を行ってください。
残業申請を行わない場合、平日と見なします。'
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
        
        
        
        //==========================DIEM DANH KET THUC=======================================
        if ($ketthuc_cm) {
            
            
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $date_now  = date_create();
            $date      = date_format($date_now, "Y-m-d");
            $time      = date_format($date_now, "H:i");
            $dayOfWeek = date_format($date_now, "N");
            $curl      = curl_init();
            //==============LAY THON TIN DIEM DANH NGAY HOM DO MA CHUA CO ENDTIME
            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://kintoneivsdemo.cybozu.com/k/v1/records.json",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_POSTFIELDS => "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"query\":\"(chatworkid = \\\"" . $account . "\\\") and (endtime=\\\"\\\") and (date = \\\"" . $date . "\\\")\",\r\n    \"fields\":[\"id\"]\r\n}",
                CURLOPT_HTTPHEADER => array(
                    "X-Cybozu-API-Token: " . $timeSheetApp['apiToken'] . "",
                    "Content-Type: application/json",
                    "Cookie: __ctc=Z08OKV8fkr5SRURIA/s1Ag==; JSESSIONID=Kbgu7RqnqCgBvSYLftcJzb1MeqflXaiMvNpnSy26aZOVGVFTL0bajl8ZqcxMG5FO"
                )
            ));
            
            $response = curl_exec($curl);
            
            curl_close($curl);
            echo $response;
            $data = json_decode($response, TRUE);
            $id   = $data['records'][0]['id']['value'];
            
            $dateType = getDayType($date);
            
            //==========NEU TON TAI 
            if ($id != "") {
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
                    CURLOPT_POSTFIELDS => "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"id\":" . $id . ",\r\n    \"record\":{\r\n        \"endtime\":{\r\n            \"value\":\"" . $time . "\"\r\n        }\r\n    }\r\n}",
                    CURLOPT_HTTPHEADER => array(
                        "X-Cybozu-API-Token: " . $timeSheetApp['apiToken'] . "",
                        "Content-Type: application/json",
                        "Cookie: __ctc=Z08OKV8fkr5SRURIA/s1Ag==; JSESSIONID=Kbgu7RqnqCgBvSYLftcJzb1MeqflXaiMvNpnSy26aZOVGVFTL0bajl8ZqcxMG5FO"
                    )
                ));
                
                $response = curl_exec($curl);
                
                curl_close($curl);
                echo $response;
                
                
                $url          = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
                $data         = array(
                    'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
今日も一日お疲れ様でした！'
                );
                $options      = array(
                    'http' => array(
                        'header' => "Content-type: application/x-www-form-urlencoded\r\nX-ChatWorkToken:" . $cwToken . "\r\n",
                        'method' => 'POST',
                        'content' => http_build_query($data)
                    )
                );
                $context      = stream_context_create($options);
                $result       = file_get_contents($url, false, $context);
                $scheduleData = getScheduleTime($account, $staffApp);
                $endtime      = $scheduleData[0]['endtime']['value'];
                $strEndTime   = str_replace(":", "", $endtime);
                $strTime      = str_replace(":", "", $time);
                if ($strTime < $strEndTime && $dateType == "Normal") {
                    $url     = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
                    $data    = array(
                        'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
今日あなたは早退しました。'
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
                exit();
            }
            // ===========LAY THONG TIN DIEM DANH NGAY HOM NAY===
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
                CURLOPT_POSTFIELDS => "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"query\":\"(chatworkid = \\\"" . $account . "\\\") and (date = \\\"" . $date . "\\\")\",\r\n    \"fields\":[\"id\"]\r\n}",
                CURLOPT_HTTPHEADER => array(
                    "X-Cybozu-API-Token: " . $timeSheetApp['apiToken'] . "",
                    "Content-Type: application/json",
                    "Cookie: __ctc=Z08OKV8fkr5SRURIA/s1Ag==; JSESSIONID=Kbgu7RqnqCgBvSYLftcJzb1MeqflXaiMvNpnSy26aZOVGVFTL0bajl8ZqcxMG5FO"
                )
            ));
            
            $response = curl_exec($curl);
            
            curl_close($curl);
            echo $response;
            $data = json_decode($response, TRUE);
            $id   = $data['records'][0]['id']['value'];
            //============NEU TON TAI============
            if ($id) {
                //=============UPDATE ENDTIME===========
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
                    CURLOPT_POSTFIELDS => "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"id\":" . $id . ",\r\n    \"record\":{\r\n        \"endtime\":{\r\n            \"value\":\"" . $time . "\"\r\n        }\r\n    }\r\n}",
                    CURLOPT_HTTPHEADER => array(
                        "X-Cybozu-API-Token: " . $timeSheetApp['apiToken'] . "",
                        "Content-Type: application/json",
                        "Cookie: __ctc=Z08OKV8fkr5SRURIA/s1Ag==; JSESSIONID=Kbgu7RqnqCgBvSYLftcJzb1MeqflXaiMvNpnSy26aZOVGVFTL0bajl8ZqcxMG5FO"
                    )
                ));
                
                $response = curl_exec($curl);
                
                curl_close($curl);
                echo $response;
                
                //===========THONG BAO UPDATE=======
                $url          = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
                $data         = array(
                    'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
退勤時間を更新しました！'
                );
                $options      = array(
                    'http' => array(
                        'header' => "Content-type: application/x-www-form-urlencoded\r\nX-ChatWorkToken:" . $cwToken . "\r\n",
                        'method' => 'POST',
                        'content' => http_build_query($data)
                    )
                );
                $context      = stream_context_create($options);
                $result       = file_get_contents($url, false, $context);
                $scheduleData = getScheduleTime($account, $staffApp);
                $endtime      = $scheduleData[0]['endtime']['value'];
                $strEndTime   = str_replace(":", "", $endtime);
                $strTime      = str_replace(":", "", $time);
                //=============CANH BAO VE SOM======
                if ($strTime < $strEndTime && $dateType == "Normal") {
                    $url     = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
                    $data    = array(
                        'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
今日あなたは早退しました。'
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
            } else {
                //========THONG BAO HOM NAY CHUA DIEM DANH
                $url     = 'https://api.chatwork.com/v2/rooms/' . $room . '/messages';
                $data    = array(
                    'body' => '[rp aid=' . $account . ' to=' . $room . '-' . $message_id . ']
今日は出席していません。'
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
[info][title]コマンド情報[/title][info]出勤した場合➝出勤/上班/ :) のいずれか
退勤した場合➝退勤/下班/ (handshake) のいずれか
休暇を取りたい場合➝[休暇] yyyy-MM-dd 理由
残業を取りたい場合➝[OT] yyyy-MM-dd HH:mm~HH:mm 理由
今月のログ時刻を見たいの場合➝ logtime
そのた→ヘルプ表示
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
        $date_now  = date_create();
        $date      = date_format($date_now, "Y-m-d");
        $lastdate  = date("Y-m-t", strtotime($date));
        $firstdate = date("Y-m-01");
        
        //==============LAY RECORD LOGTIME THANG HIEN TAI=========
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
            CURLOPT_POSTFIELDS => "{\r\n    \"app\":5015,\r\n    \"query\" : \"date>=\\\"" . $firstdate . "\\\" and chatworkid = \\\"" . $account . "\\\"and date<=\\\"" . $lastdate . "\\\" order by date asc \",\r\n    \"fields\": [\"starttime\", \"endtime\", \"date\", \"overtime\", \"worktime\"]\r\n\r\n}",
            CURLOPT_HTTPHEADER => array(
                "X-Cybozu-API-Token: 33bSe8mcrbRL6nwgIQR5OOcI2JTR5qHMARnIi6qW",
                "Content-type: application/json",
                "Cookie: __ctc=Z08OKV8ICaFkKd6eBB/jAg==; JSESSIONID=tlfMSrOIzyPe0uUud2xsNrSiqDbaqslyx7ZkA07RuDZAUMQsGEKooEcyOQf4DXWh"
            )
        ));
        
        $response = curl_exec($curl);
        
        curl_close($curl);
        echo $response;
        $data          = json_decode($response, TRUE);
        $listRecord    = $data['records'];
        $strLogtime    = "";
        $totalWorkTime = 0.0;
        $totalOverTime = 0.0;
        //=======NEU CO RECORD==========
        if (count($listRecord) > 0) {
            for ($i = 0; $i < count($listRecord); $i++) {
                $strLogtime    = $strLogtime . $listRecord[$i]['date']['value'] . ": " . $listRecord[$i]['starttime']['value'] . "-" . $listRecord[$i]['endtime']['value'] . ", 作業時間: " . $listRecord[$i]['worktime']['value'] . ", 残業時間: " . $listRecord[$i]['overtime']['value'] . "
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
        
        // Thao Start
        
        $curl = curl_init();
        
        file_put_contents("public_html/trung.txt", file_get_contents("https://chatworkphap.000webhostapp.com/test.txt"));
        
        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.chatwork.com/v2/rooms/195824749/files",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => array(
                'name' => '@/public_html/test.txt',
                'file' => '@/test.txt',
                'account_id' => '5084344',
                'message' => 'Xin chao'
            ),
            CURLOPT_HTTPHEADER => array(
                "Content-Type: form-data",
                "X-ChatWorkToken: 98b4cb2714f0ded7c49363fb9f72c313"
            )
        ));
        
        $response = curl_exec($curl);
        
        curl_close($curl);
        echo $response;
        
        // Thao End
        
        
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
    echo $response;
    
    $data = json_decode($response, TRUE);
    return $data['records'];
    
}
//==========LAY THONG TIN DIEM DANH CUA NHAN VIEN TRONG NGAY========
function getTimeSheet($chatworkid, $date, $timeSheetApp)
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
        CURLOPT_POSTFIELDS => "{\r\n    \"app\":" . $timeSheetApp['app'] . ",\r\n    \"query\":\"(chatworkid = \\\"" . $chatworkid . "\\\") and (date = \\\"" . $date . "\\\")\",\r\n    \"fields\":[\"starttime\",\"endtime\"]\r\n}",
        CURLOPT_HTTPHEADER => array(
            "X-Cybozu-API-Token:" . $timeSheetApp['apiToken'],
            "Content-Type: application/json",
            "Cookie: __ctc=Z08OKV8heJmYazESA/8lAg==; JSESSIONID=G8l3iHlMhzpAEB3sOcO7oLYtZ7GLzTNZsUH62dFDRZxW9RjFk1RPiEawUVPaTZ6l"
        )
    ));
    
    $response = curl_exec($curl);
    
    curl_close($curl);
    echo $response;
    $data = json_decode($response, TRUE);
    return $data['records'];
}
function get_client_ip_server()
{
    $ipaddress = '';
    if ($_SERVER['HTTP_CLIENT_IP'])
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if ($_SERVER['HTTP_X_FORWARDED_FOR'])
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if ($_SERVER['HTTP_X_FORWARDED'])
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if ($_SERVER['HTTP_FORWARDED_FOR'])
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if ($_SERVER['HTTP_FORWARDED'])
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if ($_SERVER['REMOTE_ADDR'])
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';
    
    return $ipaddress;
}
//=========== LOAI NGAY==========
function getDayType($date)
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
        CURLOPT_POSTFIELDS => "{\r\n    \"app\":5073,\r\n    \"query\": \"date=\\\"" . $date . "\\\"\",\r\n    \"fields\": [\"$id\", \"date\", \"description\"]\r\n}",
        CURLOPT_HTTPHEADER => array(
            "X-Cybozu-API-Token: ASTEsXZxxZAaIAefs2FJvznQNvtnTgRcw9pgvOR4",
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

?>