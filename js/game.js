var config = {
    type: Phaser.AUTO,
    width: 336,
    height: 483,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const assets = {
    pipe:{
        top: 'pipe-top',
        bottom: 'pipe-bottom'
    }
}
var game = new Phaser.Game(config);
var bird;
var gameOver;
var gameStarted;
var framesMove = 0;
var player;
var cursors;
var space;
var nextPipe;
var currentPipe;
var scoreGroup;
var score;
var rank = [];
var rankIndex = 0;
var max = 0;
var starPoint = 0;
var gapPoint = 0;
var flag;

function preload ()
{
    this.load.image('title', 'images/main.png');
    this.load.image('gameStartButton', 'images/play.png')
    this.load.image('rankingButton', 'images/ranking.png')
    this.load.image('OK', 'images/ok.jpg')
    this.load.image('rank', 'images/rank.png')
    this.load.image('title_bird', 'images/title_bird.png')
    
    //배경 및 땅
    this.load.image('background', 'images/background.png');
    this.load.spritesheet('ground', 'images/ground-sprite.png', {
        frameWidth: 336,
        frameHeight: 112
    });

    //시작화면
    this.load.image('Initial_Message', 'images/initial-message.png')

    //파이프
    this.load.image(assets.pipe.top, 'images/pipe-top.png');
    this.load.image(assets.pipe.bottom, 'images/pipe-bottom.png');

    //새
    this.load.spritesheet('bird', 'images/bird.png', {
        frameWidth: 40,
        frameHeight: 29
    });

    //메달
    this.load.image('gold', 'images/medal/gold.png');
    this.load.image('silver', 'images/medal/silver.png');
    this.load.image('bronze', 'images/medal/bronze.png');
    this.load.image('ranking', 'images/ranking.png');
    
    //숫자
    this.load.image('number0', 'images/number0.png');
    this.load.image('number1', 'images/number1.png');
    this.load.image('number2', 'images/number2.png');
    this.load.image('number3', 'images/number3.png');
    this.load.image('number4', 'images/number4.png');
    this.load.image('number5', 'images/number5.png');
    this.load.image('number6', 'images/number6.png');
    this.load.image('number7', 'images/number7.png');
    this.load.image('number8', 'images/number8.png');
    this.load.image('number9', 'images/number9.png');

    //기록용 숫자
    this.load.image('num0', 'images/small0.png');
    this.load.image('num1', 'images/small1.png');
    this.load.image('num2', 'images/small2.png');
    this.load.image('num3', 'images/small3.png');
    this.load.image('num4', 'images/small4.png');
    this.load.image('num5', 'images/small5.png');
    this.load.image('num6', 'images/small6.png');
    this.load.image('num7', 'images/small7.png');
    this.load.image('num8', 'images/small8.png');
    this.load.image('num9', 'images/small9.png');

    //결과 화면
    this.load.image('gameOverCard', 'images/gameOver.png');
    this.load.image('restart', 'images/restart-button.png');
    this.load.image('scoreBoard', 'images/score_board.png');
    this.load.image('menu', 'images/menu.jpg');

    this.load.image('star', 'images/star.png');
}

function create ()
{
    title = this.add.image(168, 241, 'title').setInteractive()
    title.setDepth(40)
    title.visible = true

    titleBird = this.add.image(168, 250, 'title_bird')
    titleBird.setDepth(40)
    titleBird.visible = true

    gameStartButton = this.add.image(108, 350, 'gameStartButton').setInteractive()
    gameStartButton.setDepth(40)
    gameStartButton.visible = true
    gameStartButton.on('pointerdown', game_start);

    rankingButton = this.add.image(229, 350, 'rankingButton').setInteractive()
    rankingButton.setDepth(40)
    rankingButton.visible = true
    rankingButton.on('pointerdown', show_ranking);

    rank_list = this.add.image(230, 145, 'rank')
    rank_list.setDepth(40)
    rank_list.visible = false

    background = this.add.image(168, 241, 'background').setInteractive();
    background.on('pointerdown', moveBird);

    gapsGroup = this.physics.add.group();
    pipe = this.physics.add.group();
    medal = this.physics.add.staticGroup();
    ranking = this.physics.add.staticGroup();
    ranking_score = this.physics.add.staticGroup();
    scoreGroup = this.physics.add.staticGroup();
    scoreGroup2 = this.physics.add.staticGroup();
    scoreGroup3 = this.physics.add.staticGroup();
    star = this.physics.add.group();
    starPicture = this.physics.add.staticGroup();
    starScore = this.physics.add.staticGroup();
    

    ground = this.physics.add.sprite(168, 500, 'ground');
    ground.setCollideWorldBounds(true);
    ground.setDepth(10);

    Initial_Message = this.add.image(168, 161, 'Initial_Message');
    Initial_Message.setDepth(30);
    Initial_Message.visible = false;

    okButton = this.add.image(168, 350, 'OK').setInteractive();
    okButton.setDepth(40)
    okButton.visible = false
    okButton.on('pointerdown', ok)

    space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    //땅 움직임
    this.anims.create({
        key: 'ground-moving',
        frames: this.anims.generateFrameNumbers('ground', {
            start: 0,
            end: 2
        }),
        frameRate: 15,
        repeat: -1
    })
    this.anims.create({
        key: 'ground-stop',
        frames: [{
            key: 'ground',
            frame: 0
        }],
        frameRate: 20
    })
    
    //새 움직임
    this.anims.create({
        key: 'bird-fly',
        frames: this.anims.generateFrameNumbers('bird', { 
            start: 0, 
            end: 2 
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'bird-stop',
        frames: [{
            key: 'bird',
            frame: 1
        }],
        frameRate: 20
    })

    main(this)
    
    gameOverCard = this.add.image(168, 120, 'gameOverCard');
    gameOverCard.setDepth(20);
    gameOverCard.visible = false;

    scoreBoard = this.add.image(168, 250, 'scoreBoard');
    scoreBoard.setDepth(20);
    scoreBoard.visible = false;

    restartButton = this.add.image(108, 370, 'restart').setInteractive();
    restartButton.setDepth(20);
    restartButton.visible = false;
    restartButton.on('pointerdown', restart);

    menuButton = this.add.image(228, 370, 'menu').setInteractive();
    menuButton.setDepth(20);
    menuButton.visible = false;
    menuButton.on('pointerdown', menu);
}

function update (){
    if (gameOver || !gameStarted){
        return
    }
    if(framesMove > 0){
        framesMove--;
    }
    else if(Phaser.Input.Keyboard.JustDown(space)){
        moveBird();
    }
    else{
        //앵글 조정
        if(player.angle > 30){
            player.angle = 90
        }
        player.angle = player.angle + 1
    }

    star.children.iterate(function (child){
        if(child == undefined){
            return;
        }
        if(child.x < -50){
            child.destroy();
        }
        else{
            child.setVelocityX(-100);
        }
    })

    pipe.children.iterate(function (child){
        if(child == undefined){
            return;
        }
        if(child.x < -50){
            child.destroy();
        }
        else{
            child.setVelocityX(-100);
        }
    })
    
    gapsGroup.children.iterate(function (child) {
        child.body.setVelocityX(-100)
    })
    
    nextPipe++;
    if(nextPipe == 130){
        makePipe(game.scene.scenes[0])
        nextPipe = 0;
    }
    
}

function ok(){
    ranking_score.clear(true, true)
    okButton.visible = false
    ranking_score.visible = false
    rank_list.visible = false
    menu()
}

function main(scene){
    PrepareGame(scene)
}

function menu(){
    ranking_score.clear(true, true)

    title.visible = true
    gameStartButton.visible = true
    rankingButton.visible = true
    
    titleBird.visible = true

}

function show_ranking(){
    ranking_score.clear(true, true)
    gameStartButton.visible = false
    rankingButton.visible = false
    okButton.visible = true
    titleBird.visible = false
    rank_list.visible = true
    // console.log(rank)
    if(rankIndex < 7){
        for(let i = 0, k = 0; i < rankIndex; i++, k++){
            const rankScore = rank[i].toString()
            if(rankScore.length == 1){
                ranking_score.create(184, 45 + k *45, 'num'+rank[i]).setDepth(40)
            }
            else{
                let initialPosition = 184 - ((score.toString().length * 7) / 2)

                for(let i = 0; i < rankScore.length; i++){
                    ranking_score.create(initialPosition, 45 + k *45, 'num' + rankScore[i]).setDepth(40)
                    initialPosition = initialPosition + 15
                }
            }
        }
    }
    else{
        for(let i = 0, k = 0; i < 6; i++, k++){
            const rankScore = rank[i].toString()
            if(rankScore.length == 1){
                ranking_score.create(184, 45 + k *45, 'num'+rank[i]).setDepth(40)
            }
            else{
                let initialPosition = 184 - ((score.toString().length * 7) / 2)

                for(let i = 0; i < rankScore.length; i++){
                    ranking_score.create(initialPosition, 45 + k *45, 'num' + rankScore[i]).setDepth(40)
                    initialPosition = initialPosition + 15
                }
            }
        }
    }
}

function game_start(){
    title.visible = false
    gameStartButton.visible = false
    rankingButton.visible = false
    titleBird.visible = false
    restart()
}

function PrepareGame(scene){
    framesMove = 0;
    gameOver = false;
    nextPipe = 0;
    score = 0;
    currentPipe = assets.pipe;
    background.visible = true
    Initial_Message.visible = true;

    player = scene.physics.add.sprite(60, 200, 'bird');
    player.setCollideWorldBounds(true);
    player.anims.play('bird-fly', true);
    player.body.allowGravity = false;
    

    scene.physics.add.collider(player, ground, hitBird, null, scene)
    scene.physics.add.collider(player, pipe, hitBird, null, scene)
    scene.physics.add.overlap(player, star, collectStar, null, scene)
    scene.physics.add.overlap(player, gapsGroup, updateScore, null, scene)
    

    ground.anims.play('ground-moving', true);

}

function updateScore(_, gap) {
   
    score++
    gap.destroy()
    // console.log(score)
    
    scoreGroup.clear(true, true)
    const scoreString = score.toString()
    //  console.log(scoreString.length)
    if (scoreString.length == 1){
        scoreGroup.create(168, 60, 'number'+ score).setDepth(10)
        // console.log('number'+score)
    }
    else{
        let initialPosition = 168 - ((score.toString().length * 25) / 2)

        for(let i = 0; i < scoreString.length; i++){
            scoreGroup.create(initialPosition, 60, 'number'+scoreString[i]).setDepth(10)
            initialPosition = initialPosition + 30
        }
    }
}


function moveBird(){
    if(gameOver){
        return
    }
    if (!gameStarted){
        startGame(game.scene.scenes[0])
    }
    player.setVelocityY(-350);
    player.angle = -15;
    framesMove = 6;
}

function hitBird(player){
    player.angle = 90;
    this.physics.pause();
    gameOver = true;
    gameStarted = false;
    scoreGroup2.clear(true, true)
    player.anims.play('bird-stop');
    ground.anims.play('ground-stop');
    
    rank[rankIndex] = score;
    // console.log(rank[rankIndex])

    const scoreString1 = rank[rankIndex].toString()
    if (scoreString1.length == 1){
        scoreGroup2.create(250, 235, 'num' + score).setDepth(30)
    }
    else{
        let initialPosition = 250 - ((score.toString().length * 7) / 2)

        for(let i = 0; i < scoreString1.length; i++){
            scoreGroup2.create(initialPosition, 235, 'num' + scoreString1[i]).setDepth(30)
            initialPosition = initialPosition + 15
        }
    }
    
    //best score 구하기
    for(let j = 0; j <= rankIndex; j++){
        if(rank[j] > max){
            max = rank[j]   
        }
    }
    
    scoreGroup3.clear(true, true)
    const scoreString2 = max.toString()
    if (scoreString2.length == 1){
        scoreGroup3.create(250, 285, 'num' + max).setDepth(30)

    }
    else{
        let initialPosition = 250 - ((max.toString().length * 7) / 2)
        
        for(let i = 0; i < scoreString2.length; i++){
            scoreGroup3.create(initialPosition, 285, 'num' + scoreString2[i]).setDepth(30)
            initialPosition = initialPosition + 15
        }
    }

    //중복이 없으면 인덱스 증가
    for(let i = 0; i < rank.length; i++){
        for(let j = i+1; j < rank.length; j++){
            if(rank[i] == rank[j]){
                flag = true
            }
        }
    }
    if(flag == false){
        rankIndex++
    }


    //오름차순 정렬
    rank.sort(function(a, b){
        return b - a;
    })
    //중복 제거
    rank = rank.reduce((a, b) => {
        if(a.indexOf(b) < 0) a.push(b);
        return a;
    }, []);
    //메달 주기
    for(let k = 0; k <= rankIndex; k++){
        if(score == rank[0]){
            medal.create(92, 245, 'gold').setDepth(30);
        }
        else if(score == rank[1]){
            medal.create(92, 245, 'silver').setDepth(30);
        }
        else if(score == rank[2]){
            medal.create(92, 245, 'bronze').setDepth(30);
        }
    }

    scoreBoard.visible = true;
    gameOverCard.visible = true;
    restartButton.visible = true;
    menuButton.visible = true;
}

function makePipe(scene){
    if (!gameStarted || gameOver){
        return
    }
    const pipeTopY = Phaser.Math.Between(-70, 120)
    
    const gap = scene.add.line(336, pipeTopY + 175, 0, 0, 0, 98)
    gapsGroup.add(gap)
    
    gap.body.allowGravity = false
    gap.visible = false

    const pipeTop = pipe.create(336, pipeTopY, currentPipe.top)
    pipeTop.body.allowGravity = false

    const pipeBottom = pipe.create(336, pipeTopY + 350, currentPipe.bottom)
    pipeBottom.body.allowGravity = false

    //별 랜덤
    const starRandom = Phaser.Math.Between(50,200)
    const random = Phaser.Math.Between(1,2)
    if(random == 2){
        const point = star.create(450, starRandom, 'star')
        point.body.allowGravity = false
    }

}
function collectStar(player, star){
    star.disableBody(true, true);
    starPoint = starPoint + 1;
    // console.log(starPoint)
    starPicture.create(30, 30, 'star').setDepth(30)
    starScore.clear(true, true)
    const starString = starPoint.toString()
    if (starString.length == 1){
        starScore.create(30, 60, 'num'+ starPoint).setDepth(30)
    }
    else{
        let initialPosition = 168 - ((score.toString().length * 25) / 2)

        for(let i = 0; i < scoreString.length; i++){
            starScore.create(initialPosition, 60, 'num'+starString[i]).setDepth(10)
            initialPosition = initialPosition + 30
        }            
    }

    if(starPoint == 3){
        score = score + 2
        scoreGroup.clear(true, true)
        const scoreString = score.toString()
        if (scoreString.length == 1){
            scoreGroup.create(168, 60, 'number'+ score).setDepth(10)
        }
        else{
            let initialPosition = 168 - ((score.toString().length * 25) / 2)

            for(let i = 0; i < scoreString.length; i++){
                scoreGroup.create(initialPosition, 60, 'number'+scoreString[i]).setDepth(10)
                initialPosition = initialPosition + 30
            }            
        }
        
        starPoint = 0;
    }  
}

function startGame(scene) {
    gameStarted = true
    Initial_Message.visible = false
    player.body.allowGravity = true;
    player.body.setGravityY(900);
    starPoint = 0;
    
    starPicture.create(30, 30, 'star').setDepth(30)
    const star_Score = starScore.create(30, 60, 'num0')
    star_Score.setDepth(20)
    const startScore = scoreGroup.create(168, 60, 'number0')
    startScore.setDepth(20)

    makePipe(scene);
}

function restart(){
    pipe.clear(true, true);
    star.clear(true, true);
    gapsGroup.clear(true, true);
    medal.clear(true, true);
    starPicture.clear(true, true);
    starScore.clear(true, true);
    scoreGroup.clear(true, true);
    scoreGroup2.clear(true, true);
    scoreGroup3.clear(true, true);
    ranking.clear(true, true);
    ranking_score.clear(true, true);
    player.destroy();

    flag = false
    scoreBoard.visible = false;
    gameOverCard.visible = false;
    restartButton.visible = false;
    menuButton.visible = false;


    PrepareGame(game.scene.scenes[0]);

    game.scene.scenes[0].physics.resume();
}