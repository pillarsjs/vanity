function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function fillHtml(data){
    
    let detailsData = "";
    let starsAll = 0;
    let commitsAll = 0;
    let downloadsAll = 0;
    
    data.forEach(function(pkg){
        
        starsAll += pkg.github.total_stars ;
        commitsAll += pkg.github.total_commits ;
        downloadsAll += pkg.npm.monthly_downloads ;
        
        detailsData += `<article>
            <h1>${capitalizeFirstLetter(pkg.repository)}</h1>
            <p>${pkg.description}</p>
            <footer>
                <ul class="statistics">
                    <li class="stars"><i class="ico"><svg><use xlink:href="#ico-stars"/></svg></i>${pkg.github.total_stars}</li>
                    <li class="commits"><i class="ico"><svg><use xlink:href="#ico-commits"/></svg></i>${pkg.github.total_commits}</li>
                    <li class="downloads"><i class="ico"><svg><use xlink:href="#ico-downloads"/></svg></i>${pkg.npm.monthly_downloads}</li>
                </ul>
                <div class="links">
                    <a href="https://www.npmjs.com/package/${pkg.repository}">in NPM ➞</a>
                    <a href="https://github.com/${pkg.organization}/${pkg.repository}">in GitHub ➞</a>
                </div>
            </footer>
          </article>`;
    });
    document.querySelector(".vanityPackages").innerHTML = detailsData;
    document.querySelector(".totals .stars span").innerHTML = starsAll;
    document.querySelector(".totals .commits span").innerHTML = commitsAll;
    document.querySelector(".totals .downloads span").innerHTML = downloadsAll;
}

function loadData(cb) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4){
        if (this.status == 200) {
            cb(JSON.parse(this.responseText));
        } else {
            console.log("ERROR in Ajax request against server!");
        }  
    }

  };
  xhttp.open("GET", "api", true);
  xhttp.send();
}

loadData(fillHtml);