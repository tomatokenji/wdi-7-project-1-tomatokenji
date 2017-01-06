//game functions and game objects, game loop. my subset of the game machine
  function startGame(){
    //FINAL VARIABLES
    this.ZOMBIES = {
      baby: {hp:1, attack: 5, image:"./image/babyZombie.png", width:"10%", height:"10%", score: 10, movespeed: 500, },
      teen: {hp:2, attack: 10, image:"./image/zombie.png", width:"10%", height:"10%", score: 20, movespeed: 400,  },
      zombie:{hp:3, attack: 15, image:"./image/adultZombie.png", width:"15%", height:"15%", score: 30, movespeed: 300,},
      madScientist:{hp:20, attack: 20, image:"", width:"20%", height:"20%", score: 40, movespeed: 600,},
    };

    this.LEVELS = [
      {level:1, image:"./image/gameBackground.png", prestory:"Zombies have infested the world of Archeas. <br> You are armed with a shotgun. <br> Escape from the world through the space shuttle, located 20KM away from you", instruction:[{des:"shoot at the zombie by clicking once!", pic:'url("./image/BabyZombie.png")'}, {des:"try not to miss... ammunition is limited! ", pic: 'url("./image/gun-cursor.png")'}, {des:"you are at the bottom of the screen. make sure the zombies do not infect you!", img:"#"}] , zombie: "baby", kill: 5, spawnNo: 1, interval: 2000},
      {level:2, image:"./image/gameBackground2.png", prestory:"CONGRATULATIONS!<br> you manage to pass your house backyard, into the marshes. A lair of hungry zombies awaits to attack you", instruction:[{des:"The zombies have mutated to be stronger, and now require two shots", pic:"url('./image/zombie.png')"}, {des:"try to kill as many as you can to create your escape path!", pic:'url("./image/goodluck.png")'}], zombie: "teen", kill: 10, spawnNo:2, interval: 2000},
      {level:3, image:"./image/gameBackground3.jpg", prestory:"A job well done. <br> Attracted to the gun sounds, the next wave of zombies are starting to appear before you! Make your way towards your goal - you are halfway through! ", instruction:[{des:"good luck to you", pic:"url('./image/goodluck.png')"}], zombie:"teen", kill: 5, spawnNo: 2, interval: 2000},
      {level:4, image:"./image/gameBackground4.jpg", prestory:"Good job! you are now 5KM away from the destination - escape seems not so far away now.", instruction:[{des:"shoot at the zombie by clicking thrice!", pic:"url('./image/adultZombie.png')"}, {des:"try not to miss... ammunition is limited! ", pic:"#"}], zombie:"zombie", kill: 10, spawnNo: 2, interval: 2000},
      {level:5, image:"./image/gameBackground5.jpg", prestory:"Here comes the mad scientist", instruction:[{des:"shoot at the zombie by clicking once!", pic:"#"}, {des:"try not to miss... ammunition is limited! ", pic:"#"}], zombie:"madScientist", kill: 15, spawnNo: 2, interval: 2000},
    ];

    //not used yet - for future use hhaha
    this.WEAPONS = [
      {name: "pistol", damage: 2, bullets: 200, sound: "./sounds/pistolsound.wav"},
      {name:"shotgun", damage: 5, bullets: 50, sound: ""},
    ];

    //game variables
    var self = this;
    this.killNeeded = null;
    this.currentLevel = 1;
    this.enemyArray = [];
    this.playerArray = [];
    this.startGameIndex = null;
    this.hasGameStarted = false;
    this.levelObject = self.LEVELS[0];
    this.player = null;
    this.leaderboard = [];
    this.currentBonus = 0;


    //GAME OBJECTS
    function Enemy(zombie, index, selector){
      this.zombie = zombie;
      this.index = index;
      this.selector = selector;
    };

    function Player(name){
      this.name = name;
      this.icon = null;
      this.score = 0;
      this.totalScore = 0;
      this.enemiesKilled = 0;
      this.totalEnemiesKilled = 0;
      this.health = 100;
      this.weapons = self.weapons;
      this.maxLevelReached = 0;
      this.currentAccuracy = 0;
      this.bulletsShot = 0;
      this.bulletsHitCount = 0;
      this.medalArray=[]; //if there is time to implement - else no.
    }

    this.createPlayer = function(user){
      var player = new Player(user);
      self.playerArray.push(player);
      self.player = self.playerArray[self.playerArray.length-1];
      console.log(self.player);
    }

    //function to load stories, objects, etc. returns the level object
    this.reflectLevel = function(level){
      console.log("reflectLevel activated");
      var levelArray = $.grep(self.LEVELS, function(e){
        return e.level === level;
      })
      $(".bloodsplat>img").off();
      self.levelObject = levelArray[0];
      $(".shootRange").css("background-image", "url(" + levelArray[0].image + ")");
      $("#typed-strings>p").html(levelArray[0].prestory);
      console.log("prestory loaded");
      $(function(){
          $(".element").typed({
              stringsElement: $('#typed-strings'),
              typeSpeed: 5,
              showCursor: false,
          })
      })

      self.createInstructions();

      self.killNeeded = levelArray[0].kill;
      console.log("score",self.killNeeded);
      return levelArray[0];
    };

    function spawnEnemy(){

      $('.shootRange').append('<div class="enemy">');

      var lastEnemy = $('.enemy:last');

      var zombie = self.ZOMBIES[self.levelObject.zombie];
      console.log(zombie);

      //function to get the height and width of the monster
      $(lastEnemy).css({
        "height": zombie.height,
        "width":zombie.width,
      })

      var index = movingEnemy(lastEnemy, zombie.movespeed, zombie);
      //for enemy Healthbar
      $(lastEnemy).append('<progress class="enemyHealth">');
      $(lastEnemy).children().attr({"max": zombie.hp , "value": zombie.hp })

      //barriers
      var rightBarrier = 100 - parseInt(zombie.width);
      var topBarrier = 100 - parseInt(zombie.height) - 20;
      //horizontal appearance
      var step1 = Math.random()*rightBarrier;
      var step2 = step1/5;
      console.log(step2);
      var randomNo = Math.round(step2)*5;
      //vertical appearance
      step1 = Math.random()*topBarrier;
      console.log("step1",step1);
      step2 = step1/5;
      console.log("step2",step2);
      var randomNo2 = Math.round(step2)*5;
      console.log(randomNo,randomNo2);

      var newZombie = new Enemy(zombie, index, lastEnemy);
      newZombie.clicks = 0;
      $(lastEnemy).css({
          'left':randomNo+'%',
          'top':randomNo2+'%',
          'background-image': "url(" + zombie.image + ")",
      });
      zombieOnClick(lastEnemy, newZombie);
      self.enemyArray.push(newZombie);
    }

    //function for game logic
    this.chapterStart = function(){
      // self.levelObject =
      // self.reflectLevel(self.currentLevel);
      self.startGameIndex = levelEnemySpawn(self.levelObject.spawnNo, self.levelObject.interval);
      shootingSound();
    }

    this.pauseGame = function(){
      clearInterval(self.startGameIndex);
      for(var i=0; i<self.enemyArray.length; i++){
        clearInterval(self.enemyArray[i].index);
      }
      offShootingSound();
      $('#pause').css("background-image","url('./image/play.png')");
      $('.enemy').off();
    }

    this.resumeGame = function(){
      //for some bug - when press resume, the bulletshot will count.
      self.player.bulletsShot--;

      $('#pause').css("background-image","url('./image/pause.png')");
      for(var i=0; i<self.enemyArray.length; i++){
        var selector = self.enemyArray[i].selector;
        self.enemyArray[i].index = movingEnemy(selector, self.enemyArray[i].zombie.movespeed, self.enemyArray[i].zombie);
        zombieOnClick(selector, self.enemyArray[i]);
      }

      self.chapterStart();
    }

    function levelEnemySpawn(numberToSpawn, interval){
      var indexForPause = setInterval(function(){
        for(var i=0; i<numberToSpawn; i++){
          spawnEnemy();
        }
      }, interval);
      return indexForPause;
    }
    //other functions
      //random moving zombie animation
    function movingEnemy(something, moveSpeed, zombie){
      var index = setInterval(function(){
        var random = Math.random();
        var topPosition = parseInt(something[0].style.top);
        var leftPosition = parseInt(something[0].style.left);
        //collision detection
        var topBarrier = 100 - parseInt(zombie.height) - 10;
        var rightBarrier = 100 - parseInt(zombie.width);


        if(topPosition>=topBarrier){

        }else if(random<0.33 && leftPosition <= rightBarrier){
          $(something).animate({
            'left': "+=5%",
          },moveSpeed,"linear");
        }else if(random<0.66 && topPosition <= topBarrier){
          $(something).animate({
            'top':"+=5%",
          },moveSpeed,"linear");
        }else if(leftPosition>2){
          $(something).animate({
            'left':"-=5%",
          },moveSpeed,"linear");
        }
        if(topPosition >= topBarrier){
          self.player.health -= 5;
          bloodsplat(moveSpeed);
          $('#health').prop("value",self.player.health);

          if($('#ouch').duration>0){
            $('#ouch').trigger("pause");
          }
          $('#ouch')[0].play();

          $('.flex_inline>div>p').html(self.player.health);
          // blinkingHealthBar();
          console.log(self.player.health);
          died();
        }
      }, moveSpeed)
      return index;
    }

    //check if zombie killed, and kill the zombie
    function zombieOnClick(selector, enemy){
      selector.click(function(){
        $("#hit")[0].play();
        enemy.clicks++;
        self.player.bulletsHitCount++;
        console.log("enemy times clicked:", enemy.clicks);
        console.log("enemy hp", enemy.zombie.hp);

        //health bar for zombie
        var rHp = enemy.zombie.hp-enemy.clicks;
        $(selector).children().attr({"value": rHp});

        if(enemy.clicks >= enemy.zombie.hp){
          clearInterval(enemy.index);
          (selector).css("background-image", "url('./image/zombie-blood.png')");
          selector.off();
          //to remove enemy from the enemyArray
          selector.fadeOut();
          setTimeout(function(){
            selector.remove();
          },400)

          var x = self.enemyArray.indexOf(enemy);
          self.enemyArray.splice(x,1);
          console.log("enemy removed");
          self.player.score += enemy.zombie.score;
          self.player.totalScore += enemy.zombie.score;
          $("#player1-score>span:last").html(Math.round(self.player.totalScore));
          $("#zombies-slayed>span:last").html(++self.player.enemiesKilled);
          passLevel();
        }

      })
    }

    //b passing level
    function passLevel(){
      console.log("passLevel function called");
      if(self.killNeeded <= self.player.enemiesKilled){
        if(self.currentLevel < self.LEVELS.length){
          console.log("passed!");
          self.currentLevel++;
          console.log("you moved on to", self.currentLevel);
        }else{
          fsm.win;
        }




        for(var i=0;i<self.enemyArray.length; i++){
          (self.enemyArray[i].selector).remove();
        }
        self.pauseGame();
        updateAttributes();
        $('#playing_screen').hide();

        $('#feedback_screen').show();
        $('#to_nextlevel').click(function(){
          self.reflectLevel(self.currentLevel);
          $('#feedback_screen').hide();
          $('#story').show();
          $('#playing_screen').show();

          $('#to_nextlevel').off();
        })
      }
    }

    // a continuation of reflectLevel
    function updateAttributes(){
      calculateAccuracy();
      accuracyBonus();
      self.player.score = 0;
      self.player.totalEnemiesKilled += self.player.enemiesKilled;
      self.player.totalScore += self.currentBonus;
      //to reflect Attributes on the feedback page
      $('#zombyKill').html(self.player.enemiesKilled);
      $("#currentBonus").html(Math.round(self.currentBonus));
      $("#accuracy").html(Math.round(self.player.accuracy*10)/10 + "%");

      $("#total-score").html(Math.round(self.player.totalScore));
      self.currentBonus = 0;
      self.player.enemiesKilled = 0;
      self.player.health = 100;
      self.enemyArray = [];


      gameObject.playerArray.sort(function(a,b){
        return b.totalScore - a.totalScore;
      });
      updateLeaderboard();
      //update health bar for later, and the enemies killed for the stage
      $('#health').prop("value",self.player.health);
      $(".flex_inline>div>p").text(self.player.health);
      $("#player1-score>span:last").html(Math.round(self.player.totalScore));

    }

    //function for shooting sound
    function shootingSound(){
      $("#playing_screen").click(function(){
        $("#shoot")[0].play();
        //to keep count of bullets shot
        self.player.bulletsShot++;
        console.log("bulletsShot", self.player.bulletsShot);
      })
    }

    function offShootingSound(){
      $("#playing_screen").off();
    }

    //function to check if dead - should be in gameState file
    function died(){
      if(self.player.health<=0){
        console.log("you have died");
        self.pauseGame();
        updateAttributes();
        $('#feedback_screen').css({"background-image":"url('./image/gameover.jpg')"});
        self.leaderboard.push(self.player);
        fsm.lose();
      }
    }

    //function to animate the fade in fade out of the bloodsplat on player
    function bloodsplat(movespeed){
      $(".bloodsplat>img").fadeIn(100).fadeOut(100);
    }

//2,7 and 0,4
    function updateLeaderboard(){
      var length;
      if(self.playerArray.length<4){
        length = self.playerArray.length;
      }else{
        length = 4;
      }
      for(var i=0; i<length;i++){
        var temp = "tr:nth-child(" + (i+2) + ")";
        var extended = temp + " td:nth-child(1)";
        var extended2 = temp + " td:nth-child(2)";
        var extended3 = temp + " td:nth-child(3)";
        $(extended).text(self.playerArray[i].name);
        $(extended2).text(self.playerArray[i].totalScore);
        $(extended3).text(self.playerArray[i].totalEnemiesKilled)
      }


    }

    this.restartGame = function(){
      self.hasGameStarted = false;
      $("#feedback_screen>h1").html("");
      self.currentLevel = 1;
      self.levelObject = self.reflectLevel(self.currentLevel);
      self.enemyArray = [];
      $('.enemy').remove();
      $('#okay').off();
      $('#story').off();
    }

    //function to calculate accuracy
    function calculateAccuracy(){
      var player = self.player;
      player.accuracy = player.bulletsHitCount/(++player.bulletsShot) * 100;
      console.log("accuracy", player.accuracy, "bulletsHitCount", player.bulletsHitCount, "bulletsShot", player.bulletsShot);
    }

    //pls replace all these console.log into feedbackkkkkk later
    function accuracyBonus(){
      if(self.player.accuracy === 100){
        self.currentBonus = self.player.accuracy*5;
        console.log("superb!")
      }else if(self.player.accuracy > 80){
        self.currentBonus = self.player.accuracy*2;
      }else{
        console.log("no bonus for you :/");
      }
    }

    //function to create unlimited instructions based on the instruction object
    this.createInstructions = function(){
      $(".instruction>.temp").remove();
      console.log("temp removed, new instructions rendered");
      for(var i=0; i<self.levelObject.instruction.length;i++){
        $(".instruction").append("<div class='temp'><img class='instructionImg'><p></p></div>");
        var selector = $(".temp:last>p");
        var selector2 = $(".temp:last>img");
        selector.html(self.levelObject.instruction[i].des);
        var temp = self.levelObject.instruction[i].pic;
        selector2.css({"background-image": temp});
      }
    }



    // //only for chrome
    // function blinkingHealthBar(){
    //   console.log("blinkbarcalled")
    //   var color = $("-webkit-progress-value").css("background-color");
    //   $("-webkit-progress-value").css({"background":"red"});
    //   setTimeout(function(){
    //     $("-webkit-progress-value").css({"background":color})
    //   },300)
    // }

  }
