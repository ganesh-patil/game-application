Crafty.c("Bot",{
    
    movementSpeed:30,
    lives:0,
    current:0,
    increasedY:100,
    score:0,
    weapon:{
        firerate:1,
        name:"BulletBot",
        overheated:false
    },
    powerups:{},
    ship:"bot1",
    preparing:true,
    bounce:false,
    up: true,
    hitScore:0,
    killScore:0,
    pause: false,
    init:function(){     
        var stage = $('#cr-stage');
        var keyDown = false; //Player didnt pressed a key
        this.requires("2D,Canvas,"+this.ship+",Multiway,Collision,Flicker") /*Add needed Components*/
        .bind("KeyUp", function(e) {
            if(e.keyCode === Crafty.keys.SPACE){
                keyDown = false;
            } 
        })
        .bind("EnterFrame",function(frame){
              // this.trigger("Shoot");
            if(!this.pause) {
              if(this.current %100 == 0) {
                if(this.up) {
                     this._y = this._y-30;
                     this.increasedY -= 30;
                }
                else {
                    this._y = this._y+30;
                    this.increasedY += 30;
                }
                if( this.increasedY <=0 ){
                   this.up = false;
                }
                if(this.increasedY >= 100) {
                    this.up = true;
                }
                   this.trigger("Shoot");
              }
              this.current++;
        
            if(this.preparing){
                this.preparing = false;
                this.flicker=false;
                
            }
        }
        })
        .bind("Shoot",function(){
            var bullet = Crafty.e("BulletBot","EnemyBullet");
            bullet.attr({
                  x: this._x+30,
                  y: (this._y-this._h/2) + 90,
                  rotation: this._rotation,
                  yspeed: this.weapon.firerate * Math.sin(this._rotation / (180 / Math.PI)),
                  xspeed: this.weapon.firerate * Math.cos(this._rotation / (180 / Math.PI))
            });   
        })
        .bind("Hurt",function(dmg){
            this.updateStats(this.hitScore);
        })
        .bind("playerKilled",function(){
           this.destroy();
        })
        .bind("PauseReset", function(){
            if(this.pause) {
               this.pause = false;
            }
            else {
                this.pause = true;
            }
        })
        .onHit("PlayerBullet",function(ent){
            var bullet = ent[0].obj;
            if(this.lives--) {
                this.trigger("Hurt",bullet.dmg);
            }
            else {
                this.updateStats(this.killScore);
                this.die();
            }
            bullet.destroy();
        })
        return this;
    },
    place: function(lives, hitScore,killScore,firerate){
        this.lives = lives;
        this.hitScore=hitScore;
        this.killScore=killScore;
        this.weapon.firerate = firerate;
    },
    die:function(){
        Crafty.e("RandomExplosion").attr({
            x:this.x,
            y:this.y
        });
        Crafty.trigger("UpdateScore");
        Crafty.trigger("UpdateLevel");
        this.destroy();
        Crafty.trigger("botKilled");
    },
    updateStats:function(score){
      Crafty.trigger("UpdateStats", score);
    }
    
});
