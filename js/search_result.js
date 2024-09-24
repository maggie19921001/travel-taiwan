document.addEventListener('DOMContentLoaded', function() {
    // 從localStorage中獲取搜尋結果
    let results = JSON.parse(localStorage.getItem('searchResults'));
    displayResults(results);
});

//TODO 頁數BAR
//TODO 搜尋未輸入文字
function displayResults(results) {

    //路徑標籤
    const currentType = document.querySelector('.current-type');
    let spotType = ['探索景點','節慶活動','品嚐美食'];
    if(results[0].ScenicSpotID){
        currentType.innerHTML = spotType[0]
    }else if(results[0].ActivityID){
        currentType.innerHTML = spotType[1]
    }else{
        currentType.innerHTML = spotType[2]
    }

    //搜尋數量
    const allNum = document.querySelector('.all-num');
    allNum.innerHTML = results.length;
    const resultsContainer = document.querySelector('.result-main');
    let str ="";
   
    //得到的資料是否有圖片
    results.forEach(result => {
        if(result.ScenicSpotName){
            if(result.Picture.PictureUrl1){
                str+=`<a href="detail.html?id=${result.ScenicSpotID}">
                    <div class="spot-box">
                    <div class="spot-pic" style="background-image: url(${result.Picture.PictureUrl1}); aria-label="${result.PictureDescription1}""></div>
                    <p class="spot-name fc-pri fw-7">${result.ScenicSpotName}</p>
                    <div class="event-location dfaic">
                    <img src="/images/Icon/spot16.png" alt="">
                    <span class="place fc-sub">${result.City}</span>
                    </div>
                </div>
                </a>`
            }else{
                str+=`<a href="detail.html?id=${result.ScenicSpotID}">
                    <div class="spot-box">
                    <div class="spot-pic" style="background-image: url(/images/Images/NoImage-255x200.png);" aria-label="無附圖"></div>
                    <p class="spot-name fc-pri fw-7">${result.ScenicSpotName}</p>
                    <div class="event-location dfaic">
                    <img src="/images/Icon/spot16.png" alt="">
                    <span class="place fc-sub">${result.City}</span>
                    </div>
                </div>
                </a>`
            }
        }else if(result.ActivityName){
            if(result.Picture.PictureUrl1){
                str+=`<a href="detail.html?id=${result.ActivityID}">
                    <div class="spot-box">
                    <div class="spot-pic" style="background-image: url(${result.Picture.PictureUrl1}); aria-label="${result.PictureDescription1}""></div>
                    <p class="spot-name fc-pri fw-7">${result.ActivityName}</p>
                    <div class="event-location dfaic">
                    <img src="/images/Icon/spot16.png" alt="">
                    <span class="place fc-sub">${result.City}</span>
                    </div>
                </div>
                </a>`
            }else{
                str+=`<a href="detail.html?id=${result.ActivityID}">
                    <div class="spot-box">
                    <div class="spot-pic" style="background-image: url(/images/Images/NoImage-255x200.png);" aria-label="無附圖"></div>
                    <p class="spot-name fc-pri fw-7">${result.ActivityName}</p>
                    <div class="event-location dfaic">
                    <img src="/images/Icon/spot16.png" alt="">
                    <span class="place fc-sub">${result.City}</span>
                    </div>
                </div>
                </a>`
            }
        }else{
            if(result.Picture.PictureUrl1){
                str+=`<a href="detail.html?id=${result.RestaurantID}">
                    <div class="spot-box">
                    <div class="spot-pic" style="background-image: url(${result.Picture.PictureUrl1}); aria-label="${result.PictureDescription1}""></div>
                    <p class="spot-name fc-pri fw-7">${result.RestaurantName}</p>
                    <div class="event-location dfaic">
                    <img src="/images/Icon/spot16.png" alt="">
                    <span class="place fc-sub">${result.City}</span>
                    </div>
                </div>
                </a>`
            }else{
                str+=`<a href="detail.html?id=${result.RestaurantID}">
                    <div class="spot-box">
                    <div class="spot-pic" style="background-image: url(/images/Images/NoImage-255x200.png);" aria-label="無附圖"></div>
                    <p class="spot-name fc-pri fw-7">${result.RestaurantName}</p>
                    <div class="event-location dfaic">
                    <img src="/images/Icon/spot16.png" alt="">
                    <span class="place fc-sub">${result.City}</span>
                    </div>
                </div>
                </a>`
            }
        }
    });
    resultsContainer.innerHTML = str;
}

//重新搜尋
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
function GetApiResponse(){    
    let accesstokenStr = $("#accesstoken").text();    
    let accesstoken = JSON.parse(accesstokenStr); 
    const searchTxt = document.querySelector("#search-txt");
    const searchBtn = document.querySelector("#search-btn");
    const chooseType = document.querySelector('.choose-again');
    
    searchBtn.addEventListener('click',function(e){
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
                    
                    success: function (data) {
                        results = data
                        displayResults(results)
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
                    
                    success: function (data) {
                        results = data
                        displayResults(results)
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
                    
                    success: function (data) {
                        results = data
                        displayResults(results)
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