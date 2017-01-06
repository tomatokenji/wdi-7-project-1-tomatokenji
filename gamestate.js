
//game states - for gameStateMachine, with game methods
var fsm = StateMachine.create({
  //loading - enter username and details page
  //menu - story

  initial: 'loading',
  events: [
    {name:"ready", from:"loading", to: "menu"},
    {name:"quit", from:"playing", to: "lost"},
    {name:"pause", from:"playing", to:"pausing"},
    {name:"resume", from:"pausing", to: "playing"},
    {name:"start", from:"menu", to:"playing"},
    {name:"reset", from:"playing", to:"loading"},
    {name:"win", from:"playing", to:"won"},
    {name:"lose", from:"playing", to:"lost"},
    {name:"finish", from:["won","lost"], to:"loading"}
  ],

  callbacks: {
    onloading: function(){
      console.log("onloading function called");

      //some cool effects for fun
      $("button").hover(function(){
        $(this).css({
          effect: "scale",
          percent: "120%"
        },200);
       });

       //RUN AWAY ZOOM

       var temp = setInterval(function(){
         $("#load_screen>h1").fadeToggle("fast",'linear')},500);


      $(".feedback_score>h1").html("");

      $("#leaderboard").hide();
      $('#load_screen').show();
      $('#background-audio').attr("src","./sounds/startmusic.ogg");
      $('.submit').click(function(){
        clearInterval(temp);
        var user = $('.username').val();
        if(user === null || user === ""){
         $('.invalid').show();
         console.log("blank");

       }else if(game != null){
         gameObject.createPlayer(user);
         $("#user").html(user);
         fsm.ready();
         $('.submit').off();
       }else{
         gameObject = new startGame();
         game = "something";
         gameObject.createPlayer(user);
         $("#user").html(user);
         $('.submit').off();
        fsm.ready();
       }
      })
    },

    onready: function(){
      console.log("onready function called");
      $("#load_screen").hide();
      gameObject.reflectLevel(1);

      $("#story").show();
      $('#okay').click(function(){
        $('#story').slideToggle("slow",function(){
          if(gameObject.hasGameStarted === false){
            fsm.start();
            gameObject.hasGameStarted = true;
            //update the zombies killed and score for the later screen
            $("#player1-score>span:last").html(Math.round(gameObject.player.totalScore));
            $("#zombies-slayed>span:last").html(gameObject.player.enemiesKilled);
          }else{
            //this is the chapter loading. because sharing button function
            gameObject.chapterStart();
            $('#playing_screen').show();
          }
            console.log("okay button pressed");
        })
      })
    },

    onstart: function(){
      console.log("onstart function called");
      $('#pause').off();
      $('#pause').click(function(){
        fsm.pause();
      })
      gameObject.chapterStart();
      $("#playing_screen").show();
    },

    onquit: function(){},

    onpause: function(){
      gameObject.pauseGame();
      //for the resume button;
      $('#pause').off();
      $('#pause').click(function(){
        fsm.resume();
        gameObject.resumeGame();
      })

    },

    onresume: function(){
      $('#pause').off();
      $('#pause').click(function(){
        fsm.pause();
      })
    },

    onreset: function(){},

    onwin: function(){

    
        $(".feedback_score>h1").html("congratulations, you managed to escape from the zombies! ");
        $("#playing_screen").hide();
        $("#feedback_screen").show();


        $("#to_nextlevel").click(function(){
          $("#feedback_screen").hide();
          $("#to_nextlevel").off();
          $("#leaderboard").show();
          gameObject.restartGame();

          $("#finish").click(function(){
            fsm.finish();
            $("#finish").off();
          })

        })

    },

    onlose: function(){

      $(".feedback_score>h1").html("you were brutally slayed by the zombies, and dismembered");
      $("#playing_screen").hide();
      $("#feedback_screen").show();

      $("#to_nextlevel").click(function(){
        $("#feedback_screen").hide();
        $("#to_nextlevel").off();
        $("#leaderboard").show();
        gameObject.restartGame();

        $("#finish").click(function(){
          fsm.finish();
          $("#finish").off();
        });

      })
    },

    onfinish: function(){
      //attach handler to go back to main page
    },


  },

})

//test for gamestatemachine
console.log(fsm.current);
// fsm.ready();

//other global items
var game=null;
