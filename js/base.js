$(function () {
    GetAuthorizationHeader();
    GetApiResponse();    
  });
  
  function GetAuthorizationHeader() {    
    const parameter = {
        grant_type:"client_credentials",
        client_id: "maggie19921001-91fc1045-55d8-47e4",
        client_secret: "6fc90fcd-9be9-4dc5-91e9-a4c7131986cd"
    };
    
    let auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
        
    $.ajax({
        type: "POST",
        url: auth_url,
        headers: {
  
              },  
        crossDomain:true,
        dataType:'JSON',                
        data: parameter,
        async: false,       
        success: function(data){            
            $("#accesstoken").text(JSON.stringify(data));                            
        },
        error: function (xhr, textStatus, thrownError) { 
        }
    });          
  }
  //NOTE 如果要將 js 運行在伺服器，可在ajax-get-headers中額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
  function GetApiResponse(){    
    let accesstokenStr = $("#accesstoken").text();    
    let accesstoken = JSON.parse(accesstokenStr); 
    if(accesstoken !=undefined){
      $.ajax({
        type: 'GET',
        url: `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24filter=contains%28ScenicSpotName%2C%27${keyWord}%27%29&%24top=20&%24format=JSON`,             
        headers: {
            "authorization": "Bearer " + accesstoken.access_token,
          },            
        async: false,
        success: function (Data) {
            
        },
        error: function (xhr, textStatus, thrownError) {
            console.log('errorStatus:',textStatus);
            console.log('Error:',thrownError);
        }
      });
    }
  }