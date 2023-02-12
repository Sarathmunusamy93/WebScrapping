//content script
var clickedEl = null;

document.addEventListener(
  "contextmenu",
  function (event) {
    clickedEl = event.target;
  },
  true
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request == "getClickedEl") {
    var targetClasslist = clickedEl.classList;

    if (targetClasslist.length > 0) {
      var className = "";
      for (let index = 0; index < targetClasslist.length; index++) {
        className = className + "." + targetClasslist[index];
      }

      var item = $(className);

      for (let index = 0; index < item.length; index++) {
        console.log(item[index].src);
      }
    }
  }
  if (request == "getAllAmazonItems") {
    var allItemsContainer = "",
      shopingItemsList = {
        siteDetails: {
          siteName: "",
          searchText: "",
        },
        results: [],
      };

    if (window.location.origin.includes("amazon")) {
      allItemsContainer = $("div[data-component-type='s-search-result']");
      shopingItemsList.siteDetails.siteName = "Amazon";
      shopingItemsList.siteDetails.searchText = $("#twotabsearchtextbox").val();
    } else if (window.location.origin.includes("ebay")) {
      var allItemsContainer = $("li.s-item");
      shopingItemsList.siteDetails.siteName = "Ebay";
      shopingItemsList.siteDetails.searchText = $("#gh-ac").val();
    }

    if (allItemsContainer.length > 0) {
      for (let index = 0; index < allItemsContainer.length; index++) {
        var currentItemsContainer = allItemsContainer[index];

        var itemDetails = {
          itemName: "",
          itemImage: "",
          itemRatting: "",
          numberOfReview: "",
          itemPrice: "",
          deliveryDate: "",
          itemLink: "",
        };

        if (window.location.origin.includes("amazon")) {
          // Get Item Name logic.
          var itemNameClass = ".a-color-base.a-text-normal",
            itemPriceClass = ".a-price-whole",
            itemImageClass = ".s-image",
            itemDeliveryDateClass = ".a-color-base.a-text-bold",
            itemLinkClass =
              ".a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal";
        } else if (window.location.origin.includes("ebay")) {
          var itemNameClass = ".s-item__title span",
            itemPriceClass = ".s-item__price",
            itemImageClass = ".s-item__image-wrapper img",
            itemDeliveryDateClass = ".a-color-base.a-text-bold",
            itemLinkClass = ".s-item__link",
            itemRatting = "x-star-rating > .clipped";
        }
        (itemNameContainer = $(currentItemsContainer).find(itemNameClass)),
          (itemPriceContainer = $(currentItemsContainer).find(itemPriceClass)),
          (itemImageClassContainer = $(currentItemsContainer).find(
            itemImageClass
          )),
          (itemDeliveryDateClassContainer = $(currentItemsContainer).find(
            itemDeliveryDateClass
          ));

        itemDLinkClassContainer = $(currentItemsContainer).find(itemLinkClass);

        // itemDetails.itemSearchedFor = $("#twotabsearchtextbox").val();

        if (itemNameContainer.length > 0) {
          itemDetails.itemName = $(itemNameContainer).text();
        }

        if (itemPriceContainer.length > 0) {
          itemDetails.itemPrice = $(itemPriceContainer).text();
        }

        if (itemImageClassContainer.length > 0) {
          itemDetails.itemImage = $(itemImageClassContainer)[0].src;
        }

        if (itemDeliveryDateClassContainer.length > 0) {
          itemDetails.deliveryDate = $(itemDeliveryDateClassContainer).text();
        }

        if (itemDLinkClassContainer.length > 0) {
          itemDetails.itemLink = $(itemDLinkClassContainer)[0].href;
        }

        shopingItemsList.results.push(itemDetails);
      }
    }

    if ( shopingItemsList.results.length > 0) {
      sendResponse({ shopingItemsList });
    }
  }
});
