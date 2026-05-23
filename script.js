(function (global) {
  var DC = global.$dc = global.$dc || {};

  var CATEGORIES_URL = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var MENU_ITEMS_BASE_URL = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";

  var categories = [];

  DC.showHome = function () {
    DC.sendGetRequest(CATEGORIES_URL, buildAndShowHomeHTML);
  };

  function buildAndShowHomeHTML(categoriesData) {
    categories = categoriesData;
    var randomCategory = chooseRandomCategory(categories);

    DC.sendGetRequest("home-snippet.html", function (homeHTML) {
      homeHTML = homeHTML.replace("{{randomCategoryShortName}}", randomCategory.short_name);
      document.getElementById("main-content").innerHTML = homeHTML;
    }, false);
  }

  function chooseRandomCategory(cats) {
    var randomIndex = Math.floor(Math.random() * cats.length);
    return cats[randomIndex];
  }

  DC.loadMenuItems = function (shortName) {
    if (shortName === 'all') {
      DC.sendGetRequest(CATEGORIES_URL, function (cats) {
        categories = cats;
        showAllCategories(cats);
      });
    } else {
      if (categories.length === 0) {
        DC.sendGetRequest(CATEGORIES_URL, function (cats) {
          categories = cats;
          DC.sendGetRequest(MENU_ITEMS_BASE_URL + shortName + ".json", function (items) {
            showMenuItems(items, shortName);
          });
        });
      } else {
        DC.sendGetRequest(MENU_ITEMS_BASE_URL + shortName + ".json", function (items) {
          showMenuItems(items, shortName);
        });
      }
    }
  };

  function showAllCategories(cats) {
    var html = '<div class="row"><div class="col-md-3"><ul class="nav nav-pills nav-stacked" id="cat-list">';
    cats.forEach(function (cat) {
      html += '<li><a href="#" onclick="$dc.loadMenuItems(\'' + cat.short_name + '\'); return false;">' + cat.name + '</a></li>';
    });
    html += '</ul></div><div class="col-md-9"><div id="items-container" class="row"><p>Select a category.</p></div></div></div>';
    document.getElementById("main-content").innerHTML = html;
  }

  function showMenuItems(items, shortName) {
    var html = '<div class="row"><div class="col-md-3"><ul class="nav nav-pills nav-stacked" id="cat-list">';
    categories.forEach(function (cat) {
      var active = cat.short_name === shortName ? ' class="active"' : '';
      html += '<li' + active + '><a href="#" onclick="$dc.loadMenuItems(\'' + cat.short_name + '\'); return false;">' + cat.name + '</a></li>';
    });
    html += '</ul></div><div class="col-md-9"><div id="items-container" class="row">';
    if (!items || items.length === 0) {
      html += '<p>No items found.</p>';
    } else {
      items.forEach(function (item) {
        html += '<div class="col-sm-6 col-md-4"><div class="menu-item-tile">';
        html += '<h4>' + item.name + '</h4>';
        html += '<p>' + (item.description || '') + '</p>';
        html += '<p class="price">$' + (item.price_small || item.price_large || '') + '</p>';
        html += '</div></div>';
      });
    }
    html += '</div></div></div>';
    document.getElementById("main-content").innerHTML = html;
  }

  document.addEventListener("DOMContentLoaded", function () {
    DC.showHome();
  });

})(window);
