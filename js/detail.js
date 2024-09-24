//TODO 將API移至Firebase
//TODO google map API


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
  //取得當前網址，用split分成兩段後的陣列，取第二個值
  //ID前兩個字 C1：景點 C2：活動 C3：：餐飲
  const ID = location.href.split('=')[1];

  const city = document.querySelector('.city');
  const currentSpot = document.querySelectorAll('.current-spot');
  const tags = document.querySelector('.tags');
  const mainContent = document.querySelector('.intro-content');

  if(accesstoken !=undefined){
    if(ID.substring(0,2) == "C1"){
      $.ajax({
        type: 'GET',
        url: `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24filter=contains(ScenicSpotID,'${ID}')&?format=JSON`,             
        headers: {
            "authorization": "Bearer " + accesstoken.access_token,
          },            
        async: false,

        success: function (Data) {
          console.log(Data);
          city.innerHTML = Data[0].City;
          currentSpot[0].innerHTML = Data[0].ScenicSpotName;
          currentSpot[1].innerHTML = Data[0].ScenicSpotName;

          const mainPhoto = document.querySelector('.main-photo-url');
          const PicUrl = Data[0].Picture.PictureUrl1;
          if(PicUrl){
            mainPhoto.innerHTML =`<img class="main-photo" src="${PicUrl}" alt="${Data[0].PictureDescription1}">`
          }

          const class1 = Data[0].Class1;
          const class2 = Data[0].Class2;
          //不一定有class
          if(class2 && class1){
            tags.innerHTML =`
          <li class="hashtag"><a href="#"># ${class1}</a></li>
          <li class="hashtag"><a href="#"># ${class2}</a></li>`;
          }else if(class1){
            tags.innerHTML =`
          <li class="hashtag"><a href="#"># ${class1}</a></li>`;
          }else if(class2){
            tags.innerHTML =`
          <li class="hashtag"><a href="#"># ${class2}</a></li>`;
          };
          const description = Data[0].Description;
          const detail = Data[0].DescriptionDetail;
          //Description可能只填寫其中一個或是兩個是相同內容
          if(description && detail){
            if(description != detail){
              mainContent.innerHTML = `${description}<br>${detail}`;
            }else{
              mainContent.innerHTML = description;
            }
          }else if(description){
            mainContent.innerHTML = description;
          }else{
            mainContent.innerHTML = detail;
          }
          const openTime = document.querySelector('.open-time');
          if(Data[0].OpenTime){
            openTime.innerHTML = `<span class="fs-ml fw-7">開放時間：</span>${Data[0].OpenTime}`;
          }
          
          const phoneNumber = document.querySelector('.phone-number');
          phoneNumber.innerHTML = Data[0].Phone;
          const address = document.querySelector('.address');
          address.innerHTML = Data[0].Address;
          const webUrl = document.querySelector('.web-url');
          if(Data[0].WebsiteUrl){
            webUrl.innerHTML = `<span class="fs-ml fw-7">官方網站：</span><a href="${Data[0].WebsiteUrl}">${Data[0].WebsiteUrl}</a>`;
          }
          const ticketInfo = document.querySelector('.ticket-info');
          if(Data[0].TicketInfo){
            ticketInfo.innerHTML =`<span class="fs-ml fw-7">票價資訊：</span>${Data[0].TicketInfo}`;
          }
          const travelInfo = document.querySelector('.travel-info');
          if(Data[0].TravelInfo){
            travelInfo.innerHTML =`<span class="fs-ml fw-7">交通資訊：</span>${Data[0].TravelInfo}`;
          }
          const remarks = document.querySelector('.remarks');
          if(Data[0].Remarks){
            remarks.innerHTML =`<span class="fs-ml fw-7">注意事項：</span>${Data[0].Remarks}`;
          }
        },
        error: function (xhr, textStatus, thrownError) {
            console.log('errorStatus:',textStatus);
            console.log('Error:',thrownError);
        }
      });
    }else if(ID.substring(0,2) == "C2"){
      $.ajax({
        type: 'GET',
        url: `https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24filter=contains(ActivityID,'${ID}')&?format=JSON`,             
        headers: {
            "authorization": "Bearer " + accesstoken.access_token,
          },            
        async: false,
        success: function (Data) {
          console.log(Data);
          city.innerHTML = Data[0].City;
          currentSpot[0].innerHTML = Data[0].ActivityName;
          currentSpot[1].innerHTML = Data[0].ActivityName;

          const mainPhoto = document.querySelector('.main-photo-url');
          const PicUrl = Data[0].Picture.PictureUrl1;
          if(PicUrl){
            mainPhoto.innerHTML =`<img class="main-photo" src="${PicUrl}" alt="${Data[0].PictureDescription1}">`
          }

          const class1 = Data[0].Class1;
          const class2 = Data[0].Class2;
          //不一定有class
          if(class2){
            tags.innerHTML =`
          <li class="hashtag"><a href="#"># ${class1}</a></li>
          <li class="hashtag"><a href="#"># ${class2}</a></li>`;
          }else if(class1){
            tags.innerHTML =`
          <li class="hashtag"><a href="#"># ${class1}</a></li>`;
          };
          const description = Data[0].Description;
          const detail = Data[0].DescriptionDetail;
          //Description可能只填寫其中一個或是兩個是相同內容
          if(description && detail){
            if(description != detail){
              mainContent.innerHTML = `${description}<br>${detail}`;
            }else{
              mainContent.innerHTML = description;
            }
          }else if(description){
            mainContent.innerHTML = description;
          }else{
            mainContent.innerHTML = detail;
          }
          const openTime = document.querySelector('.open-time');
          if(Data[0].OpenTime){
            openTime.innerHTML = `<span class="fs-ml fw-7">開放時間：</span>${Data[0].OpenTime}`;
          }
          const phoneNumber = document.querySelector('.phone-number');
          phoneNumber.innerHTML = Data[0].Phone;
          const address = document.querySelector('.address');
          address.innerHTML = Data[0].Address;
          const webUrl = document.querySelector('.web-url');
          if(Data[0].WebsiteUrl){
            webUrl.innerHTML = `<span class="fs-ml fw-7">官方網站：</span><a href="${Data[0].WebsiteUrl}" target="_blank">${Data[0].WebsiteUrl}</a>`;
          }
          const ticketInfo = document.querySelector('.ticket-info');
          if(Data[0].TicketInfo){
            ticketInfo.innerHTML =`<span class="fs-ml fw-7">票價資訊：</span>${Data[0].TicketInfo}`;
          }
          const travelInfo = document.querySelector('.travel-info');
          if(Data[0].TravelInfo){
            travelInfo.innerHTML =`<span class="fs-ml fw-7">交通資訊：</span>${Data[0].TravelInfo}`;
          }
          const remarks = document.querySelector('.remarks');
          if(Data[0].Remarks){
            remarks.innerHTML =`<span class="fs-ml fw-7">注意事項：</span>${Data[0].Remarks}`;
          }
        },
        error: function (xhr, textStatus, thrownError) {
            console.log('errorStatus:',textStatus);
            console.log('Error:',thrownError);
        }
      });
    }else if(ID.substring(0,2) == "C3"){
      $.ajax({
        type: 'GET',
        url: `https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24filter=contains(RestaurantID,'${ID}')&?format=JSON`,             
        headers: {
            "authorization": "Bearer " + accesstoken.access_token,
          },            
        async: false,
        success: function (Data) {
          console.log(Data);
          city.innerHTML = Data[0].City;
          currentSpot[0].innerHTML = Data[0].RestaurantName;
          currentSpot[1].innerHTML = Data[0].RestaurantName;

          const mainPhoto = document.querySelector('.main-photo-url');
          const PicUrl = Data[0].Picture.PictureUrl1;
          if(PicUrl){
            mainPhoto.innerHTML =`<img class="main-photo" src="${PicUrl}" alt="${Data[0].PictureDescription1}">`
          }

          const class1 = Data[0].Class1;
          const class2 = Data[0].Class2;
          //不一定有class
          if(class2){
            tags.innerHTML =`
          <li class="hashtag"><a href="#"># ${class1}</a></li>
          <li class="hashtag"><a href="#"># ${class2}</a></li>`;
          }else if(class1){
            tags.innerHTML =`
          <li class="hashtag"><a href="#"># ${class1}</a></li>`;
          };
          const description = Data[0].Description;
          const detail = Data[0].DescriptionDetail;
          //Description可能只填寫其中一個或是兩個是相同內容
          if(description && detail){
            if(description != detail){
              mainContent.innerHTML = `${description}<br>${detail}`;
            }else{
              mainContent.innerHTML = description;
            }
          }else if(description){
            mainContent.innerHTML = description;
          }else{
            mainContent.innerHTML = detail;
          }
          const openTime = document.querySelector('.open-time');
          if(Data[0].OpenTime){
            openTime.innerHTML = `<span class="fs-ml fw-7">開放時間：</span>${Data[0].OpenTime}`;
          }
          const phoneNumber = document.querySelector('.phone-number');
          phoneNumber.innerHTML = Data[0].Phone;
          const address = document.querySelector('.address');
          address.innerHTML = Data[0].Address;
          const webUrl = document.querySelector('.web-url');
          if(Data[0].WebsiteUrl){
            webUrl.innerHTML = `<span class="fs-ml fw-7">官方網站：</span><a href="${Data[0].WebsiteUrl}">${Data[0].WebsiteUrl}</a>`;
          }
          const ticketInfo = document.querySelector('.ticket-info');
          if(Data[0].TicketInfo){
            ticketInfo.innerHTML =`<span class="fs-ml fw-7">票價資訊：</span>${Data[0].TicketInfo}`;
          }
          const travelInfo = document.querySelector('.travel-info');
          if(Data[0].TravelInfo){
            travelInfo.innerHTML =`<span class="fs-ml fw-7">交通資訊：</span>${Data[0].TravelInfo}`;
          }
          const remarks = document.querySelector('.remarks');
          if(Data[0].Remarks){
            remarks.innerHTML =`<span class="fs-ml fw-7">注意事項：</span>${Data[0].Remarks}`;
          }
        },
        error: function (xhr, textStatus, thrownError) {
            console.log('errorStatus:',textStatus);
            console.log('Error:',thrownError);
        }
      });
    }
    
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // 從localStorage中獲取搜尋結果
  let results = JSON.parse(localStorage.getItem('searchResults'));
  displayResults(results);
  console.log(results);
});

//TODO 只顯示四筆資料
function displayResults(results) {
  let str ="";
  const spotFrame = document.querySelector('.spot-frame')
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
  spotFrame.innerHTML = str;
}