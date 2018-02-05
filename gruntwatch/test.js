const fetch = require('node-fetch');
const prettyjson = require('prettyjson');

const readurl = 'https://candidate.hubteam.com/candidateTest/v2/partners?userKey=5f2b0ecdcb3b4f8af8711bd1328e';
const posturl = 'https://candidate.hubteam.com/candidateTest/v2/results?userKey=5f2b0ecdcb3b4f8af8711bd1328e';



// just a handy fetch data utility, uses GET and returns fetch's promise
const getData = function(url) {
    return fetch(url).then( res => {
        return res.json();
    }).catch( err => {
        console.log(`Sorry this went badly, ${err}`)
    });
}

// another one this time for post
const postData = function(url, data) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data), 
        headers: {
          'Content-Type': 'application/json'
        }
        }
        ).then( res => {
        return res.json();
        }).catch( err => {
            console.log(`Sorry this went badly, ${err}`)
        });
}


const getAvailableDates = function(partnersByCountry, partners) {

    var ctries = [];

    partnersByCountry.forEach( (entry, country) => {

        //  entry is an array of partner entries

        // let's get all availalbe data fro this counry
        var dates = [];
        entry.map(e => { 
            dates = dates.concat(e.availableDates);
        });
        var datesUnique = Array.from(new Set(dates)).sort();

        //datesUnique.forEach(e => console.log(e));

        var availEntriesSet = new Map();

        // checks if entry is available in the date 'thedate'
        const availInDate = function(thedate, theentry) {
            var datesarr = theentry.availableDates;
            var avail = false;
            datesarr.map(e => {
                if (thedate === e) { avail = true };
            });
            return avail;
        }

        // check if two dates are in a row
        const inarow = function(date1,date2) {
            var date1x = new Date(date1);
            var date2x = new Date(date2);
            var timeDiff = Math.abs(date2x.getTime() - date1x.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return diffDays==1;
        }

        for (var ii=0;ii<datesUnique.length-1; ii++) {
            var currentdate = datesUnique[ii];
            var nextdate = datesUnique[ii+1];

            // check if available in both dates
            // if so add entry to an array of entries
            var availEntries = [];
            entry.forEach(e => {
                if (availInDate(currentdate, e) && availInDate(nextdate, e)) {
                    // check if 'in a row' is true as well
                    var inarowState = inarow(currentdate, nextdate);
                    if (inarowState==true) {
                        console.log("Matching entry for " + currentdate + " : " + nextdate)
                        availEntries.push(e);
                    }
                }
            })

            // this is all entries aailable on this date and next one
            availEntriesSet.set(currentdate, availEntries);
            
            
        }

        // let's find date where there is max availability
        var maxDateEntry = availEntriesSet.values().next();
        var maxDate = availEntriesSet.keys().next();
        for (let [key, item] of availEntriesSet) {
            if (item.length>maxDateEntry.length) {
                maxDate = key;
            }
        }
            
        var dateStr = maxDate.value;
        // null if no attendees availalbe
        if (availEntriesSet.get(maxDate.value).length==0) {
            dateStr = null;
        }

        var c = {
            attendeeCount: availEntriesSet.get(maxDate.value).length,
            attendees: availEntriesSet.get(maxDate.value).map(e => { return e.email} ),
            name: country,
            startDate: dateStr
        }
        ctries.push(c);

    });

    return {
        countries: ctries
    }
}

// Get data about avaiable dates using get request
getData(readurl).then( data => {

    // data.partners is the array we want

    var countries = data.partners.map( oneEntry => {
        return oneEntry.country;
    }); 
    var uniquectries = new Set(countries);
    uniquectries.forEach(e => console.log(e));

    partnersByCountry =  new Map();
    uniquectries.forEach(c => {
        var value = [];
        data.partners.map(oneEntry => {
            if (oneEntry.country === c) {
                value.push(oneEntry);
            }
        })
        partnersByCountry.set(c, value);
    });


    var availDates = getAvailableDates(partnersByCountry, data.partners);

    console.log(prettyjson.render(availDates));

    // post to hubspot response url
    postData(posturl, availDates).then( response => {
        console.log("Response from hubspot server was : \n\n");
        console.log(prettyjson.render(response));
    })

});