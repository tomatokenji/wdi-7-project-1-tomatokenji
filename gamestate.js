
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
    {name:"finish", from:["won","lost"], to:"menu"}
  ],

  callbacks: {
    onloading: function(){
      $('.submit').click(function(){
        var user = $('.username').val();
        console.log(user);
        if(user == null || user ==""){
         $('.invalid').show();
         console.log("blank");
       }else{
         gameObject = new startGame();
         console.log(gameObject,"")
        fsm.ready();
       }
      })
    },

    onready: function(){
      console.log("onready function called");
      $("#load_screen").hide();
      $('#okay').click(function(){
        $('#story').slideToggle("slow",function(){
            fsm.start();
            console.log("okay button pressed");
        })
      })
    },

    onstart: function(){
      console.log("onstart function called");
      gameObject.spawnEnemy();
    },

    onquit: function(){},

    onpause: function(){},

    onresume: function(){},



    onreset: function(){},

    onwin: function(){},

    onlose: function(){},
    onfinish: function(){},


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
