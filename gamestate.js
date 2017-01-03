
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

      $("#leaderboard").hide();
      $('#load_screen').show();
      $('#background-audio').attr("src","./sounds/startmusic.ogg");
      $('.submit').click(function(){
        var user = $('.username').val();
        if(user == null || user ==""){
         $('.invalid').show();
         console.log("blank");
         $('.submit').off();
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
      $("#story>p").html(gameObject.levelObject.prestory);
      $("#story").show();
      $('#okay').click(function(){
        $('#story').slideToggle("slow",function(){
          if(gameObject.hasGameStarted === false){
            fsm.start();
            gameObject.hasGameStarted = true;
          }else{
            //this is the chapter loading. because sharing button function
            $('#feedback_screen').hide();
            $('#playing_screen').show();
            gameObject.chapterStart();
            return null;
          }
            console.log("okay button pressed");
        })
      })
    },

    onstart: function(){
      console.log("onstart function called");

      gameObject.chapterStart();
      $("#playing_screen").show();
    },

    onquit: function(){},

    onpause: function(){

    },

    onresume: function(){},



    onreset: function(){},

    onwin: function(){

    },

    onlose: function(){
      console.log("you have lost");
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
        })

      })
    },

    onfinish: function(){
      //attach handler to go back to main page
    },

    onentermenu: function(){},
    onlost: function(){},
    onpausing: function(){},
    onplaying: function(){},
    onwon: function(){},
    onlost: function(){},

  },

})

//test for gamestatemachine
console.log(fsm.current);
// fsm.ready();
var game=null;
