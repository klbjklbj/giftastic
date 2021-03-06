$(document).ready(function () {

    var topics = ["Fozzy Bear", "Kermit", "Gonzo", "Waldorf & Statler", "Swedish Chef"]; //buttons that are initially displayed

    var muppetButtonDiv = $("#muppetButtonDiv");

    function makeButtons() {

        (muppetButtonDiv).empty(); // to avoid duplicating button array

        for (let i = 0; i < topics.length; i++) {

            console.log(topics);

            var muppetButton = $("<button>");

            muppetButton.attr("data-muppet", topics[i]);

            muppetButton.addClass("muppet-button");

            muppetButton.addClass("btn-caution");

            muppetButton.text(topics[i]);

            $(muppetButtonDiv).append($(muppetButton));

        }
    }


    $(document).on("click", "#addMuppetButton", function () {  //takes user input and then calls makeButtons();

        var newMuppet = $("#inputMuppet").val().trim(); //what user puts in text box
        if (newMuppet == "") {
            alert("Please add a muppet");
            return false; // added so user cannot add a blank button
        }
        topics.push(newMuppet); // adds user input to array of topics (muppet names)
        console.log(topics);

        makeButtons(); //calling function
        event.preventDefault(); // same effect as return false; -- why does this allow new button to array????                             

    });

    $(document).on("click", ".muppet-button", function () { //event listener for all .muppet-button's

        var muppet = $(this).attr("data-muppet"); // this refers to button that was clicked

        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            muppet + "&api_key=Xf3D1IUPSfWtbSCiPw2h98KWEyZeDbPu&limit=10";

        $.ajax({  // performs AJAX GET request
            url: queryURL,
            method: "GET"
        })

            .then(function (response) { //after data comes back from API

                var results = response.data;  //stores array of results in response variable

                for (var i = 0; i < results.length; i++) { //loops over every result item

                    if (results[i].rating !== "r" && results[i].rating !== "pg-13") {

                        var muppetDiv = $("<div>"); //create a div for gifs

                        var rating = results[i].rating;  // store result item's rating

                        var p = $("<p>").text("Rating: " + rating); //create <p> tag with result item's rating

                        var muppetImage = $("<img>"); //creates image tag

                        muppetDiv.addClass("muppetDiv");

                        muppetImage.attr("src", results[i].images.fixed_height_small.url); // gives image tag a src attribute of a property pulled off of result item

                        muppetImage.attr("data-state", "animate");  //sets data state to animate which is how images are initially formatted with "src" from Giphy

                        muppetImage.attr("data-still", results[i].images.fixed_height_small_still.url); //results for still images

                        muppetImage.attr("data-animate", results[i].images.fixed_height_small.url);  //results for animated images

                        muppetImage.addClass("gif");  //adds this class to be used for below click event

                        muppetDiv.append(muppetImage); //appends muppetImage to muppetDiv just created
                        muppetDiv.append(p);  //appends paragraph to muppetDiv just created

                        $("#muppets-appear-here").prepend(muppetDiv);
                    }
                }

            });

    });

    $(document).on("click", ".gif", function () {  // event listener for all gifs (class added above) to change between animated and still images -- use this (document) when objects are dynamically added to page

        var state = $(this).attr("data-state"); //adds "data-state" attribute

        console.log(state);

        // If the clicked image's state is animate, src attribute is updated to what its data-still value is and set data-state to still
        // Else set src and data-state to the data-animate value

        if (state === "animate") {  //which they initially come back as via src

            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");

        } else {

            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");

        }
    });

    makeButtons();  // calling function to make initial buttons on page load

});