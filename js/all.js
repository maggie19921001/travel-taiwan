$(function () {
    GetAuthorizationHeader();
    GetApiResponse();    
    getPhoto();
    loadEvent();
    loadSpot();
    loadFood();
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

//搜尋功能
function GetApiResponse(){    
    let accesstokenStr = $("#accesstoken").text();    
    let accesstoken = JSON.parse(accesstokenStr); 
    const searchTxt = document.querySelector("#search-txt");
    const searchBtn = document.querySelector("#search-btn");
    const chooseType = document.querySelector('.choose');
    
    searchBtn.addEventListener('click',function(e){
        e.preventDefault(); // 阻止表單提交
        const keyWord = searchTxt.value;
        if(keyWord==""){
            alert("請輸入搜尋文字")
        }else{
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


function loadEvent(){
    let accesstokenStr = $("#accesstoken").text();    
    let accesstoken = JSON.parse(accesstokenStr); 
    if(accesstoken !=undefined){
        $.ajax({
            type: 'GET',
            url: 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24top=4&%24format=JSON',             
            headers: {
                "authorization": "Bearer " + accesstoken.access_token,
              },            
            async: false,
            success: function (apiData) {
                console.log(apiData);

                function createEventBox(eventData){
                    const eventBox = document.createElement('div');
                    eventBox.className = "event-box";
                
                    const eventPic = document.createElement('div');
                    eventPic.className = "event-1 event-pic";
                    eventPic.style.backgroundImage = `url(${eventData.Picture.PictureUrl1})`;
                    eventBox.appendChild(eventPic);
                
                    const eventContent = document.createElement('div');
                    eventContent.className = "event-content";
                
                    const eventTopic = document.createElement('div');
                    eventTopic.className = "event-topic";
                
                    const eventDate = document.createElement('p');
                    eventDate.className = "event-date fs-s fs-4 fc-sub";
                    const startDate = new Date(eventData.StartTime);
                    const endDate = new Date(eventData.EndTime);
                    const formattedDate = `
                    ${startDate.getFullYear()}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getDate().toString().padStart(2, '0')}
                    -${endDate.getFullYear()}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getDate().toString().padStart(2, '0')}`;

                    eventDate.textContent = formattedDate;
                
                    const eventName = document.createElement('p');
                    eventName.className = "event-name fc-pri fw-7";
                    eventName.textContent = eventData.ActivityName;
                
                    eventTopic.append(eventDate, eventName);
                    eventContent.appendChild(eventTopic);
                
                    const eventDetail = document.createElement('div');
                    eventDetail.className = "event-detail";
                
                    const eventLocation = document.createElement('div');
                    eventLocation.className = "event-location dfaic";
                    
                    const locationImg = document.createElement('img');
                    locationImg.src = "https://raw.githubusercontent.com/maggie19921001/travel-taiwan/587c9b7686a4f37baa262727752c06943a18772a/css/images/Icon/spot16.svg"
                
                    const locationSpan = document.createElement('span');
                    locationSpan.className = "place fc-sub fs-s";
                    locationSpan.textContent = eventData.Location;//改顯示前面三個字
                
                    eventLocation.append(locationImg,locationSpan);
                    eventDetail.appendChild(eventLocation);
                
                    const eventMore = document.createElement('div');
                    eventMore.className = "event-more dfaic";
                
                    const moreSpan = document.createElement('sapn');
                    moreSpan.className = "more-p fc-g fs-s";
                    moreSpan.textContent = "詳細介紹";
                    
                    const moreImg = document.createElement('img');
                    moreImg.src = "https://raw.githubusercontent.com/maggie19921001/travel-taiwan/9c2e592f364f12b1ed54e54ce984f8c3dc1268cd/css/images/Icon/arrow-right16_G.svg"
                
                    const eventBoxLink = document.createElement('a');
                    eventBoxLink.href = `detail.html?id=${eventData.ActivityID}`;
                    eventBoxLink.append(moreSpan, moreImg);

                    eventMore.appendChild(eventBoxLink)
                    eventDetail.appendChild(eventMore);
                
                    eventContent.appendChild(eventDetail);
                    eventBox.appendChild(eventContent);

                    return eventBox;
                 }
                
                /* 
                <a href="detail.html?id=${result.ScenicSpotID}">
                <div class="event-box">
                <div class="event-1 event-pic" style="background-image: url(/css/images/photo/event-1.jpeg);"></div>
                <div class="event-content">
                    <div class="event-topic">
                        <p class="event-date fs-s fs-4 fc-sub">2024/10/30 - 2024/11/13</p>
                        <p class="event-name fc-pri fw-7">2024日月潭花火音樂嘉年華</p>
                    </div>
                    <div class="event-detail">
                        <div class="event-location dfaic">
                            <img src="https://raw.githubusercontent.com/maggie19921001/travel-taiwan/587c9b7686a4f37baa262727752c06943a18772a/css/images/Icon/spot16.svg" alt="">
                            <span class="place fc-sub fs-s">南投縣</span>
                        </div>
                
                        <div class="event-more dfaic">
                            <span class="more-p fc-g fs-s">詳細介紹</span>
                            <img src="https://raw.githubusercontent.com/maggie19921001/travel-taiwan/9c2e592f364f12b1ed54e54ce984f8c3dc1268cd/css/images/Icon/arrow-right16_G.svg" alt="">
                        </div>
                    </div>
                </div>
                </div> */
                const eventMain = document.querySelector('#event-main');
                apiData.forEach(eventData=>{
                    const eventBox = createEventBox(eventData);
                    eventMain.appendChild(eventBox);
                })

            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:',textStatus);
                console.log('Error:',thrownError);
            }
        });
    }
}

function loadSpot(){
    let accesstokenStr = $("#accesstoken").text();    
    let accesstoken = JSON.parse(accesstokenStr); 
    if(accesstoken !=undefined){
        $.ajax({
            type: 'GET',
            url: 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24orderby=UpdateTime%20desc&%24top=30&%24format=JSON',             
            headers: {
                "authorization": "Bearer " + accesstoken.access_token,
              },            
            async: false,
            success: function (apiData) {
                console.log(apiData);

                function createSpotBox(spotData){
                    const spotBox = document.createElement('div');
                    spotBox.className = "spot-box";
                
                    const spotPic = document.createElement("div");
                    spotPic.className = "spot-1 spot-pic";
                    if (spotData?.Picture?.PictureUrl1){
                        spotPic.style.backgroundImage = `url(${spotData.Picture.PictureUrl1})`;
                    }

                    const spotName = document.createElement('p');
                    spotName.className = "spot-name fc-pri fw-7";
                    spotName.textContent = spotData.ScenicSpotName;
                
                    const eventLocation = document.createElement('div');
                    eventLocation.className = "event-location dfaic";
                
                    const eventImg = document.createElement('img');
                    eventImg.src = "https://raw.githubusercontent.com/maggie19921001/travel-taiwan/587c9b7686a4f37baa262727752c06943a18772a/css/images/Icon/spot16.svg";
                
                    const eventSpan = document.createElement('span');
                    eventSpan.className = "place fc-sub";
                    eventSpan.textContent = spotData.Address;
                
                    eventLocation.append(eventImg, eventSpan);

                    const spotLink = document.createElement('a');
                    spotLink.href =`detail.html?id=${spotData.ScenicSpotID}`

                    spotLink.append(spotPic, spotName, eventLocation);
                    spotBox.appendChild(spotLink);
                    return spotBox;
                }
                /* <div class="spot-box">
                    <div class="spot-1 spot-pic"></div>
                    <p class="spot-name fc-pri fw-7">龜山島牛奶海</p>
                    <div class="event-location dfaic">
                        <img src="https://raw.githubusercontent.com/maggie19921001/travel-taiwan/587c9b7686a4f37baa262727752c06943a18772a/css/images/Icon/spot16.svg" alt="">
                        <span class="place fc-sub">宜蘭縣</span>
                    </div>
                  </div> */
                const spotMain = document.querySelector('#spot-main');
               // 先過濾有圖片的資料
                const validSpots = apiData.filter(spotData => spotData?.Picture?.PictureUrl1);
                // 隨機打亂順序
                const randomSpots = validSpots.sort(() => Math.random() - 0.5);
                // 取前4筆
                randomSpots.slice(0, 4).forEach(spotData => {
                    const spotBox = createSpotBox(spotData);
                    spotMain.appendChild(spotBox);
                });

            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:',textStatus);
                console.log('Error:',thrownError);
            }
        });
    }
}

function loadFood(){
    let accesstokenStr = $("#accesstoken").text();    
    let accesstoken = JSON.parse(accesstokenStr); 
    if(accesstoken !=undefined){
        $.ajax({
            type: 'GET',
            url: 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24top=4&%24format=JSON',             
            headers: {
                "authorization": "Bearer " + accesstoken.access_token,
              },            
            async: false,
            success: function (apiData) {
                console.log(apiData);
                function createFoodBox(foodData){
                    const foodBox = document.createElement('div');
                    foodBox.className = "spot-box";
                
                    const spotPic = document.createElement("div");
                    spotPic.className = "food-1 spot-pic";
                    spotPic.style.backgroundImage = `url(${foodData.Picture.PictureUrl1})`;

                    const spotName = document.createElement('p');
                    spotName.className = "spot-name fc-pri fw-7";
                    spotName.textContent = foodData.RestaurantName;
                
                    const eventLocation = document.createElement('div');
                    eventLocation.className = "event-location dfaic";
                
                    const eventImg = document.createElement('img');
                    eventImg.src = "https://raw.githubusercontent.com/maggie19921001/travel-taiwan/587c9b7686a4f37baa262727752c06943a18772a/css/images/Icon/spot16.svg";
                
                    const eventSpan = document.createElement('span');
                    eventSpan.className = "place fc-sub";
                    eventSpan.textContent = foodData.Address;
                
                    eventLocation.append(eventImg, eventSpan);
                
                    const spotLink = document.createElement('a');
                    spotLink.href =`detail.html?id=${foodData.RestaurantID}`
                
                    spotLink.append(spotPic, spotName, eventLocation);
                    foodBox.appendChild(spotLink);
                    return foodBox;
                }
                
                /* <div class="spot-box">
                <div class="food-1 spot-pic"></div>
                <p class="spot-name fc-pri fw-7">金都餐廳</p>
                <div class="event-location dfaic">
                    <img src="https://raw.githubusercontent.com/maggie19921001/travel-taiwan/587c9b7686a4f37baa262727752c06943a18772a/css/images/Icon/spot16.svg" alt="">
                    <span class="place fc-sub">南投縣</span>
                </div>
                </div> */

                const foodMain = document.querySelector('#food-main');
                apiData.forEach(foodData=>{
                    const foodBox = createFoodBox(foodData);
                    foodMain.appendChild(foodBox);
                })

            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:',textStatus);
                console.log('Error:',thrownError);
            }
        });
    }
}


