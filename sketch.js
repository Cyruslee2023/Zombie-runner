var PLAY = 1;
var END = 0;
var gameState = PLAY;
var bgImg;
var p1,player;
var gameOverImg, restartImg;
var score;
var life = 3;
var eat = 0;
var appleImg, bananaImg, meatImg;

var gameOver, restart;
var collidedImg;

var collisionSound, dieSound, biteSound;

function preload(){
bk=loadImage("assets/bg.avif")
zombie1=loadAnimation("assets/z1.png","assets/z2.png","assets/z3.png","assets/z4.png","assets/z5.png","assets/z6.png")
p1=loadAnimation("assets/pc1.png","assets/pc2.png","assets/pc3.png","assets/pc4.png","assets/pc5.png");
gameOverImg=loadImage("assets/gameOver.png");
restartImg=loadImage("assets/restart.png");
appleImg=loadImage("assets/apple.png");
bananaImg=loadImage("assets/banana.png");
meatImg=loadImage("assets/meat.png");
collisionSound=loadSound("assets/collision.mp3");
dieSound=loadSound("assets/ending.mp3");
biteSound=loadSound("assets/bite.mp3");
o1=loadImage("assets/obstacle1.png");
o2=loadImage("assets/obstacle2.png");
collidedImg=loadImage("assets/pc1.png");
zombie2=loadAnimation("assets/z2-1.png","assets/z2-2.png","assets/z2-3.png","assets/z2-4.png","assets/z2-5.png","assets/z2-6.png","assets/z2-7.png");
}

function setup(){
createCanvas(1360,600)
zombie=createSprite(250,450,20,20);
zombie.addAnimation("zombie",zombie1)
zombie.scale=0.3

player=createSprite(500,418.5,20,20);
player.addAnimation("player",p1);
player.addImage("collided",collidedImg);
player.scale=0.5

ground = createSprite(500,510,1360,5);
ground.shapeColor = "black"
ground.visible = false;

gameOver = createSprite(600,300);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.1;


restart = createSprite(590,360);
restart.addImage(restartImg);
restart.scale = 0.2;

obstaclesGroup = new Group();
zombieGroup = new Group();
foodGroup = new Group();

player.setCollider("rectangle",-50,85,170,200);
//player.debug = true;

score = 0;

}

function draw(){
    background(bk);
    textSize(30);
    fill("yellow")
    text("Score: " + score, 1000, 50);

    textSize(30);
    fill("orange")
    text("Life: " + life, 1200, 50);

    textSize(30);
    fill("aqua")
    text("Food: " + eat, 800, 50);


    if(gameState === PLAY){
        gameOver.visible = false;
        restart.visible = false;
        if(ground.x < 0){
            ground.x = ground.width/2;
        }

        ground.velocityX = -(4 + 3*score/100);
        score = score + Math.round(frameCount/190);

    }

    if(keyDown("up_arrow") && player.y >= 230){
        player.velocityY = -10;
    }
    player.velocityY = player.velocityY + 1.8
    
    if(foodGroup.isTouching(player)){
        biteSound.play();
        eat = eat+2;
        foodGroup.destroyEach();

    }



    if(obstaclesGroup.isTouching(player) || zombieGroup.isTouching(player)){
        life = life-1;
        collisionSound.play();
        obstaclesGroup.destroyEach();
        zombieGroup.destroyEach();
        //player.destroy();
        if(life <= 0){
            gameState = END;
            dieSound.play();
        }
    

    }
    else if(gameState === END){
        gameOver.visible = true;
        restart.visible = true;
        player.changeImage("collided",collidedImg);
        obstaclesGroup.setLifetimeEach(-1);
        zombieGroup.setLifetimeEach(-1);
        obstaclesGroup.setVelocityXEach(0);
        zombieGroup.setVelocityXEach(0);
        player.velocityX = 0;
        ground.velocityX = 0;
        foodGroup.destroyEach();
        foodGroup.setVelocityXEach(0);
        

    }

    if(mousePressedOver(restart)){
        reset()
    }


    player.collide(ground);
    spawnObstacles();
    danger();
    spawnFood();
    drawSprites();


    if(mousePressedOver(restart)){
        reset()
    }

}

function spawnObstacles(){
    if(frameCount %200 === 0){
    var obstacle = createSprite(950,490,20,20);
    obstacle.velocityX = -5
    var r1 = Math.round(random(1,2))
    switch(r1){
        case 1: obstacle.addImage(o1);
        break;
        case 2: obstacle.addImage(o2);
        break;
        default: break;
    }
    obstacle.scale = 0.15;
    obstacle.lifetime = 125;
    obstaclesGroup.add(obstacle);

}
}

function danger(){
    if(frameCount %300 === 0){
        var zomb = createSprite(1000,460,20,20);
        zomb.velocityX = -5
        zomb.addAnimation("zombie",zombie2);  
        zomb.scale = 0.3;
        zomb.lifetime = 125;
        zombieGroup.add(zomb);
    }
}

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    obstaclesGroup.destroyEach();
    zombieGroup.destroyEach();
    player.changeAnimation("player",p1);
    score = 0;
    life = 3;
    
}

function spawnFood(){
    if(frameCount %120 === 0){
    var food = createSprite(950,random(150,350),20,20);
    food.velocityX = -5
    var rand = Math.round(random(1,3))
    switch(rand){
        case 1: food.addImage(appleImg);
        break;
        case 2: food.addImage(meatImg);
        break;
        case 3: food.addImage(bananaImg);
        break;
        default: break;
    }
    food.scale = 0.1;
    food.lifetime = 125;
    foodGroup.add(food);

}
}