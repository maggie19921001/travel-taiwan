$(function () {
    GetAuthorizationHeader();
    GetApiResponse();    
    getPhoto();
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
    const searchTxt = document.querySelector("#search-txt");
    const searchBtn = document.querySelector("#search-btn");
    const chooseType = document.querySelector('.choose');
    
    searchBtn.addEventListener('click',function(e){
        e.preventDefault(); // 阻止表單提交
        const keyWord = searchTxt.value;
        if(accesstoken !=undefined){
            if(chooseType.value=='scene'){
                $.ajax({
                    type: 'GET',
                    url: `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?$filter=contains(ScenicSpotName,'${keyWord}')&$top=20&$format=JSON`,             
                    headers: {
                        "authorization": "Bearer " + accesstoken.access_token,
                      },            
                    async: false,
                    //Data是陣列
                    success: function (Data) {
                        // $('#apireponse').text(JSON.stringify(Data));                
                        // 將搜尋結果存儲在localStorage
                        localStorage.setItem('searchResults', JSON.stringify(Data));
                        // 跳轉至結果頁面
                        window.location.href = 'search_results.html';
                    },
                    error: function (xhr, textStatus, thrownError) {
                        console.log('errorStatus:',textStatus);
                        console.log('Error:',thrownError);
                    }
                });
            }else if(chooseType.value=='event'){
                $.ajax({
                    type: 'GET',
                    url: `https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?$filter=contains(ActivityName,'${keyWord}')&$top=20&$format=JSON`,             
                    headers: {
                        "authorization": "Bearer " + accesstoken.access_token,
                      },            
                    async: false,

                    success: function (Data) {
                        localStorage.setItem('searchResults', JSON.stringify(Data));
                        window.location.href = 'search_results.html';
                    },
                    error: function (xhr, textStatus, thrownError) {
                        console.log('errorStatus:',textStatus);
                        console.log('Error:',thrownError);
                    }
                });
            }else if(chooseType.value=='food'){
                $.ajax({
                    type: 'GET',
                    url: `https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?$filter=contains(RestaurantName,'${keyWord}')&$top=20&$format=JSON`,             
                    headers: {
                        "authorization": "Bearer " + accesstoken.access_token,
                      },            
                    async: false,
                    
                    success: function (Data) {
                        localStorage.setItem('searchResults', JSON.stringify(Data));
                        window.location.href = 'search_results.html';
                    },
                    error: function (xhr, textStatus, thrownError) {
                        console.log('errorStatus:',textStatus);
                        console.log('Error:',thrownError);
                    }
                });
            }
            
        }

    })

}
let loopPhoto=[];
function getPhoto(){
    let accesstokenStr = $("#accesstoken").text();    
    let accesstoken = JSON.parse(accesstokenStr); 
    if(accesstoken !=undefined){
        $.ajax({
            type: 'GET',
            url: 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/Taipei?%24top=30&%24format=JSON',             
            headers: {
                "authorization": "Bearer " + accesstoken.access_token,
              },            
            async: false,
            success: function (Data) {
                Data.forEach((item) => {
                    if(item.Picture.PictureUrl1 !== undefined){
                        loopPhoto.push(item);
                    }
                });
                renderSwiper();
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:',textStatus);
                console.log('Error:',thrownError);
            }
        });
    }
}

//NOTE getPhoto中使用
function renderSwiper(){
    let str = "";
    loopPhoto.forEach((result)=>{
        // const address = result.Address.substring(0,3);
        str+=`
        <div class="swiper-slide">
            <p class="photo-title fw-7"> ${result.City}<br>${result.ScenicSpotName}</p>
            <img class="loop-photo" src="${result.Picture.PictureUrl1}"> 
        </div>` 
    });

const swiperWrapper = document.querySelector('.swiper-wrapper');
swiperWrapper.innerHTML = str;

//.swiper-container 要修改！！
var swiper = new Swiper(".swiper-container", {
    cssMode: true,
    observer: true,
    observeParents: true,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
    },
    mousewheel: true,
    keyboard: true,
  });
  
}

