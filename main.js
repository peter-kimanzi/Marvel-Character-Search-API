function character() {
  let urlQueryParameters = new URLSearchParams(window.location.search),
    queryParameterName = urlQueryParameters.get("name"),
    name = document.getElementById("name").value;
  


  if (queryParameterName !== null && queryParameterName !== "") {
    document.getElementById("name").value = queryParameterName;
    connection();
  } else if (name !== null && name !== "") {
    document
      .getElementById("connectionForm")
      .addEventListener("submit", connection);
  } else {
    document.getElementById("characterSection").innerHTML =
      '<h2 id="characterMainTitle">Enter character name in search bar</h2>';
  }
}

function connection() {
  document.getElementById("characterSpinnerSection").innerHTML = "";
  document.getElementById("comicsSpinnerSection").innerHTML = "";

  const xhr = new XMLHttpRequest();
  const name = document.getElementById("name").value;
  const params = "name=" + name;

  xhr.open("GET", "./connections/name-search.php?" + params, true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); 
  xhr.onloadstart = function() {
    document.getElementById("characterSpinnerSection").innerHTML =
    '<strong id="spinnerText" class="text-primary">Loading character...</strong>' +
    '<div class="text-primary spinner-border ml-auto" role="status" ' +
    'aria-hidden="true" id="spinner"></div>';
  }
  xhr.onerror = function() {
    document.getElementById("characterSection").innerHTML = '<h2 id="characterMainTitle">An error has occured, check connection.</h2>';
  }
  xhr.onload = function() {
    if (this.status == 200) {
      const results = JSON.parse(this.responseText);

      if (results["data"].count === 0) {
        document.getElementById("characterSection").innerHTML =
          '<h2 id="characterMainTitle"><span style="font-weight:bold;">No results for... ' +
          name + "</span>" + ". Try again.</h2>";
        
        document.getElementById("characterSpinnerSection").innerHTML = "";
        document.getElementById("comicsSpinnerSection").innerHTML = "";
        
      } else if (results == undefined || results.length == 0) {
        document.getElementById("characterSection").innerHTML =
          '<h2 id="characterMainTitle">' +
          "An error might have occured on our end, Sorry. <br>In this case, try again later.</h2>";
        
        document.getElementById("characterSpinnerSection").innerHTML = "";
        document.getElementById("comicsSpinnerSection").innerHTML = "";
        
      } else {
        const characterAttributes = results["data"].results[0],
          characterID = results["data"].results[0].id;
        let output = "";

        output +=
          '<h2 id="characterMainTitle">' +
          "Character" +
          "</h2>" +
          '<div class="card flex-md-row mb-4 box-shadow h-md-250" id="characterCard">' +
          '<div id="characterImage">' +
          '<img class="card-img-right flex-auto d-md-block img-fluid"' +
          ' alt="Picture of ' +
          characterAttributes.name +
          '" src="' +
          characterAttributes.thumbnail["path"] +
          "." +
          characterAttributes.thumbnail["extension"] +
          '">' +
          "</div>" +
          '<div class="card-body d-flex flex-column align-items-start">' +
          '<h3 class="mb-0 text-dark" id="characterName">' +
          characterAttributes.name +
          "</h3>" +
          '<p class="card-text mb-3" id="characterDescription">';
        if (characterAttributes.description !== "") {
          output += characterAttributes.description;
        }
        output +=
          "</p>" +
          '<p class="text-muted mb-3" id="comicsAvailable">' +
          "Comics: " +
          characterAttributes.comics.available +
          " | " +
          "Series: " +
          characterAttributes.series.available +
          " | " +
          "Stories: " +
          characterAttributes.stories.available +
          " | " +
          "Events: " +
          characterAttributes.events.available +
          "</p>" +
          '<p class="mb-1 text-muted" id="characterInfoAttribution">' +
          results["attributionText"] +
          "</p>" +
          "</div>" +
          "</div>";
        
        document.getElementById("characterSection").innerHTML = output;
        
        comics(characterID)
      }

    } else {
      document.getElementById("characterSection").innerHTML = '<h2 id="characterMainTitle">Request not received</h2>';
    }
  }
  xhr.onloadend = function() {
    document.getElementById("characterSpinnerSection").innerHTML = "";
  }
  xhr.send()
}

function comics(characterID) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", './connections/character.php?character-id=' + characterID, true)
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); 
  xhr.onloadstart = function () {
    document.getElementById("comicsSpinnerSection").innerHTML =
      '<strong id="spinnerText" class="text-danger">Loading comics below...</strong>' +
      '<div class="spinner-border text-danger ml-auto" role="status" ' +
      'aria-hidden="true" id="spinner"></div>';
  }
  xhr.onerror = function () {
    document.getElementById("characterSection").innerHTML =
      '<h2 id="characterMainTitle">An error has occured, check connection.</h2>';
    document.getElementById("comicSection").innerHTML =
      '<h2 id="characterMainTitle">An error has occured, check connection.</h2>';
  }
  xhr.onload = function () {
    if (this.status == 200) {
      const results = JSON.parse(this.responseText),
        comics = results["data"].results,
        comicSection = document.getElementById("comicSection");
      
      console.log(results)
      // console.log(comics)

      if (results["data"] == 0) {
        let output = "";
        comicSection.innerHTML = output;
        comicSection.innerHTML = "<h2>No comics Available</h2>";
      } else {
        // comics available
        let output = "",
          creators = "";
        
          output +=
          '<h2 id="comicMainTitle">Comics</h2>' + '<div class="card-columns">';

        for (const i in comics) {
          if (comics.hasOwnProperty(i)) {
            const comic = comics[i];

            output +=
              '<div class="card">' +
              '<a href="./comic.php?comic-id=' +
              comic.id +
              '"><img src="' +
              comic.thumbnail["path"] +
              "." +
              comic.thumbnail["extension"] +
              '" class="card-img-top" alt="' +
              comic.title +
              '"></a>' +
              '<div class="card-body">' +
              '<h5 class="card-title">' +
              comic.title +
              "</h5>";

            if (comic.description != null) {
              output +=
                '<p style="font-size: 12px;" class="card-text">' +
                comic.description +
                "</p>";
            }

            output +=
              '<p style="font-size: 12px;" class="card-text text-muted">Characters: ';

            for (const k in comic.characters.items) {
              if (comic.characters.items.hasOwnProperty(k)) {
                const character = comic.characters.items[k];
                output += character.name.concat(", ");
              }
            }

            output += "</p>";
            output +=
              '<p style="font-size: 12px;" class="card-text text-muted">Creators: ';

            for (const j in comic.creators.items) {
              if (comic.creators.items.hasOwnProperty(j)) {
                const creator = comic.creators.items[j];

                output += creator.name.concat(" (" + creator.role + "), ");
              }
            }

            output += "</p>";
            output +=
              "</div>" +
              '<div class="card-footer">' +
              '<small style="line-height: 1;" class="text-muted">' +
              results["attributionText"] +
              "</small>" +
              "</div>" +
              "</div>";
          }
        }

        output += "</div>";

        comicSection.innerHTML = output;
        
      }

    } else {
      document.getElementById("characterSection").innerHTML =
        '<h2 id="characterMainTitle">Request not received</h2>';
      document.getElementById("comicSection").innerHTML =
        '<h2 id="characterMainTitle">Request not received</h2>';
    }
  }
  xhr.onloadend = function() {
    document.getElementById("comicsSpinnerSection").innerHTML =
      '<strong id="spinnerText" class="text-success">Done.</strong>';
  }
  xhr.send()
}

function singleComic() {
  const urlQueryParameters = new URLSearchParams(window.location.search),
    comicID = urlQueryParameters.get("comic-id");
    singleComicContainerDiv = document.getElementById(
      "singleComicContainerDiv"
    );
  
  const xhr = new XMLHttpRequest()

  xhr.open('GET', "./connections/single-comic.php?comic-id=" + comicID, true)
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); 
  xhr.onloadstart = function () {
    document.getElementById("comicsSpinnerSection").innerHTML =
      '<strong id="spinnerText" class="text-secondary">Loading comic info...</strong>' +
      '<div class="spinner-border text-secondary ml-auto" role="status" ' +
      'aria-hidden="true" id="spinner"></div>';
  }

  xhr.onerror = function () {
    singleComicContainerDiv.innerHTML =
      '<h2 id="characterMainTitle">An error has occured, check connection.</h2>';
  }

  xhr.onload = function () {
    if (this.status == 200) {
      const results = JSON.parse(this.responseText),
        comicInfo = results["data"].results[0],
        comicImage =
          comicInfo.thumbnail["path"] + "." + comicInfo.thumbnail["extension"],
        comicDescription = comicInfo.description,
        comicCharacters = comicInfo.characters.items,
        comicCreators = comicInfo.creators.items;
      
      let output = "";
      
        output +=
          '<h1 class="header-main-title single-comic__main-title">' +
          comicInfo.title +
          "</h1>" +
          '<div class="card mb-3">' +
          '<div class="row no-gutters">' +
          '<div class="col-md-4">' +
          '<img src="' +
          comicImage +
          '" class="card-img" alt="...">' +
          "</div>" +
          '<div class="col-md-8">' +
          '<div class="card-body">' +
          '<h5 class="card-title">' +
          comicInfo.title +
          "</h5>";

        if (comicDescription !== null && comicDescription !== "") {
          output += '<p class="card-text">' + comicDescription + "</p>";
        }

        output +=
          '<p class="card-text">' +
          '<small class="text-muted">' +
          " Characters: ";
        for (const i in comicCharacters) {
          if (comicCharacters.hasOwnProperty(i)) {
            const character = comicCharacters[i];
            output +=
              '<a href="./index.php?name=' +
              character.name +
              '">' +
              character.name +
              "</a>, ";
          }
        }

        output +=
          "</small>" +
          "</p>" +
          '<p class="card-text">' +
          '<small class="text-muted">' +
          "Creators: ";
        for (const i in comicCreators) {
          if (comicCreators.hasOwnProperty(i)) {
            const creator = comicCreators[i];
            var url = new URL(creator.resourceURI),
              creatorID = url.pathname.substring(
                url.pathname.lastIndexOf("/") + 1
              );
            output +=
              '<a href="./creator.php?creator-id=' +
              creatorID +
              '">' +
              creator.name.concat(" (" + creator.role + "), ") +
              "</a>, ";
          }
        }

        output +=
          "</small>" +
          "</p>" +
          "</div>" +
          "</div>" +
          "</div>" +
          '<div class="card-footer text-muted text-right"> ' +
          results["attributionText"] +
          "</div>" +
          "</div>";

        singleComicContainerDiv.innerHTML = output;


    } else {
      singleComicContainerDiv.innerHTML =
      '<h2 id="characterMainTitle">Request not received</h2>';
    }
  }

  xhr.onloadend = function () {
    document.getElementById("comicsSpinnerSection").innerHTML =
      '<strong id="spinnerText" class="text-secondary">Done.</strong>';
  }

  xhr.send()
}

function comicCreator() {
  const urlQueryParameters = new URLSearchParams(window.location.search), // http://localhost:8080/creator.php?creator-id=8635&name=jesushenandez
    creatorID = urlQueryParameters.get("creator-id");

  const xhr = new XMLHttpRequest();

  xhr.open("GET", "./connections/creator.php?creator-id=" + creatorID, true)
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); 
  xhr.onloadstart = function () {
    document.getElementById("comicCreatorSpinnerSection").innerHTML =
      '<strong id="spinnerText" class="text-secondary">Loading creator info...</strong>' +
      '<div class="spinner-border text-secondary ml-auto" role="status" ' +
      'aria-hidden="true" id="spinner"></div>';
  }

  xhr.onerror = function () {
    comicCreatorContainerDiv.innerHTML =
    '<h2 id="header-main-title single-comic__main-title">An error has occured, check connection.</h2>';
  }

  xhr.onload = function () {
    if (this.status == 200) {
      const results = JSON.parse(this.responseText),
        creatorInfo = results["data"].results[0],
        creatorFullName = creatorInfo.fullName,
        creatorImage =
          creatorInfo.thumbnail["path"] +
          "." +
          creatorInfo.thumbnail["extension"],
        comicCreatorContainerDiv = document.getElementById(
          "comicCreatorContainerDiv"
        ),
        creatorComics = creatorInfo.comics.items;
      let output = "";

      output +=
        '<h1 class="header-main-title single-comic__main-title">Creator</h1>' +
        '<div class="card mb-3">' +
        '<div class="row no-gutters">' +
        '<div class="col-md-4">' +
        '<img src="' +
        creatorImage +
        '" class="card-img" alt="' + creatorFullName + '">' +
        "</div>" + // end col-md-4
        '<div class="col-md-8">' +
        '<div class="card-body">' +
        '<h5 class="card-title">' +
        creatorFullName +
        "</h5>";

      output +=
        '<p class="text-muted mb-3">' +
        "Comics: " +
        creatorInfo.comics["available"] +
        " | " +
        "Series: " +
        creatorInfo.series["available"] +
        " | " +
        "Stories: " +
        creatorInfo.stories["available"] +
        " | " +
        "Events: " +
        creatorInfo.events["available"] +
        "</p>";

      output +=
        "</div>" + // Card Body
        "</div>" + // col-md-8
        "</div>" + // row
        '<div class="card-footer text-muted text-right"> ' +
        results["attributionText"] +
        "</div>" +
        "</div>"; // card

      output +=
        '<h1 class="header-main-title single-comic__main-title">Comics</h1>' +
        '<div class="row" id="comicColumns"></div>';

      comicCreatorContainerDiv.innerHTML = output;

      for (const i in creatorComics) {
        if (creatorComics.hasOwnProperty(i)) {
          const comic = creatorComics[i];
          creatorSingleComic(comic.resourceURI);
        }
      }
      
    } else {
      comicCreatorContainerDiv.innerHTML =
      '<h2 id="header-main-title single-comic__main-title">An error has occured, check connection or bad request.</h2>';
    }
  }

  xhr.onloadend = function () { 
    document.getElementById("comicCreatorSpinnerSection").innerHTML = "";
  }

  xhr.send()

}

function creatorSingleComic(comicResourceURI) {
  const url = new URL(comicResourceURI),
    comicID = url.pathname.substring(url.pathname.lastIndexOf("/") + 1), // https://lskdjflkjsd.com/kdjfls/laskdfj/847384738
    comicColumns = document.getElementById("comicColumns");
  
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "./connections/single-comic.php?comic-id=" + comicID)
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); 
  xhr.onloadstart = function () {
    document.getElementById("comicCreatorSpinnerSection1").innerHTML =
      '<strong id="spinnerText" class="text-secondary">Loading comics...</strong>' +
      '<div class="spinner-border text-secondary ml-auto" role="status" ' +
      'aria-hidden="true" id="spinner"></div>';
  }
  xhr.onerror = function () {
    comicColumns.innerHTML == '<h2>An error has occured. </h2>';
  }
  xhr.onload = function () {
    if (this.status == 200) {
      const results = JSON.parse(this.responseText),
        comicInfo = results["data"].results[0],
        comicImage =
          comicInfo.thumbnail["path"] + "." + comicInfo.thumbnail["extension"],
        comicTitle = comicInfo.title;
      
      let output = "";

      output =
        '<div class="col-md-4" >' +
        '<div class="card mb-3">' +
        '<a href="./comic.php?comic-id=' +
        comicInfo.id +
        '">' +
        '<img src="' +
        comicImage +
        '" class="card-img-top" alt="' +
        comicTitle +
        '">' +
        "</a>" +
        '<div class="card-body">' +
        '<h5 class="card-title">' +
        comicTitle +
        "</h5>";

      if (comicInfo.description !== "" || comicInfo.description != null) {
        output +=
          '<p class="card-text"><small class="text-muted">' +
          comicInfo.description +
          "</small></p>";
      }
      output +=
        '<a href="./comic.php?comic-id=' +
        comicInfo.id +
        '">Check it out!</a>' +
        "</div>" +
        "</div>" +
        "</div>";

      comicColumns.innerHTML += output;
    } else {
      comicColumns.innerHTML == '<h2>An error has occured. </h2>';
    }
  }
  xhr.onloadend = function () {
    document.getElementById("comicCreatorSpinnerSection1").innerHTML =
      '<strong id="spinnerText" class="text-secondary">Done.</strong>';
  }
  xhr.send()
}