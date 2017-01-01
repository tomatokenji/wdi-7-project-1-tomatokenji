
//game states - for gameStateMachine, with game methods

var fsm = StateMachine.create({
  initial: "loading",
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

    onquit: function(){},
    onpause: function(){},
    onresume: function(){},
    onstart: function(){},
    onreset: function(){},
    onwin: function(){},
    onlose: function(){},
    onfinish: function(){},

    onloading: function(){},
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

//adding handlers for events
  //this is function for during loading
$('.submit').click(function(){

  var user = $('.username').val();
  console.log(user);
  if(user == null || user ==""){
   $('.invalid').show();
   console.log("blank");
 }else{
   playerArray.push(new Player(user));
  fsm.ready();
 }
})

//okay button - for
// $('#okay').click(function(){
//   $('#story').slideToggle("slow",function(){
//     if(fsm.current==="menu"){
//       fsm.start();
//     }
//     console.log("okay button pressed");
//   })
// })



//FINAL variables for the game
var LEVELS = [
  {level:1, image:"./image/gameBackground.png", prestory:"", zombie: "baby", kill: 15},
  {level:2, image:"./image/gameBackground2.png", prestory:"you go on to the next forest!", zombie: "teen", kill: 15 },
  {level:3, image:"", prestory:"", zombie:"teen", kill: 15},
  {level:4, image:"", prestory:"", zombie:"zombie", kill: 15},
  {level:5, image:"", prestory:"", zombie:"bossZombie", kill: 15},
]

var ZOMBIES = {
  baby: {hp:1, attack: 5, image:"", width:"", height:""},
  teen: {hp:2, attack: 10, image:"./image/zombie.png", width:"", height:"" },
  zombie:{hp:3, attack: 15, image:"", width:"", height:""},
  bossZombie:{hp:20, attack: 20, image:"", width:"", height:""},
}

var WEAPONS = [
  {name: "pistol", damage: 2, bullets: 200},
  {name:"shotgun", damage: 5, bullets: 50},
]


//variables for the leaderboard
var playerArray =[];
//variables for the level
var currentLevel = 1;
var score = 0;
var health = 100;
var toKill = 15;

//classes to instantiate
//player object - for the highscore board
function Player(name){
  this.name = name;
  this.icon = 0;
  this.score = 0;
  this.weapons = [WEAPONS[0]];
}

//enemy object
function Enemy(zombie, index){
  this.zombie = zombie;
  this.index = index;
}

//game functions and game objects, game loop. my subset of the game machine
function startGame (){
  this.scoreNeeded = 15;
  this.currentLevel = 1;
  this.enemyArray = [];
  this.health = 100;


  //temp putting
  this.ZOMBIES = {
    baby: {hp:1, attack: 5, image:"", width:"", height:""},
    teen: {hp:2, attack: 10, image:"./image/zombie.png", width:"", height:"" },
    zombie:{hp:3, attack: 15, image:"", width:"", height:""},
    bossZombie:{hp:20, attack: 20, image:"", width:"", height:""},
  }

  //temp also
  function Enemy(zombie, index){
    this.zombie = zombie;
    this.index = index;
  }


  //function to load stories, objects, etc.
  this.reflectLevel = function(level){
    var levelObject = $.grep(LEVELS, function(e){
      return e.level === level;
    })
    $(".shootRange").css("background-image", "url(" + levelObject[0].image + ")");
    $("#story>p").text(levelObject[0].prestory);
    scoreNeeded = levelObject[0].kill;
  };

  this.spawnEnemy = function(){
    //horizontal appearance
    var randomNo = Math.random()*90;
    //vertical appearance
    var randomNo2 = Math.random()*80;
    $('.shootRange').append('<div class="enemy">');
    var lastEnemy = $('.enemy:last');
    var index = movingEnemy(lastEnemy);
    var zombie = this.ZOMBIES.teen;
    console.log(zombie);
    var newZombie = new Enemy(zombie, index);
    newZombie.clicks = 0;
    $(lastEnemy).css({
        'left':randomNo+'%',
        'top':randomNo2+'%',
    });
    zombieOnClick(lastEnemy, newZombie);
    this.enemyArray.push(newZombie);
  }

  //function for game logic


  //other functions
    //random moving zombie animation
  function movingEnemy(something){
    var index = setInterval(function(){
      var random = Math.random();
      var topPosition = parseInt(something[0].style.top);
      var leftPosition = parseInt(something[0].style.left);

      if(random<0.33 && leftPosition <= 85.1){
        $(something).css({
          'left': "+=5%",
        })
      }else if(random<0.66 && topPosition <= 80.1){
        $(something).css({
          'top':"+=5%",
        })
      }else if(leftPosition>2){
        $(something).css({
          'left':"-=5%",
        })
      }

      if(topPosition >= 80){
        health -= 5;
        $('#health').prop("value",health);
      }
    }, 1000)
    return index;
  }

  //check if zombie killed, and kill the zombie
  function zombieOnClick(selector, enemy){
    selector.click(function(){
      enemy.clicks++;
      console.log("enemy times clicked:", enemy.clicks);
      if(enemy.clicks >= enemy.zombie.hp){
        clearInterval(enemy.index);
        (selector).remove();
        console.log("enemy removed");
      }
    })
  }





}

game = new startGame();
