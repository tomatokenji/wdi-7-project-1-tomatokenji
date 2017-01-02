//game functions and game objects, game loop. my subset of the game machine
  function startGame(){
    this.scoreNeeded = 5;
    this.currentLevel = 1;
    this.enemyArray = [];
    this.health = 100;
    this.playerArray = [];
    this.enemiesKilled = 0;
    this.totalScore = 0;
    this.totalEnemiesKilled = 0;
    this.startGameIndex = null;
    this.hasGameStarted = false;

    var self = this;

    //FINAL VARIABLES
    this.ZOMBIES = {
      baby: {hp:1, attack: 5, image:"", width:"", height:""},
      teen: {hp:2, attack: 10, image:"./image/zombie.png", width:"", height:"" },
      zombie:{hp:3, attack: 15, image:"", width:"", height:""},
      bossZombie:{hp:20, attack: 20, image:"", width:"", height:""},
    };

    this.LEVELS = [
      {level:1, image:"./image/gameBackground.png", prestory:"this is the first forest", zombie: "baby", kill: 5, spawnNo: 1, interval: 2000},
      {level:2, image:"./image/gameBackground2.png", prestory:"you go on to the next forest!", zombie: "teen", kill: 15, spawnNo:2, interval: 1000},
      {level:3, image:"", prestory:"the third forest", zombie:"teen", kill: 15, spawnNo: 3, interval: 1000},
      {level:4, image:"", prestory:"the fourth forest", zombie:"zombie", kill: 15, spawnNo: 3, interval: 1000},
      {level:5, image:"", prestory:"the fifth forest", zombie:"bossZombie", kill: 15, spawnNo: 2, interval: 1000},
    ];

    this.WEAPONS = [
      {name: "pistol", damage: 2, bullets: 200},
      {name:"shotgun", damage: 5, bullets: 50},
    ];

    //GAME OBJECTS
    function Enemy(zombie, index, selector){
      this.zombie = zombie;
      this.index = index;
      this.selector = selector;
    };

    function Player(name){
      this.name = name;
      this.icon = 0;
      this.score = 0;
      this.weapons = [WEAPONS[0]];
    }


    //function to load stories, objects, etc. returns the level object
    function reflectLevel(level){
      var levelObject = $.grep(self.LEVELS, function(e){
        return e.level === level;
      })
      $(".shootRange").css("background-image", "url(" + levelObject[0].image + ")");
      $("#story>p").text(levelObject[0].prestory);
      self.scoreNeeded = levelObject[0].kill;
      return levelObject[0];
    };

    function spawnEnemy(){
      //horizontal appearance
      var randomNo = Math.random()*90;
      //vertical appearance
      var randomNo2 = Math.random()*80;
      $('.shootRange').append('<div class="enemy">');
      var lastEnemy = $('.enemy:last');
      var index = movingEnemy(lastEnemy);
      var zombie = self.ZOMBIES.teen;
      console.log(zombie);
      var newZombie = new Enemy(zombie, index, lastEnemy);
      newZombie.clicks = 0;
      $(lastEnemy).css({
          'left':randomNo+'%',
          'top':randomNo2+'%',
      });
      zombieOnClick(lastEnemy, newZombie);
      self.enemyArray.push(newZombie);
    }

    //function for game logic
    this.chapterStart = function(){
      var levelObject = reflectLevel(self.currentLevel);
      self.startGameIndex = levelEnemySpawn(levelObject.spawnNo, levelObject.interval);
    }

    this.pauseGame = function(){
      clearInterval(self.startGameIndex);
      for(var i=0; i<self.enemyArray.length; i++){
        clearInterval(self.enemyArray[i].index);
      }
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
          self.health -= 5;
          console.log(self.health);
          $('#health').prop("value",self.health);
        }
      }, 500)
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
          self.enemiesKilled++;
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
      self.totalScore += self.enemiesKilled;
      self.totalEnemiesKilled += self.enemiesKilled;
      self.enemiesKilled = 0;
      self.health = 100;
      self.enemyArray = [];
    }


  }
