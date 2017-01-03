//game functions and game objects, game loop. my subset of the game machine
  function startGame(){
    //FINAL VARIABLES
    this.ZOMBIES = {
      baby: {hp:1, attack: 5, image:"./image/babyZombie.png", width:"", height:""},
      teen: {hp:2, attack: 10, image:"./image/zombie.png", width:"", height:"" },
      zombie:{hp:3, attack: 15, image:"./image/adultZombie.png", width:"", height:""},
      madScientist:{hp:20, attack: 20, image:"", width:"", height:""},
    };

    this.LEVELS = [
      {level:1, image:"./image/gameBackground.png", prestory:"this is the first forest", zombie: "baby", kill: 5, spawnNo: 1, interval: 2000},
      {level:2, image:"./image/gameBackground2.png", prestory:"you go on to the next forest!", zombie: "teen", kill: 5, spawnNo:2, interval: 2000},
      {level:3, image:"", prestory:"the third forest", zombie:"teen", kill: 5, spawnNo: 2, interval: 2000},
      {level:4, image:"", prestory:"the fourth forest", zombie:"zombie", kill: 15, spawnNo: 3, interval: 1000},
      {level:5, image:"", prestory:"the fifth forest", zombie:"madScientist", kill: 15, spawnNo: 2, interval: 1000},
    ];

    this.WEAPONS = [
      {name: "pistol", damage: 2, bullets: 200, sound: "./sounds/pistolsound.wav"},
      {name:"shotgun", damage: 5, bullets: 50, sound: ""},
    ];

    //game variables
    var self = this;
    this.scoreNeeded = null;
    this.currentLevel = 1;
    this.enemyArray = [];
    this.playerArray = [];
    this.enemiesKilled = 0; //go to player attribute.
    this.totalScore = 0; //go to player attribute.
    this.startGameIndex = null;
    this.hasGameStarted = false;
    this.levelObject = self.LEVELS[0];
    this.player = null;
    this.leaderboard = [];




    //GAME OBJECTS
    function Enemy(zombie, index, selector){
      this.zombie = zombie;
      this.index = index;
      this.selector = selector;
    };

    function Player(name){
      this.name = name;
      this.icon = null;
      this.totalScore = 0;
      this.totalEnemiesKilled = 0;
      this.health = 100;
      this.weapons = self.weapons;
      this.maxLevelReached = 0;
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
      self.scoreNeeded = levelArray[0].kill;
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
    }

    this.resumeGame = function(){
      for(var i=0; i<self.enemyArray.length; i++){
        self.enemyArray[i].index = movingEnemy(self.enemyArray[i].selector);
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
          $("#player1-score>span:last").html(++self.enemiesKilled);
          passLevel();
        }
      })
    }

    //b passing level
    function passLevel(){
      if(self.scoreNeeded <= self.enemiesKilled){
        self.currentLevel++;
        reflectLevel(self.currentLevel);
        self.pauseGame();
        for(var i=0;i<self.enemyArray.length; i++){
          (self.enemyArray[i].selector).remove();
        }
        updateAttributes();
        $('#playing_screen').hide();
        $('#feedback_screen').show();
        $('#to_nextlevel').click(function(){
          $('#feedback_screen').hide();
          $('#story').show();
          $('#to_nextlevel').off();
        })
      }
    }

    // a continuation of reflectLevel
    function updateAttributes(){
      self.player.totalScore += self.enemiesKilled;
      self.player.totalEnemiesKilled += self.enemiesKilled;
      $('#score').html(self.enemiesKilled);
      self.enemiesKilled = 0;
      self.player.health = 100;
      self.enemyArray = [];
      //to reflect Attributes on the feedback page
      $('#total-score').html(self.player.totalScore);
      gameObject.playerArray.sort(function(a,b){
        return b.totalScore - a.totalScore;
      });
      updateLeaderboard();
    }

    //function for shooting sound
    function shootingSound(){
      $("#playing_screen").click(function(){
        $("#shoot")[0].play();
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

  }
