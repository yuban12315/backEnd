var province = '' ;
var city = '' ;
jQuery.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js",function(){
    province = remote_ip_info["province"];
    city = remote_ip_info["city"];
    alert(city)  //弹出城市名称
})