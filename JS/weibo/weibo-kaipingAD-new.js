// 2022-12-25 18:42

var url = $request.url;
var body = $response.body;

function adAppName(adUrls) {
 
  if (/^https:\/\/sdkapp\.uve\.weibo\.com\/interface\/sdk\/sdkad\.php$/.test(adUrls)) return "微博-开屏广告-sdkad";
  if (/^https:\/\/wbapp\.uve\.weibo\.com\/wbapplua\/wbpullad\.lua\?wm=/.test(adUrls)) return "微博-开屏广告-wbpullad";
 
  return "";
}

if (!body) $done({});
switch (adAppName(url)) {
  case "微博-开屏广告-sdkad":
    try {
      body = body.match(/\{.*\}/);
      let obj = JSON.parse(body);
      if (obj.needlocation) obj.needlocation = false;
      if (obj.show_push_splash_ad) obj.show_push_splash_ad = false;
      if (obj.code) obj.code = 200;
      if (obj.background_delay_display_time) {
        obj.background_delay_display_time = 31536000; // 60 * 60 * 24 * 365 = 31536000
      }
      if (obj.lastAdShow_delay_display_time) {
        obj.lastAdShow_delay_display_time = 31536000;
      }
      if (obj.realtime_ad_video_stall_time) {
        obj.realtime_ad_video_stall_time = 31536000;
      }
      if (obj.realtime_ad_timeout_duration) {
        obj.realtime_ad_timeout_duration = 31536000;
      }
      for (let item of obj["ads"]) {
        item["displaytime"] = 0;
        item["displayintervel"] = 31536000;
        item["allowdaydisplaynum"] = 0;
        item["begintime"] = "2040-01-01 00:00:00";
        item["endtime"] = "2040-01-01 23:59:59";
      }
      body = JSON.stringify(obj) + "OK";
    } catch (error) {
      console.log(`微博-开屏广告-sdkad, 出现异常`);        
    }
    break;
  case "微博-开屏广告-wbpullad":
    try {
      let obj = JSON.parse(body);
      for (let item of obj["cached_ad"]["ads"]) {
        item["start_date"] = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
        item["show_count"] = 0;
        item["duration"] = 31536000; // 60 * 60 * 24 * 365 = 31536000
        item["end_date"] = 2209046399; // Unix 时间戳 2040-01-01 23:59:59
      }
      body = JSON.stringify(obj);
    } catch (error) {
      console.log(`微博-开屏广告-wbpullad, 出现异常`);
    }
    break;
  default:
    break;
}

$done({ body });
