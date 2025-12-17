let vpautDivElement = null;
let vpautOption = null;
let vpautBannerDivElement = null;
let vpautInnerDivElement = null;
let vpautPlayer = null;
let vpautSiteId = 0;
let vidCountBanner = 0;
let adHalo = 0;
let checkMobAdv = 0;
let firstAd = 0;
let widthEl = 0;
let heightEl = 0;
let startTopEl = 0;
let startBotEl = 0;
let widthRoll = 0;
let heightRoll = 0;
let fclc = 0;
let clickerad = 0;
let openVpaut = 0;
let advOvers = 0;
let vpautCountAd = 0;
let hadMobAdv = 0;
let countCarousel = 0;
let measureW = "px";
let measureHl = "px";
let changeCross = 1;
let lockOverload = false;
let endless = 50;
let endlessMobile = 50;
let numberImp = [];
let isEstablishedConnectionVpautTimeout = null;
let vpautLeapFrog = 1;

//Helpers Funcs
function getCoords(c) {
  c = c.getBoundingClientRect();
  let a = document.body,
    b = document.documentElement;
  return {
    top:
      c.top +
      (window.pageYOffset || b.scrollTop || a.scrollTop) -
      (b.clientTop || a.clientTop || 0),
    left:
      c.left +
      (window.pageXOffset || b.scrollLeft || a.scrollLeft) -
      (b.clientLeft || a.clientLeft || 0),
  };
}

function removeElementsByClass(className) {
  let elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements.remove();
    //elements[0].parentNode.removeChild(elements[0]);
  }
}

function isEmptyObject(obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      return false;
    }
  }
  return true;
}

function exceptionAdList() {
  countCarousel++;
  for (let i = 0; i < numberImp.length; i++) {
    if (numberImp[i] > 0) {
      if (countCarousel >= numberImp[i]) {
        numberImp.splice(i, 1);
        adWrappers.splice(i, 1);
      }
    }
  }
}

function loadScript(id, src) {
  return new Promise(function (resolve, reject) {
    let script = document.createElement("script");
    script.id = id;
    script.src = src;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Ошибка загрузки скрипта ${src}`));

    document.head.append(script);
  });
}

//Preroll Banner Funcs
function closePrerollBanner() {
  if (vpautBannerDivElement) vpautBannerDivElement.remove();
}

//https://videoroll.net/vpaut/banners/mob/banner.php
function getBanner() {
  return fetch(
    "https://avr.i-trailer.ru/banners/index.php?id=" +
      vpautSiteId +
      "&count=" +
      vidCountBanner +
      "&countryp=" +
      vpautOption.countryp,
    {
      method: "GET",
      mode: "cors",
    }
  )
    .then((response) => response.text())
    .then((banner) => {
      if (banner != "END") {
        if (banner == "yandex") {
          vpautBannerDivElement.style.height = "27%";
          let yandexId = "yandex_rtb_R-A-" + vpautOption.ya_id;
          let yandexRtbBlock = "R-A-" + vpautOption.ya_id;
          let yaRtbDiv = document.createElement("div");
          yaRtbDiv.id = yandexId;
          vpautBannerDivElement.appendChild(yaRtbDiv);
          let tag = document.getElementsByTagName("script")[0];
          let scriptRtb = document.createElement("script");
          scriptRtb.type = "text/javascript";
          scriptRtb.src = "//an.yandex.ru/system/context.js";
          scriptRtb.onload = function () {
            Ya.Context.AdvManager.render({
              blockId: yandexRtbBlock,
              renderTo: yandexId,
              async: true,
              onRender: function (data) {
                console.log("Videoroll RTB : " + data.product);
              },
            });
          };
          scriptRtb.async = true;
          tag.parentNode.insertBefore(scriptRtb, tag);
        } else {
          vpautBannerDivElement.innerHTML = banner;
          vidCountBanner = 1;
        }
        let bannerCrossTimer = null;
        if (banner == "yandex") {
          bannerCrossTimer = setTimeout(function () {
            crossExitBanner();
            clearTimeout(bannerCrossTimer);
            bannerCrossTimer = null;
          }, 1);
          //таймер крестика для яндекса - был 13000
        } else {
          bannerCrossTimer = setTimeout(function () {
            crossExitBanner();
            clearTimeout(bannerCrossTimer);
            bannerCrossTimer = null;
          }, 13000);
          //таймер крестика для баннеров обычных - был 13000
        }
        console.info("Vid Banner Create");
      } else {
        closePrerollBanner();
        console.info("Vid vpaut banner end adverts");
      }
    });
}

function crossExitBanner() {
  let crossElement = document.createElement("img");
  crossElement.id = "krestik_banner_mobvpaut";
  crossElement.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTI2RjJCQTZBNjEzMTFFODgxQkI4QjRDREE4MDUyNTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTI2RjJCQTdBNjEzMTFFODgxQkI4QjRDREE4MDUyNTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMjZGMkJBNEE2MTMxMUU4ODFCQjhCNENEQTgwNTI1NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMjZGMkJBNUE2MTMxMUU4ODFCQjhCNENEQTgwNTI1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuznWR8AAAGiSURBVHjazFZNa8JAEJ0svXs0F8VzqZBQe/Qu/hMvigd/gD0UAjnrbypN9FaKHiMk3kTaY7Ldt+3K2jZLYzfQgclOZob3ZpL9YpxzEvogNON2JfvEJRDc83pl7ohHTkQsDMPHxWJxI5n/KI7j0Gg0ep7NZnfiNQeJRGWMkQ0CJcDL8/zDVs52u/1GFqXVap3wmN6iTdHxmClxPB5z3/eNYIhPJhPzd1ZToNPpvOJV6XQ6LeA/HA682WxyPaYUfsQhyNdjwFPYpZ1EUeRkWUaNRoPiOCbXdc/igkD6EUce8it3oird7XYyjlF1hDFJkpNfFPCtS70TIwkUAIpos9nwwWAgRxNBZRJV+Wq1OlvG6/W69F9dRALtdrtnJJ7ncVP+/+tE/8nb7ZYPh0M5QuAvI/o1Se2zq9/v8zRNS4H0ApCH/MqLsdfrAZiOxyNsueB02e/30o848mBftBjF3lWIvck4ixAXe1dhZQpX1R8/l80D6ytebScjzpOiKKR9JRQWC4LgablcXls841+EeYszHtXP676tkHbvSi2Dp+re9S7AADo/E1CTWgh/AAAAAElFTkSuQmCC";
  crossElement.style =
    "position:absolute;top:-25px !important;right:6px !important;border:1px !important;opacity:0.8;z-index:11000;cursor:pointer;height:25px !important;width:25px !important;margin:0 !important;padding:0 !important;"; //pointer-events:none;
  vpautBannerDivElement.appendChild(crossElement);
  if (crossElement.addEventListener) {
    crossElement.addEventListener("click", closePrerollBanner);
  } else {
    crossElement.attachEvent("onclick", closePrerollBanner);
  }
}

function createVpautPrerollBanner() {
  try {
    closePrerollBanner();
  } catch (e) {
    console.info("Delete old banner msg: " + e);
  }

  let bannerDiv = document.createElement("div");
  bannerDiv.id = "tmpDivMobBanner";
  bannerDiv.style.zIndex = 99000;
  bannerDiv.style.opacity = 1;
  bannerDiv.style.width = "98%";
  bannerDiv.style.height = 250 + "px";
  bannerDiv.style.position = "fixed";
  if (
    vpautDivElement.hasAttribute("vid_el_mobile_bottom_indent") &&
    parseInt(vpautDivElement.getAttribute("vid_el_mobile_bottom_indent")) > 0
  ) {
    bannerDiv.style.bottom =
      parseInt(vpautDivElement.getAttribute("vid_el_mobile_bottom_indent")) +
      "px";
  }
  bannerDiv.style.bottom = 0;
  bannerDiv.style.left = "1%";
  if (vpautDivElement.appendChild(bannerDiv)) {
    vpautBannerDivElement = document.getElementById("tmpDivMobBanner");
    getBanner();
  }
}

//Cross close
function clickEnableVpautCrossAfterAdv() {
  let timerCrossAfter = null;
  timerCrossAfter = setTimeout(() => {
    let krestikOv = document.getElementById("cross_vid_vpaut");
    krestikOv.style.pointerEvents = "auto";
    clearTimeout(timerCrossAfter);
    timerCrossAfter = null;
  }, 15000);
}

function ShowKrestic() {
  let cross = document.createElement("img");
  cross.id = "cross_vid_vpaut";
  cross.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA1RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iOTNCRDY1NzdBOUM5Qzg1MDYzRUI1QTRDNTEyNzAzQjgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTY2MzI2RDFDQTVEMTFFQTg2NUNCQTE0NkZBMDI3RTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTY2MzI2RDBDQTVEMTFFQTg2NUNCQTE0NkZBMDI3RTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkZGRjkyOEY1RENBRUExMUFDQkFCMzYxNzA1REE5Q0EiIHN0UmVmOmRvY3VtZW50SUQ9IjkzQkQ2NTc3QTlDOUM4NTA2M0VCNUE0QzUxMjcwM0I4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+qTiwFwAABEhJREFUeNqUVllIlFEUPuOM+5pL7oKQjLkEEiNKKfpgD64oWFFCD2q4USjUQz5lvhT00KMgIuI+tDz7IIhIZmnZApr0FK6jOO7j3vlO/sOv/k524cy9c+695zv7f3XV1dWkHoeHh3RiXGPKYrrKlMh0gWmJ6TvTJ51O18d3hsnBMDjYK2Z6xGTS2PNhimbKY4CnPL9nesH0TkuQkwbPjan3iEx0vpHK9JapQ0vxkyBBer3+69raWvH09DRZLBZxn5OTk6Zk8LG/sLBAOM/37vD9L7zldxaIgS99WFxcjAkPD6eSkhJKT08XoK2trVNA+L+5uUl8njIzM+V8aGgoLS0txTMQYqQ7FRPW6I3Vao2OiIig+vp68vLyEn5YWBi1tLRQSEgIubu708HBgQBsbGyIAuXl5ZSfny9ns7KyqKGhAcBGvt/NrFuiEMxluoEgLi8vi/YAgPYQWFRUJIJmZ2eFZzAYBAAuqqysFID9/X3Z8/X1pbS0NIIcHjeZ0tWWvMKPh4cHTU1N/Y2+m5sIw1xQUCC85uZm8vb2pvX1daqqqqLs7Gza29sjm81mtxz3IUclN0lvMpmQ/08UkImJCQlmQkKCaK3EIy4uTtw1MDBANTU1lJOTYwfAPa4Xam9vp/7+fgoKClJAQpheA6SGF2ng4KCLiwsNDg7KDCAOoggCUHx8PKWmplJKSsoxAOx1dXUJCGKHO6oxB5DHvLikcJydneUigFxdXY8BQQloubOzQ9vb23aA7u5uAUDSQLkTXcMKkOe88Fa3FQDBNUNDQyLEaDSK6xBgWKCcwbqnp4c6OzslCxE/jbbkjuS/eJKLrIKWyJampiYJJjRUD/xH/LDv7+8v53FPY0QCZEGrkrl6aXV1lerq6ig2Nlbcox74jxjV1tZKyiLjzugMv8H9plXJqIOKigrKy8sTPlwDl8GNmPEfMSosLJQ6mp+f1+wMPD6DM6oGwMG5ublTdQDhiMP4+LjM8D+swT4KsqysjGZmZuyZqAZB4Fd4cV+JBUwvLS2l3NzcU2mKADc2NkrhqbMOs1JHo6OjMsPKo/EAILO8uM0UiF6UkZEhzQ6ZpAZQ0hRNcHh4WKxRFyxmAKEbT05OkqenJwDQkZ8pdj1UghkZGSmM3d1d0VgptLa2NkJ39vPzE6DW1lYym82yD4GoHYyoqChRTpGLlNYnJyfDtF/4vLLZRgSQrSMfHx851dHRIYRCQ3HCpUodoWDhqsTERLEEyQJr4So+28vzS6x1CLDS9vnCT/4eRAcHB1NSUpIkwMjIiNQB6kJdB7AAliOGaDPoBGNjY/J94fOT7O7LDCCVqUO7VgYz8WUcWllZiUGdQHBAQIBoplHJdj4Ew72wnukHA1xnvlXzIcEbFj5whWPRxlTs4AVzjB8YGKiwOvn+Pebv/eshYTv64IA+nvMhgddKIdNd1O3/PInMR+Tw3cXUx+Tw3fVHgAEAQsIksG+5cF4AAAAASUVORK5CYII=";
  cross.style =
    "position:absolute;top:35px !important;right:12px !important;pointer-events:none;border:1px !important;opacity:1;z-index:11000;cursor:pointer;height:25px !important;width:25px !important;margin:0 !important;padding:0 !important;";
  vpautInnerDivElement.appendChild(cross);
  if (cross.addEventListener) {
    cross.addEventListener("click", clickMobKrestik);
  } else {
    cross.attachEvent("onclick", clickMobKrestik);
  }
  clickEnableMobileVpautCrossAfterAdv();
}

function clickEnableMobileVpautCrossAfterAdv() {
  let timerCrossAfter = null;
  timerCrossAfter = setTimeout(() => {
    let krestikOv = document.getElementById("cross_vid_vpaut");
    krestikOv.style.pointerEvents = "auto";
    clearTimeout(timerCrossAfter);
    timerCrossAfter = null;
  }, 150000);
}

function clickMobKrestik() {
  let krestikOv = document.getElementById("cross_vid_vpaut");
  krestikOv.style.pointerEvents = "none";
  krestikOv.style.opacity = 0;
  vpautInnerDivElement.style.opacity = 0;
  vpautInnerDivElement.style.pointerEvents = "none";
}

function createTimerVidVpaut() {
  let timerOtcheta = parseInt(vpautOption.timer_closed);
  let crossAdElem = document.createElement("span");
  crossAdElem.id = "timer_vid_vpaut";
  crossAdElem.textContent = timerOtcheta;
  crossAdElem.style =
    "position:absolute;top:35px !important;right:12px !important;color: #fff; font-size: 17px; font-weight: 700;border:1px !important;z-index:11000;height:25px !important;width:25px !important;margin:0 !important;padding:0 !important;";
  vpautInnerDivElement.appendChild(crossAdElem);

  let TimerCloseTimerVidVpaut = null;
  TimerCloseTimerVidVpaut = setTimeout(function runtimer() {
    timerOtcheta--;
    if (timerOtcheta >= 0) {
      crossAdElem.textContent = timerOtcheta;
      TimerCloseTimerVidVpaut = setTimeout(runtimer, 1000);
    } else {
      let crossBase = document.getElementById("cross_vid_vpaut");
      crossBase.style.opacity = 1;
      crossBase.style.pointerEvents = "none";
      clickEnableVpautCrossAfterAdv();
      clickerad = 1;
      document.getElementById("timer_vid_vpaut").remove();
      clearTimeout(TimerCloseTimerVidVpaut);
      TimerCloseTimerVidVpaut = null;
    }
  }, 1000);
}

function createCrossVidVpaut() {
  let crossAdElem = document.createElement("img");
  crossAdElem.id = "cross_vid_vpaut";
  crossAdElem.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0RDNDhFODA5MkNEMTFGMDk0QzFDRURENzExMTg2OUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0RDNDhFODE5MkNEMTFGMDk0QzFDRURENzExMTg2OUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3REM0OEU3RTkyQ0QxMUYwOTRDMUNFREQ3MTExODY5RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3REM0OEU3RjkyQ0QxMUYwOTRDMUNFREQ3MTExODY5RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk8Mbb0AAAReSURBVHjanBbfS1tX+NybH9ebROmDSM3EuaxrnBXdimlgDOnqDPgyxphzWHxZH+YsgxnoHoZaVKzo37D2oa7gj60oguJWGT5OVkbWIVq3vNQfEZ9Gfpj05n5n33dyr+baJLb74Ms5N+f7cb7fR2J5IMsyszscjNMHF78Swke4fizJcjOuNYgq4hHiLgeI4LqAlAtIDxJxIL+eyTA9m2UFgZQ4FYU5EHH9SnW7/3U4naStKNI50sVx/RqROd1uZrPbLXKlApZ4kejnbDZ7ScMbEVRWVfG2tjZW7/ezco+HxRMJtvX0Kft1dZUdHBzkDEAFyLcJkhRCS54VtcRms73rKS9P2+12cUt/QwPMz8+DruvAT8DcA8HC4iJcamwEokcl3HPunIZroKAC9L3P5fEk0BqhYOj2bcgTeBbA6OioUISx4ygnjXIuHgvHW5MFrMzl+s1mWHD33r2XFW6B+1NTxxa5XK7HJJtQ+FJR1TAqEQoGBwd1fuIPjq4qKTidTgPG7/h7ZGREJzkKylMU5Vsnymd2p9NR5nY/o4N3Ll/W8120vLwMgUAAtre3C1q2s7cHtbW1MDExYYlZS0uLUIRZt4dGlJElnU4jTX948MAi7PPubkFcU1MDh4eHlrNEIgF+v1+454Nr1yyXm5ubAzO9Ea8zp6p+T394vV6Ix+MWQZQ9rVevCoaq8+dhf39fnKdSKWg0MupKMAhZa/YJF9bV1YlzDMV9hn77nT4+7ezUi2QTtIdCguHNCxfgn2gUOjo6wHAvaJpWkKe7u1vQYFH/QUGP0cfAwECpjILrPT2QX+kftrcDWVSMYXBoyLTkQDZ6EcMiZCVAGh8bo/znxjcP9/dzVVWlYgxubC8GlMlGs2NJbBUlgPfevCmlEgnJSBLps64uaWNjgxdjSCWT5jYtM4Bd2m1ubTHDFS8oCIVCbGlxUaqvr+fJVIp9Ew7zRDwuNTU3sz+fPCnI83c0mtsA7FO3vUv71zBNk8nkaR8fB7m6ujo/jeGLGzfE/7LNBmtraxa+TCYDb/h8ZkymGJrfZbbz6elpC3E4HBZ1UllZCbFY7IULfNnbK859Pp8lM398+FDPq5MenDEOBSueXMZbAgELcSQSgfdbW2F9fb1YFkFfX58+OztrqfhgMGhWfAzlu0gJueyW2buGh4f1UwX5Sk1yfHxcN9zEHar6nZ16F3VgOyJqfWx24Snspv+nC8/MzOS6sM1GVkRoQsrUhXGOmFPxItbBkWTMk7E7d15pnkxOTubmiSRRPWmoqIEmLeHpyXjFXVGRNSdjU1MTLC0tlVIGKysrQO3FnCPlFRW0vnfWjH8diX7Jatpb2vPn4v9qr5faCHsbZ7wHZzx2YLaJM3710SO2u7NzMuMdjigqbse3QRRn9hmvFXp1KEo/+jWJifEyr5UjfOHcMgagiHNJS/A25ptLTGcM2idS7t3VSEZRL6JWgRjD1PtLvLs4/wlXTcjAQGfp3ZVnyX8CDADxHJ5rvLfg1AAAAABJRU5ErkJggg==";
  crossAdElem.style =
    "position:absolute;top:36px !important;right:16px !important;border:1px !important;opacity:0;z-index:11000;cursor:pointer;height:28px !important;width:28px !important;margin:0 !important;padding:0 !important;pointer-events:none;";
  vpautInnerDivElement.appendChild(crossAdElem);
  if (crossAdElem.addEventListener) {
    crossAdElem.addEventListener("click", clickOnCrossAdEl);
  } else {
    crossAdElem.attachEvent("onclick", clickOnCrossAdEl);
  }
  if (parseInt(vpautOption.timer_krestik) <= 0) {
    try {
      let closeTimerOpEvKr = (parseInt(vpautOption.timer_closed) + 1) * 1000;
      let timerCloseKrestikVidVpaut = null;
      timerCloseKrestikVidVpaut = setTimeout(function () {
        crossAdElem.style.opacity = 1;
        crossAdElem.style.pointerEvents = "none";
        clickEnableVpautCrossAfterAdv();
        clickerad = 1;
        clearTimeout(timerCloseKrestikVidVpaut);
        timerCloseKrestikVidVpaut = null;
      }, closeTimerOpEvKr);
    } catch (e) {}
  }
}

function clickOnCrossAdEl() {
  if (clickerad) {
    try {
      if (parseInt(vpautOption.closed_by_krestic) <= 0) {
        changeCross = 0;
        vpautInnerDivElement.style.opacity = 0;
        vpautInnerDivElement.style.pointerEvents = "none";
      } else {
        if (!fclc) {
          fclc = 1;
        } else {
          vpautInnerDivElement.remove();
          vpautDivElement.style.width = 0;
          vpautDivElement.style.height = 0;
          openVpaut = 0;
          changeCross = 0;
          try {
            window.postMessage("end_rekl", "*");
          } catch (e) {}
          console.info("Vid end click");
        }
      }
    } catch (e) {}
  }
}

function createCircleTimerVid() {
  let timer = document.createElement("div");
  timer.id = "vid_circle_timer";
  timer.style.cssText =
    "--deg: -1;--col: hsla(270, 100%, 70%, 1);z-index:11000;position:absolute;top:35px !important;right:15px !important;pointer-events:none; height: 30px; width: 30px;border-radius: 50%;text-align: center; background-image: radial-gradient(#000 10px, #f000 12px), conic-gradient(var(--col) calc(var(--deg) * 1deg - 1deg), transparent calc(var(--deg) * 1deg + 1deg)), radial-gradient(#fff3 40px, #4441 60px); box-shadow: inset 0 0 10px -5px #000a;";
  vpautInnerDivElement.appendChild(timer);
  let oCount = timer;
  let closeTimerOpEvKr = parseInt(vpautOption.timer_closed) - 1;
  oCount.parentEl = vpautInnerDivElement;
  oCount.countValue = closeTimerOpEvKr;
  oCount.countRatio = 360 / oCount.countValue;
  oCount.countColor = 275;
  oCount.countLight = oCount.countValue / 20;
  oCount.countTimer = setInterval(fCountdown.bind(oCount), 1000);
}

function fCountdown() {
  let nCount = this.countValue;
  if (nCount > 0) {
    nCount--;
    this.countValue = nCount;
    this.style.setProperty("--deg", 361 - nCount * this.countRatio);
    this.style.setProperty("--col", `hsla(${this.countColor}, 100%, 65%, 1)`);
  } else {
    clearInterval(this.countTimer);
    this.parentEl.removeChild(document.getElementById("vid_circle_timer"));
    try {
      let krestikBase = document.getElementById("cross_vid_vpaut");
      krestikBase.style.opacity = 1;
      krestikBase.style.pointerEvents = "none";
      clickEnableVpautCrossAfterAdv();
      clickerad = 1;
    } catch (e) {}
  }
}

function createCrossAdv(flagOc) {
  if (document.getElementById("cross_vid_vpaut_advert")) {
    document.getElementById("cross_vid_vpaut_advert").remove();
  }
  if (document.getElementById("cross_vid_vpaut_advert2")) {
    document.getElementById("cross_vid_vpaut_advert2").remove();
  }
  if (flagOc) {
    let crossAdvElem = document.createElement("img");
    crossAdvElem.id = "cross_vid_vpaut_advert";
    crossAdvElem.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0RDNDhFODA5MkNEMTFGMDk0QzFDRURENzExMTg2OUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0RDNDhFODE5MkNEMTFGMDk0QzFDRURENzExMTg2OUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3REM0OEU3RTkyQ0QxMUYwOTRDMUNFREQ3MTExODY5RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3REM0OEU3RjkyQ0QxMUYwOTRDMUNFREQ3MTExODY5RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk8Mbb0AAAReSURBVHjanBbfS1tX+NybH9ebROmDSM3EuaxrnBXdimlgDOnqDPgyxphzWHxZH+YsgxnoHoZaVKzo37D2oa7gj60oguJWGT5OVkbWIVq3vNQfEZ9Gfpj05n5n33dyr+baJLb74Ms5N+f7cb7fR2J5IMsyszscjNMHF78Swke4fizJcjOuNYgq4hHiLgeI4LqAlAtIDxJxIL+eyTA9m2UFgZQ4FYU5EHH9SnW7/3U4naStKNI50sVx/RqROd1uZrPbLXKlApZ4kejnbDZ7ScMbEVRWVfG2tjZW7/ezco+HxRMJtvX0Kft1dZUdHBzkDEAFyLcJkhRCS54VtcRms73rKS9P2+12cUt/QwPMz8+DruvAT8DcA8HC4iJcamwEokcl3HPunIZroKAC9L3P5fEk0BqhYOj2bcgTeBbA6OioUISx4ygnjXIuHgvHW5MFrMzl+s1mWHD33r2XFW6B+1NTxxa5XK7HJJtQ+FJR1TAqEQoGBwd1fuIPjq4qKTidTgPG7/h7ZGREJzkKylMU5Vsnymd2p9NR5nY/o4N3Ll/W8120vLwMgUAAtre3C1q2s7cHtbW1MDExYYlZS0uLUIRZt4dGlJElnU4jTX948MAi7PPubkFcU1MDh4eHlrNEIgF+v1+454Nr1yyXm5ubAzO9Ea8zp6p+T394vV6Ix+MWQZQ9rVevCoaq8+dhf39fnKdSKWg0MupKMAhZa/YJF9bV1YlzDMV9hn77nT4+7ezUi2QTtIdCguHNCxfgn2gUOjo6wHAvaJpWkKe7u1vQYFH/QUGP0cfAwECpjILrPT2QX+kftrcDWVSMYXBoyLTkQDZ6EcMiZCVAGh8bo/znxjcP9/dzVVWlYgxubC8GlMlGs2NJbBUlgPfevCmlEgnJSBLps64uaWNjgxdjSCWT5jYtM4Bd2m1ubTHDFS8oCIVCbGlxUaqvr+fJVIp9Ew7zRDwuNTU3sz+fPCnI83c0mtsA7FO3vUv71zBNk8nkaR8fB7m6ujo/jeGLGzfE/7LNBmtraxa+TCYDb/h8ZkymGJrfZbbz6elpC3E4HBZ1UllZCbFY7IULfNnbK859Pp8lM398+FDPq5MenDEOBSueXMZbAgELcSQSgfdbW2F9fb1YFkFfX58+OztrqfhgMGhWfAzlu0gJueyW2buGh4f1UwX5Sk1yfHxcN9zEHar6nZ16F3VgOyJqfWx24Snspv+nC8/MzOS6sM1GVkRoQsrUhXGOmFPxItbBkWTMk7E7d15pnkxOTubmiSRRPWmoqIEmLeHpyXjFXVGRNSdjU1MTLC0tlVIGKysrQO3FnCPlFRW0vnfWjH8diX7Jatpb2vPn4v9qr5faCHsbZ7wHZzx2YLaJM3710SO2u7NzMuMdjigqbse3QRRn9hmvFXp1KEo/+jWJifEyr5UjfOHcMgagiHNJS/A25ptLTGcM2idS7t3VSEZRL6JWgRjD1PtLvLs4/wlXTcjAQGfp3ZVnyX8CDADxHJ5rvLfg1AAAAABJRU5ErkJggg==";
    crossAdvElem.style =
      "position:absolute;top:36px !important;right:16px !important;border:1px !important;opacity:0.7;pointer-events: none;z-index:11000;cursor:pointer;height:28px !important;width:28px !important;margin:0 !important;padding:0 !important;";
    vpautInnerDivElement.appendChild(crossAdvElem);

    let crossAdvElem2 = document.createElement("img");
    crossAdvElem2.id = "cross_vid_vpaut_advert2";
    crossAdvElem2.src =
      "data:image/png;base64,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";
    crossAdvElem2.style =
      "position:absolute;top:36px !important;left:16px !important;border:1px !important;opacity:0.7;pointer-events: none;z-index:11000;cursor:pointer;height:28px !important;width:28px !important;margin:0 !important;padding:0 !important;";
    vpautInnerDivElement.appendChild(crossAdvElem2);
  }
}

function isEstablishedConnectionVpaut() {
  try {
    clearTimeout(isEstablishedConnectionVpautTimeout);
  } catch (e) {}
  isEstablishedConnectionVpautTimeout = null;
  isEstablishedConnectionVpautTimeout = setTimeout(function () {
    console.info("Больше 15 секунд");
    if (parseInt(vpautOption.mob) < 1) {
      overloadHref();
    } else {
      overloadHrefMobile();
    }
    console.info("end VPAID");
  }, 15000);
}

function vidVpautListen(e) {
  switch (e.data) {
    case "halo": {
      if (parseInt(vpautOption.mob) < 1) {
        adHalo = 1;
        vidVpautVisabilityCheck();
        console.info("vast_halo VPAID");
      }
      break;
    }
    case "endhalo": {
      if (parseInt(vpautOption.mob) < 1) {
        adHalo = 0;
        vidVpautVisabilityCheck();
        console.info("vast_nothalo VPAID");
      }
      break;
    }
    case "impression": {
      if (parseInt(vpautOption.mob) < 1) {
        if (!changeCross) {
          vpautInnerDivElement.style.opacity = 1;
          vpautInnerDivElement.style.pointerEvents = "auto";
          changeCross = 1;
          let krestikOv = document.getElementById("cross_vid_vpaut");
          krestikOv.style.opacity = 1;
          krestikOv.style.pointerEvents = "none";
          clickEnableVpautCrossAfterAdv();
          vidVpautVisabilityCheck();
        }
        createCrossAdv(true);
        hadMobAdv = 1;
        if (
          parseInt(vpautOption.scroll_to_player) > 0 &&
          parseInt(vpautOption.flyroll_player) <= 0 &&
          !firstScroll
        ) {
          try {
            let a = getCoords(vpautPlayer);
            window.scrollTo(a.left, a.top);
            firstScroll++;
          } catch (e) {}
        }
      } else {
        try {
          closePrerollBanner();
        } catch (e) {
          console.info("banner don't exists");
        }

        if (parseInt(vpautOption.mob_static) < 1) {
          vpautInnerDivElement.style.height = 250 + "px";
          vpautInnerDivElement.style.opacity = 1;
          vpautInnerDivElement.style.pointerEvents = "auto";
          if (checkMobAdv < 1) {
            checkMobAdv++;
            // ShowKrestic();
            let crossMobShow = null;
            crossMobShow = setTimeout(() => {
              ShowKrestic();
              clearTimeout(crossMobShow);
              crossMobShow = null;
            }, 5000);
            //setTimeout(ShowKrestic, 5000);
          } else {
            let krestikOv = document.getElementById("cross_vid_vpaut");
            krestikOv.style.opacity = 1;
            krestikOv.style.pointerEvents = "none";
            clickEnableMobileVpautCrossAfterAdv();
          }
        }
      }
      firstAd = 1;
      break;
    }
    case "thirdQuartile": {
      createCrossAdv(false);
      break;
    }
    case "complete": {
      console.info("vast_complete VPAID");

      if (parseInt(vpautOption.mob) > 0) {
        if (hadMobAdv < 1) {
          if (parseInt(vpautOption.mob_static) < 1) {
            vpautInnerDivElement.style.height = 250 + "px";
            vpautInnerDivElement.style.opacity = 0.01;
            vpautInnerDivElement.style.pointerEvents = "none";
          }
        }
      }
      break;
    }
    case "content": {
      if (parseInt(vpautOption.mob) < 1) {
        overloadHref();
      } else {
        overloadHrefMobile();
      }
      console.info("end VPAID");
      break;
    }
    case "connection_established_vpaut": {
      isEstablishedConnectionVpaut();
    }
  }
}

//Scroll handler
function vidVpautVisabilityCheck() {
  if (openVpaut && parseInt(vpautOption.mob) < 1) {
    let topD = window.pageYOffset;
    let bottomD = topD + window.innerHeight;
    let triggerY = startTopEl + ((startBotEl - startTopEl) * 52) / 100;
    if (widthRoll < 480) {
      widthRoll = 480;
    }
    if (heightRoll < 300) {
      heightRoll = 300;
    }
    if (
      triggerY > topD &&
      triggerY < bottomD &&
      parseInt(vpautOption.only_fly) <= 0
    ) {
      vpautInnerDivElement.style.position = "relative";
      vpautInnerDivElement.style.top = 0;
      vpautInnerDivElement.style.left = 0;
      if (advOvers && widthEl < 500 && measureWl === "px") {
        if (measureWl === "px") {
          vpautInnerDivElement.style.width = "500px";
        }
      } else {
        if (measureWl === "px") {
          vpautInnerDivElement.style.width = widthEl + "px";
        } else if (measureWl === "%") {
          vpautInnerDivElement.style.width = widthEl + "%";
        }
      }
      if (measureHl == "px") {
        vpautInnerDivElement.style.height = heightEl + "px";
      } else if (measureHl == "%") {
        vpautInnerDivElement.style.height = heightEl + "%";
      }
      if (!changeCross) {
        let krestikOv = document.getElementById("cross_vid_vpaut");
        vpautInnerDivElement.style.opacity = 1;
        vpautInnerDivElement.style.pointerEvents = "auto";
        krestikOv.style.opacity = 0;
        krestikOv.style.pointerEvents = "none";
      }
    } else {
      if (!changeCross) {
        vpautInnerDivElement.style.opacity = 0;
        vpautInnerDivElement.style.pointerEvents = "none";
        let krestikOv = document.getElementById("cross_vid_vpaut");
        krestikOv.style.opacity = 1;
        krestikOv.style.pointerEvents = "auto";
      }
      let leftElRect;
      vpautInnerDivElement.style.position = "fixed";
      if (
        vpautDivElement.hasAttribute("vid_el_top") &&
        parseInt(vpautDivElement.getAttribute("vid_el_top")) > 0
      ) {
        vpautInnerDivElement.style.top = 0;
      } else {
        if (
          vpautDivElement.hasAttribute("vid_el_locate_top") &&
          parseInt(vpautDivElement.getAttribute("vid_el_locate_top")) > 0
        ) {
          if (!document.doctype) {
            vpautInnerDivElement.style.top =
              parseInt(document.body.clientHeight) -
              parseInt(heightRoll) -
              parseInt(vpautDivElement.getAttribute("vid_el_locate_top")) +
              "px";
          } else {
            vpautInnerDivElement.style.top =
              parseInt(document.documentElement.clientHeight) -
              parseInt(heightRoll) -
              parseInt(vpautDivElement.getAttribute("vid_el_locate_top")) +
              "px";
          }
        } else {
          if (!document.doctype) {
            vpautInnerDivElement.style.top =
              parseInt(document.body.clientHeight) -
              parseInt(heightRoll) +
              "px";
          } else {
            vpautInnerDivElement.style.top =
              parseInt(document.documentElement.clientHeight) -
              parseInt(heightRoll) +
              "px";
          }
        }
      }
      if (
        vpautDivElement.hasAttribute("vid_el_locate") &&
        parseInt(vpautDivElement.getAttribute("vid_el_locate")) > 0
      ) {
        vpautInnerDivElement.style.left = "0px";
      } else if (
        vpautDivElement.hasAttribute("vid_el_center") &&
        parseInt(vpautDivElement.getAttribute("vid_el_center")) > 0
      ) {
        if (advOvers && widthRoll < 500) {
          vpautInnerDivElement.style.left =
            parseInt(document.documentElement.clientWidth) / 2 - 300 + "px";
        } else {
          vpautInnerDivElement.style.left =
            parseInt(document.documentElement.clientWidth) / 2 -
            parseInt(widthRoll) / 2 +
            "px";
        }
      } else {
        if (advOvers && widthRoll < 500) {
          vpautInnerDivElement.style.left =
            parseInt(document.documentElement.clientWidth) - 500 + "px";
        } else {
          vpautInnerDivElement.style.left =
            parseInt(document.documentElement.clientWidth) -
            parseInt(widthRoll) +
            "px";
        }
      }
      if (vpautDivElement.hasAttribute("vid_el_targent")) {
        if (
          document.getElementById(
            vpautDivElement.getAttribute("vid_el_targent")
          )
        ) {
          leftElRect = parseInt(
            document
              .getElementById(vpautDivElement.getAttribute("vid_el_targent"))
              .getBoundingClientRect().left
          );
          vpautInnerDivElement.style.left = leftElRect + "px";
        } else {
          if (advOvers && widthRoll < 500) {
            leftElRect =
              parseInt(
                document
                  .getElementsByClassName(
                    vpautDivElement.getAttribute("vid_el_targent")
                  )[0]
                  .getBoundingClientRect().left
              ) + 300;
          } else {
            leftElRect =
              parseInt(
                document
                  .getElementsByClassName(
                    vpautDivElement.getAttribute("vid_el_targent")
                  )[0]
                  .getBoundingClientRect().left
              ) + parseInt(widthRoll / 2);
            vpautInnerDivElement.style.left = leftElRect + "px";
          }
        }
      }
      if (vpautDivElement.hasAttribute("vid_el_targent_r")) {
        if (
          document.getElementById(
            vpautDivElement.getAttribute("vid_el_targent_r")
          )
        ) {
          if (advOvers && widthRoll < 500) {
            leftElRect =
              parseInt(
                document
                  .getElementById(
                    vpautDivElement.getAttribute("vid_el_targent_r")
                  )
                  .getBoundingClientRect().left
              ) - 500;
          } else {
            leftElRect =
              parseInt(
                document
                  .getElementById(
                    vpautDivElement.getAttribute("vid_el_targent_r")
                  )
                  .getBoundingClientRect().left
              ) - parseInt(widthRoll);
            vpautInnerDivElement.style.left = leftElRect + "px";
          }
        } else {
          if (advOvers && widthRoll < 500) {
            leftElRect =
              parseInt(
                document
                  .getElementsByClassName(
                    vpautDivElement.getAttribute("vid_el_targent_r")
                  )[0]
                  .getBoundingClientRect().left
              ) - 500;
          } else {
            leftElRect =
              parseInt(
                document
                  .getElementsByClassName(
                    vpautDivElement.getAttribute("vid_el_targent_r")
                  )[0]
                  .getBoundingClientRect().left
              ) - parseInt(widthRoll);
          }
          vpautInnerDivElement.style.left = leftElRect + "px";
        }
      }
      if (vpautDivElement.hasAttribute("vid_el_right_targent")) {
        if (
          document.getElementById(
            vpautDivElement.getAttribute("vid_el_right_targent")
          )
        ) {
          leftElRect = parseInt(
            document
              .getElementById(
                vpautDivElement.getAttribute("vid_el_right_targent")
              )
              .getBoundingClientRect().right
          );
          vpautInnerDivElement.style.left = leftElRect + "px";
        } else {
          leftElRect = parseInt(
            document
              .getElementsByClassName(
                vpautDivElement.getAttribute("vid_el_right_targent")
              )[0]
              .getBoundingClientRect().right
          );
          vpautInnerDivElement.style.left = leftElRect + "px";
        }
      }
      if (vpautDivElement.hasAttribute("vid_el_right_targent_r")) {
        if (
          document.getElementById(
            vpautDivElement.getAttribute("vid_el_right_targent_r")
          )
        ) {
          if (advOvers && widthRoll < 500) {
            leftElRect =
              parseInt(
                document
                  .getElementById(
                    vpautDivElement.getAttribute("vid_el_right_targent_r")
                  )
                  .getBoundingClientRect().right
              ) - 500;
          } else {
            leftElRect =
              parseInt(
                document
                  .getElementById(
                    vpautDivElement.getAttribute("vid_el_right_targent_r")
                  )
                  .getBoundingClientRect().right
              ) - parseInt(widthRoll);
            vpautInnerDivElement.style.left = leftElRect + "px";
          }
        } else {
          if (advOvers && widthRoll < 500) {
            leftElRect =
              parseInt(
                document
                  .getElementsByClassName(
                    vpautDivElement.getAttribute("vid_el_right_targent_r")
                  )[0]
                  .getBoundingClientRect().right
              ) - 500;
          } else {
            leftElRect =
              parseInt(
                document
                  .getElementsByClassName(
                    vpautDivElement.getAttribute("vid_el_right_targent_r")
                  )[0]
                  .getBoundingClientRect().right
              ) - parseInt(widthRoll);
            vpautInnerDivElement.style.left = leftElRect + "px";
          }
        }
      }
      if (
        vpautDivElement.hasAttribute("vid_mrg_l") &&
        parseInt(vpautDivElement.getAttribute("vid_mrg_l")) > 0
      ) {
        vpautInnerDivElement.style.left =
          parseInt(vpautInnerDivElement.style.left) +
          parseInt(vpautDivElement.getAttribute("vid_mrg_l")) +
          "px";
      }
      if (
        vpautDivElement.hasAttribute("vid_mrg_r") &&
        parseInt(vpautDivElement.getAttribute("vid_mrg_r")) > 0
      ) {
        vpautInnerDivElement.style.left =
          parseInt(vpautInnerDivElement.style.left) -
          parseInt(vpautDivElement.getAttribute("vid_mrg_r")) +
          "px";
      }
      if (
        vpautDivElement.hasAttribute("vid_mrg_t") &&
        parseInt(vpautDivElement.getAttribute("vid_mrg_t")) > 0
      ) {
        vpautInnerDivElement.style.top =
          parseInt(vpautInnerDivElement.style.top) +
          parseInt(vpautDivElement.getAttribute("vid_mrg_t")) +
          "px";
      }
      if (
        vpautDivElement.hasAttribute("vid_mrg_b") &&
        parseInt(vpautDivElement.getAttribute("vid_mrg_b")) > 0
      ) {
        vpautInnerDivElement.style.top =
          parseInt(vpautInnerDivElement.style.top) -
          parseInt(vpautDivElement.getAttribute("vid_mrg_b")) +
          "px";
      }
      if (advOvers && widthRoll < 500) {
        vpautInnerDivElement.style.width = 500 + "px";
      } else {
        vpautInnerDivElement.style.width = widthRoll + "px";
      }
      vpautInnerDivElement.style.height = heightRoll + "px";
      vpautInnerDivElement.style.zIndex = 1001;
      if (parseInt(vpautOption.only_fly) > 0) {
        vpautDivElement.style.width = 0 + "px";
        vpautDivElement.style.height = 0 + "px";
      }
    }
  }
}

//Overload desktop
function overloadHref() {
  removePlayer();
  if (vpautCountAd < vpautOption.paths_option.path.length) {
    if (!lockOverload) {
      lockOverload = true;
      //removePlayer();
      vpautCountAd++;
      firstAd = 0;
      setTimeout(function () {
        createVpautPlayer();
        //runPlayer();
        advOvers = 0;
        vidVpautVisabilityCheck();
        lockOverload = false;
      }, 550);
    }
  } else {
    if (endless > 0) {
      if (!lockOverload) {
        lockOverload = true;
        if (vpautOption.paths_option.path.length <= 0) {
          vpautInnerDivElement.remove();
          vpautDivElement.style.width = 0 + "px";
          vpautDivElement.style.height = 0 + "px";
          openVpaut = 0;
          window.postMessage("end_rekl", "*");
          console.info("Vid vpaut end adverts");
          lockOverload = false;
          return false;
        }
        console.info("This endless round = " + endless);
        endless--;
        //removePlayer();
        vpautCountAd = 0;
        firstAd = 0;
        if (
          parseInt(vpautOption.mob) > 0 &&
          parseInt(vpautOption.mob_static) <= 0
        ) {
          createVpautBanner();
          setTimeout(createVpautPlayer, 15000);
          //setTimeout(runPlayer, 15000);
        } else {
          setTimeout(function () {
            createVpautPlayer();
            //runPlayer();
            advOvers = 0;
            vidVpautVisabilityCheck();
          }, 550);
        }
        lockOverload = false;
      }
    } else {
      vpautInnerDivElement.remove();
      vpautDivElement.style.width = 0 + "px";
      vpautDivElement.style.height = 0 + "px";
      openVpaut = 0;
      window.postMessage("end_rekl", "*");
      console.info("Vid vpaut end adverts");
      return false;
    }
  }
}

//Overload mobile
function overloadHrefMobile() {
  removePlayer();
  if (parseInt(vpautOption.mob_static) <= 0) {
    if (!hadMobAdv) {
      vpautInnerDivElement.style.height = 250 + "px";
      vpautInnerDivElement.style.opacity = 0.01;
      vpautInnerDivElement.style.pointerEvents = "none";
    } else {
      vpautInnerDivElement.style.height = 250 + "px";
      vpautInnerDivElement.style.opacity = 1;
      vpautInnerDivElement.style.pointerEvents = "auto";
    }
  }
  hadMobAdv = 0;
  if (vpautCountAd < vpautOption.paths_option.path.length) {
    if (!lockOverload) {
      lockOverload = true;
      //removePlayer();
      vpautCountAd++;
      firstAd = 0;
      setTimeout(function () {
        createVpautPlayer();
        //runPlayer();
        advOvers = 0;
        vidVpautVisabilityCheck();
        lockOverload = false;
      }, 550);
    }
  } else {
    if (endlessMobile > 0) {
      if (!lockOverload) {
        lockOverload = true;
        exceptionAdList();
        if (vpautOption.paths_option.path.length <= 0) {
          lockOverload = false;
          return false;
        }
        vpautCountAd = 0;
        endlessMobile--;
        //removePlayer();
        vpautCountAd = 0;
        firstAd = 0;
        if (
          parseInt(vpautOption.mob) > 0 &&
          parseInt(vpautOption.mob_static) <= 0
        ) {
          try {
            createVpautPrerollBanner();
          } catch (error) {
            console.error(error);
          }
          setTimeout(createVpautPlayer, 15000);
          //setTimeout(runPlayer, 15000);
        } else {
          setTimeout(function () {
            createVpautPlayer();
            //runPlayer();
            /* advOvers = 0;
            vidVpautVisabilityCheck();
            lockOverload = false; */
          }, 550);
          //createVpautPlayer();
          //runPlayer();
        }
        lockOverload = false;
      }
    }
  }
}

//Event handler

//Remove Player
function removePlayer() {
  if (document.getElementById("videoroll_vpaut_iframe")) {
    document.getElementById("videoroll_vpaut_iframe").remove();
    vpautPlayer = null;
  }
}

//Run Player

//Create Player Funcs
function createVpautPlayer() {
  removePlayer();
  let frame = document.createElement("iframe");
  frame.id = "videoroll_vpaut_iframe";
  frame.src = "about:blank";
  frame.style.height = "100%";
  frame.style.width = "100%";
  frame.style.margin = "0";
  frame.allow = "autoplay; fullscreen;";
  frame.setAttribute("referrerpolicy", "unsafe-url");
  frame.setAttribute("scrolling", "no");
  frame.setAttribute("frameborder", "0");
  frame.setAttribute("marginheight", "0");
  frame.setAttribute("marginwidth", "0");
  frame.onerror = () => {
    console.log("Что-то пошло не так!");
  };
  vpautInnerDivElement.appendChild(frame);

  try {
    let hplayer = "";
    if (parseInt(vpautOption.mob) > 0) {
      hplayer = vpautOption.bplayer;
    } else {
      hplayer =
        vpautLeapFrog % 2 == 0 ? vpautOption.bplayer : vpautOption.secbplayer;
      vpautLeapFrog++;
    }
    //let hplayer = vpautOption.secbplayer;
    let doc = frame.contentDocument || frame.contentWindow.document;
    if (doc) {
      doc.open();
      doc.write(atob(hplayer));
      doc.close();
      doc = null;
      hplayer = "";
    }
  } catch (e) {
    console.error(e);
  }
}

try {
  //YaTeam
  let frmS =
    typeof window.location.ancestorOrigins != "undefined"
      ? window.location.ancestorOrigins
      : "";
  if (frmS) {
    for (let i = 0; i < frmS.length; i++) {
      if (
        frmS.item(i) == "https://yang.yandex-team.ru" ||
        frmS.item(i) == "http://yang.yandex-team.ru"
      ) {
        throw new Error("Access denied");
      }
    }
  }
  //TV && PS
  if (navigator.userAgent.search(/PlayStation/) > 0) {
    throw new Error("Not on PlayStation");
  }
  if (navigator.userAgent.search(/SmartTV/) > 0) {
    throw new Error("Not on TV");
  }
  if (navigator.userAgent.search(/Smart-TV/) > 0) {
    throw new Error("Not on TV");
  }
  if (navigator.userAgent.search(/Smart_TV/) > 0) {
    throw new Error("Not on TV");
  }
  //Div exist
  vpautDivElement = document.getElementById("vid_vpaut_div");
  vpautDivElement.style.zIndex = 2147483647;
  if (!vpautDivElement) throw new Error("Vpaut div not exist");
  //SiteId exist
  vpautSiteId =
    vpautDivElement.hasAttribute("vid_vpaut_pl") &&
    parseInt(vpautDivElement.getAttribute("vid_vpaut_pl")) > 0
      ? parseInt(vpautDivElement.getAttribute("vid_vpaut_pl"))
      : 0;
  if (!vpautSiteId) throw new Error("Site id not find");

  //Meta referer
  let metaRef = document.createElement("meta");
  metaRef.name = "referrer";
  metaRef.content = "no-referrer-when-downgrade";
  vpautDivElement.appendChild(metaRef);
  //Adriver frame
  let scriptSam = document.createElement("script");
  scriptSam.src = "https://content.adriver.ru/AdRiverFPS.js";
  vpautDivElement.appendChild(scriptSam);
  //DopStyle VIDEOHUB CDN
  // const dopstyle = document.createElement('style');
  // dopstyle.type = 'text/css';
  // let styles = `div[class*='-player-ad__sticky'] {z-index: 0 !important; } `;
  // dopstyle.appendChild(document.createTextNode(styles));
  // document.head.appendChild(dopstyle);

  //Player scripts
  fetch("https://videoroll.net/vpaut_option_get.php?pl_id=" + vpautSiteId)
    .then((response) => response.json())
    .then((option) => {
      if (isEmptyObject(option)) throw new Error("Don't find site option");
      //Get Vpaut Options
      vpautOption = option;
      numberImp = vpautOption.paths_option.number_impression;
      console.info("comp length begin " + vpautOption.paths_option.path.length);
      //Is blocked
      if (parseInt(vpautOption.blocked) > 0) {
        vpautDivElement.style.width = 0 + "px";
        vpautDivElement.style.height = 0 + "px";
        window.postMessage("end_rekl", "*");
        throw new Error("Site blocked");
      }
      //Company exist
      if (
        !vpautOption.paths_option.path.length &&
        parseInt(vpautOption.mob) <= 0
      ) {
        throw new Error("Empty company list");
      }
      //Preroll Banner mobile
      if (
        parseInt(vpautOption.mob) > 0 &&
        parseInt(vpautOption.mob_static) <= 0
      ) {
        try {
          createVpautPrerollBanner();
        } catch (error) {
          console.error(error);
        }
      }
      //Create flying div
      innerDiv = document.createElement("div");
      innerDiv.id = "tmp_div_vid_vpaut";
      innerDiv.style.zIndex = 98999;
      //Mobile Params
      if (parseInt(vpautOption.mob) > 0) {
        if (parseInt(vpautOption.mob_static) <= 0) {
          widthEl = "98%";
          heightEl = 250 + "px";
          innerDiv.style.opacity = 0.01;
          innerDiv.style.pointerEvents = "none";
          vpautDivElement.style.width = 0 + "px";
          vpautDivElement.style.height = 0 + "px";
          innerDiv.style.width = widthEl;
          innerDiv.style.height = heightEl;
          innerDiv.style.position = "fixed";
          innerDiv.style.bottom = 0;
          innerDiv.style.left = "1%";
        } else {
          //Mobile Static Params
          widthEl = "98%";
          heightEl = "100%";
          innerDiv.style.width = widthEl;
          innerDiv.style.height = heightEl;
        }
      } else {
        //Desktop params
        measureWl =
          vpautDivElement.style.width &&
          vpautDivElement.style.width.indexOf("%") + 1
            ? "%"
            : "px";
        measureHl =
          vpautDivElement.style.height &&
          vpautDivElement.style.height.indexOf("%") + 1
            ? "%"
            : "px";
        if (measureWl == "px") {
          widthEl =
            vpautDivElement.style.width &&
            parseInt(vpautDivElement.style.width) >= 480
              ? parseInt(vpautDivElement.style.width)
              : 480;
        } else if (measureWl == "%") {
          widthEl =
            vpautDivElement.style.width &&
            parseInt(vpautDivElement.style.width) > 20
              ? parseInt(vpautDivElement.style.width)
              : 100;
        }
        if (measureHl == "px") {
          heightEl =
            vpautDivElement.style.height &&
            parseInt(vpautDivElement.style.height) >= 300
              ? parseInt(vpautDivElement.style.height)
              : 300;
        } else if (measureHl == "%") {
          heightEl =
            vpautDivElement.style.height &&
            parseInt(vpautDivElement.style.height) > 20
              ? parseInt(vpautDivElement.style.height)
              : 100;
        }
        widthRoll =
          vpautDivElement.hasAttribute("vid_roll_width") &&
          parseInt(vpautDivElement.getAttribute("vid_roll_width")) > 480
            ? parseInt(vpautDivElement.getAttribute("vid_roll_width"))
            : 480;
        heightRoll =
          vpautDivElement.hasAttribute("vid_roll_height") &&
          parseInt(vpautDivElement.getAttribute("vid_roll_height")) > 300
            ? parseInt(vpautDivElement.getAttribute("vid_roll_height"))
            : 300;
        let topD = window.pageYOffset;
        startTopEl = vpautDivElement.getBoundingClientRect().top + topD;
        startBotEl = vpautDivElement.getBoundingClientRect().bottom + topD;
        if (measureWl == "px") {
          innerDiv.style.width = widthEl + "px";
        } else if (measureWl == "%") {
          innerDiv.style.width = widthEl + "%";
        }
        if (measureHl == "px") {
          innerDiv.style.height = heightEl + "px";
        } else if (measureHl == "%") {
          innerDiv.style.height = heightEl + "%";
        }
        innerDiv.style.position = "relative";
      }
      vpautDivElement.appendChild(innerDiv);
    })
    .then(() => {
      //create player
      vpautInnerDivElement = document.getElementById("tmp_div_vid_vpaut");
      if (
        parseInt(vpautOption.mob) > 0 &&
        parseInt(vpautOption.mob_static) <= 0
      ) {
        setTimeout(createVpautPlayer, 5000);
      } else {
        createVpautPlayer();
      }
      //watch
      let watchD =
        "?sid=" +
        vpautSiteId +
        "&c=" +
        vpautOption.countryp +
        "&m=" +
        parseInt(vpautOption.mob);
      fetch("https://videoroll.net/watchmetric.php" + watchD, {
        method: "GET",
        mode: "cors",
      });
    })
    .then(() => {
      if (
        parseInt(vpautOption.timer_krestik) > 0 &&
        parseInt(vpautOption.mob) < 1
      ) {
        createTimerVidVpaut();
      }
      if (
        parseInt(vpautOption.fake_krestik) > 0 &&
        parseInt(vpautOption.mob) <= 0
      ) {
        createCrossVidVpaut();
      }
      if (parseInt(vpautOption.circle) > 0 && parseInt(vpautOption.mob) < 1) {
        createCircleTimerVid();
      }
      if (
        parseInt(vpautOption.flyroll_player) > 0 &&
        parseInt(vpautOption.mob) <= 0
      ) {
        openVpaut = 1;
        vidVpautVisabilityCheck();
      }
    })

    .catch((error) => {
      throw new Error(error);
    });

  if (window.addEventListener) {
    window.addEventListener("message", vidVpautListen);
    window.addEventListener("scroll", vidVpautVisabilityCheck);
  } else {
    window.attachEvent("onmessage", vidVpautListen);
    window.attachEvent("onscroll", vidVpautVisabilityCheck);
  }
} catch (e) {
  console.error("VIDEOROLL_VPAUT_ERROR: " + e);
}
