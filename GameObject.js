//game functions and game objects, game loop. my subset of the game machine
  function startGame(){
    //FINAL VARIABLES
    this.ZOMBIES = {
      baby: {hp:1, attack: 5, image:"./image/babyZombie.png", width:"", height:"", score: 10 },
      teen: {hp:2, attack: 10, image:"./image/zombie.png", width:"", height:"", score: 20  },
      zombie:{hp:3, attack: 15, image:"./image/adultZombie.png", width:"", height:"", score: 30},
      madScientist:{hp:20, attack: 20, image:"", width:"", height:"", score: 40},
    };

    this.LEVELS = [
      {level:1, image:"./image/gameBackground.png", prestory:"this is the first forest", zombie: "baby", kill: 5, spawnNo: 1, interval: 2000},
      {level:2, image:"./image/gameBackground2.png", prestory:"you go on to the next forest!", zombie: "teen", kill: 5, spawnNo:2, interval: 2000},
      {level:3, image:"", prestory:"the third forest", zombie:"teen", kill: 5, spawnNo: 2, interval: 2000},
      {level:4, image:"", prestory:"the fourth forest", zombie:"zombie", kill: 15, spawnNo: 3, interval: 1000},
      {level:5, image:"", prestory:"the fifth forest", zombie:"madScientist", kill: 15, spawnNo: 2, interval: 1000},
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
    }

    this.createPlayer = function(user){
      var player = new Player(user);
      self.playerArray.push(player);
      self.player = self.playerArray[self.playerArray.length-1];
      console.log(self.player);
    }

    //function to load stories, objects, etc. returns the level object
    function reflectLevel(level){
      var levelArray = $.grep(self.LEVELS, function(e){
        return e.level === level;
      })
      $(".shootRange").css("background-image", "url(" + levelArray[0].image + ")");
      $("#story>p").text(levelArray[0].prestory);
      self.killNeeded = levelArray[0].kill;
      console.log("score",self.killNeeded);
      return levelArray[0];
    };

    function spawnEnemy(){
      //horizontal appearance
      var randomNo = Math.random()*90;
      //vertical appearance
      var randomNo2 = Math.random()*80;
      $('.shootRange').append('<div class="enemy">');
      var lastEnemy = $('.enemy:last');
      var index = movingEnemy(lastEnemy);
      var zombie = self.ZOMBIES[self.levelObject.zombie];
      console.log(zombie);
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
      self.levelObject = reflectLevel(self.currentLevel);
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

      $('#pause').css("background-image","url('./image/pause.png')");
      for(var i=0; i<self.enemyArray.length; i++){
        var selector = self.enemyArray[i].selector;
        self.enemyArray[i].index = movingEnemy(selector);
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
    function movingEnemy(something){
      var index = setInterval(function(){
        var random = Math.random();
        var topPosition = parseInt(something[0].style.top);
        var leftPosition = parseInt(something[0].style.left);

        if(random<0.33 && leftPosition <= 85.1){
          $(something).animate({
            'left': "+=5%",
          },500,"linear");
        }else if(random<0.66 && topPosition <= 80.1){
          $(something).animate({
            'top':"+=5%",
          },500,"linear");
        }else if(leftPosition>2){
          $(something).animate({
            'left':"-=5%",
          },500,"linear");
        }
        if(topPosition >= 80){
          self.player.health -= 5;
          bloodsplat();
          $('#health').prop("value",self.player.health);
          $('#ouch')[0].play();
          console.log(self.player.health);
          died();
        }
      }, 500)
      return index;
    }

    //check if zombie killed, and kill the zombie
    function zombieOnClick(selector, enemy){
      selector.click(function(){
        $("#hit")[0].play();
        enemy.clicks++;
        self.player.bulletsHitCount++;
        console.log("enemy times clicked:", enemy.clicks);

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
        console.log("passed!");
        self.currentLevel++;
        reflectLevel(self.currentLevel);



        for(var i=0;i<self.enemyArray.length; i++){
          (self.enemyArray[i].selector).remove();
        }
        self.pauseGame();
        updateAttributes();
        $('#playing_screen').hide();

        $('#feedback_screen').show();
        $('#to_nextlevel').click(function(){
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
      $("#player1-score>span:last").html(self.player.totalScore);

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
        self.leaderboard.push(self.player);
        fsm.lose();
      }
    }

    //function to animate the fade in fade out of the bloodsplat on player
    function bloodsplat(){
      $(".bloodsplat>img").fadeIn("fast").fadeOut("fast");
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
        $(extended).text(self.playerArray[i].name);
      }


    }

    this.restartGame = function(){
      self.hasGameStarted = false;
      $("#feedback_screen>h1").html("");
      self.currentLevel = 1;
      self.levelObject = reflectLevel(self.currentLevel);
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

  }
