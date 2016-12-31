var game = new Phaser.Game(400, 400, Phaser.AUTO, 'game',
    { preload: preload, create: create, update: update });

var player, player2, keyboard;
var leftWall, rightWall, ceiling;
var text1, text2, overText, startText, music;
var flag = "stop";
var lastTime = 0;
var platforms = [];

function preload () {
    game.load.baseURL = 'http://s.ntustcoding.club/ns-shaft-workshop/';
    game.load.crossOrigin = 'anonymous';
    game.load.spritesheet('player', 'player.png', 32, 32); // 主角
    game.load.image('wall', 'wall.png'); // 牆壁
    game.load.image('ceiling', 'ceiling.png'); // 天花板的刺 
    game.load.image('normal', 'normal.png'); // 藍色平台
    game.load.image('nails', 'nails.png'); // 帶刺平台
    game.load.spritesheet('conveyorRight', 'conveyor_right.png', 96, 16); // 向右捲動的平台
    game.load.spritesheet('conveyorLeft', 'conveyor_left.png', 96, 16); // 向左捲動的平台
    game.load.spritesheet('trampoline', 'trampoline.png', 96, 22); // 彈簧墊
    game.load.spritesheet('fake', 'fake.png', 96, 36); // 翻轉的平台
}


function create () {
    keyboard = game.input.keyboard.addKeys({
        'left': Phaser.Keyboard.LEFT, 
        'right': Phaser.Keyboard.RIGHT,
        'a': Phaser.Keyboard.A,
        'd': Phaser.Keyboard.D,
        'enter': Phaser.Keyboard.ENTER
    });
    createWorld();
    startText = game.add.text(70, 190,"Press Enter to start",{fill:"red",fontSize:"30px",});
    overText = game.add.text(70, 190, "Game Over",{fill:"red",fontSize:"30px",});
    overText.visible = false;
}


function firstStart(){
    if(flag == "run"){
        startText.visible = false;
        createPlayer();
        text1 = game.add.text(300, 15, player.life,{fill:"red",});
        text2 = game.add.text(10, 15, player2.life,{fill:"red",});
    }
}


function createWorld(){
    leftWall = game.add.sprite(0, 0, 'wall');
    game.physics.arcade.enable(leftWall);
    leftWall.body.immovable = true;
    rightWall = game.add.sprite(383, 0, 'wall');
    game.physics.arcade.enable(rightWall);
    rightWall.body.immovable = true;
    
    ceiling = game.add.sprite(0, 0, 'ceiling');
}


function createPlayer() {
    player = game.add.sprite(300, 50, 'player');
    player2 = game.add.sprite(100, 50, 'player');

    setPlayer(player);
    setPlayer(player2);
}

function setPlayer(player){
    game.physics.arcade.enable(player);
    player.body.gravity.y = 500;
    player.animations.add('left', [0, 1, 2, 3], 8);
    player.animations.add('right', [9, 10, 11, 12], 8);
    player.animations.add('leftDrop', [18, 19, 20, 21], 12);
    player.animations.add('rightDrop', [27, 28, 29, 30], 12);
    player.animations.add('drop', [36, 37, 38, 39], 12);
    player.life = 10;
    player.unbeatableTime = 0;
    player.touchOn = undefined;
}

function createPlatforms () {
    var platform;
    var random = Math.random()*120;
    var x = Math.random() * (400 - 96 - 40) + 20;
    if(game.time.now > lastTime + 600) {
        if(random<20){
            platform = game.add.sprite(x, 400, 'conveyorRight');
            platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
            platform.animations.play('scroll');
        }else if(random<40){
            platform = game.add.sprite(x, 400, 'nails');
            game.physics.arcade.enable(platform);
            platform.body.setSize(96, 15, 0, 15);
        }else if(random<60){
            platform = game.add.sprite(x, 400, 'normal');
        }else if(random<80){
            platform = game.add.sprite(x, 400, 'conveyorLeft');
            platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
            platform.animations.play('scroll');
        }else if(random<100){
            platform = game.add.sprite(x, 400, 'trampoline');
            platform.animations.add('jump', [4, 5, 4, 3, 2, 1, 0, 1, 2, 3], 120);
        platform.frame = 3;
        }else if(random<120){
            platform = game.add.sprite(x, 400, 'fake');
            platform.animations.add('fake', [0, 1, 2, 3, 4, 5, 0], 16);
        }
        lastTime = game.time.now;
        game.physics.arcade.enable(platform);
        platform.body.checkCollision.down = false;
        platform.body.checkCollision.left = false;
        platform.body.checkCollision.right = false;
        platform.body.immovable = true;
        platforms.push(platform);
    }
}


function updatePlatforms () {
    for(var i=0; i<platforms.length; i++) {
        platforms[i].body.y -= 2;
        if(platforms[i].body.y<0){
            platforms[i].destroy();
            platforms.splice(i, 1);
        }
    }
}


function playerMoving(){
    if(keyboard.left.isDown) {
        player.body.velocity.x = -250;
    } else if(keyboard.right.isDown) {
        player.body.velocity.x = 250;
    } else {
        player.body.velocity.x = 0;
    }

    if(keyboard.a.isDown) {
        player2.body.velocity.x = -250;
    } else if(keyboard.d.isDown) {
        player2.body.velocity.x = 250;
    } else {
        player2.body.velocity.x = 0;
    }
    moving(player);
    moving(player2);
}


function moving(player){
    var x = player.body.velocity.x;
    var y = player.body.velocity.y;

    if (x < 0 && y > 0) {
        player.animations.play('leftDrop');
    }
    if (x > 0 && y > 0) {
        player.animations.play('rightDrop');
    }
    if (x < 0 && y == 0) {
        player.animations.play('left');
    }
    if (x > 0 && y == 0) {
        player.animations.play('right');
    }
    if (x == 0 && y != 0) {
        player.animations.play('drop');
    }
    if (x == 0 && y == 0) {
      player.frame = 8;
    }
}


function effect(player, platform) {
    if(platform.key == "conveyorLeft"){
        player.body.x -= 2;
    }else if(platform.key == "conveyorRight"){
        player.body.x += 2;
    }else if(platform.key == "trampoline"){
        platform.animations.play("jump");
        player.body.velocity.y = -350;
    }else if(platform.key == "nails"){
        if(player.touchOn !== platform){
            game.camera.flash(0xff0000, 50);
            player.life -= 1;
            player.touchOn = platform;
        }
    }else if(platform.key == "normal"){
        if(player.touchOn !== platform && player.life<10){
            player.life += 1;
            player.touchOn = platform;
        }
    }else if(platform.key == "fake"){
        setTimeout(function() {
            platform.animations.play("fake");
            platform.body.checkCollision.up = false;
        }, 100);
    }
}


function checkTouch(player) {
    if(player.body.y < 0) {
        if(player.body.velocity.y < 0) {
            player.body.velocity.y = 0;
        }
        if(game.time.now > player.unbeatableTime) {
            player.life -= 2;
            game.camera.flash(0xff0000, 50);
            player.unbeatableTime = game.time.now + 3000;
        }
    }
}


function checkDeath () {
    if(player.life <= 0 || player.body.y > 500) {
        gameOver("player2");
    }
    if(player2.life <= 0 || player2.body.y > 500) {
        gameOver("player1");
    }
    if(player.body.y > 500 && player2.body.y > 500){
        gameOver("none");
    }
    death = "death";
}


function gameOver(winner) {
    overText.visible = true;
    if(winner == "none"){
        overText.setText("No one is winner! \npress Enter restart");
    }else{
        overText.setText('Winner is ' + winner +"\npress Enter restart");
    }
    platforms.forEach(function(s) {s.destroy()});
    platforms = [];
    text1.setText("");
    text2.setText("");
    player.kill();
    player2.kill();
    flag = "stop";
}


function update () {
    if(flag == "run"){
        text1.setText("Life: "+player.life);
        text2.setText("Life: "+player2.life);
        
        this.physics.arcade.collide([player, player2], platforms, effect);   
        this.physics.arcade.collide([player, player2], [leftWall, rightWall]);
        this.physics.arcade.collide(player, player2);
        
        createPlatforms();
        updatePlatforms();
        playerMoving();
        checkTouch(player);
        checkTouch(player2);
        checkDeath();  
    }else if(keyboard.enter.isDown){
        console.log("enter is down");
        death = "alive";
        flag = "run";
        firstStart();
        if(overText.visible == true){
            overText.visible = false;
        }
    }
}
