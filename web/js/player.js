Crafty.c("Player",{
    lives:3,
    score:0,
    weapon:{
        firerate:5,
        name:"Weapon1",
        overheated:false
    },
    powerups:{},
    ship:"ship1",
    preparing:true,
    bounce:false,
    maxX : 200,
    maxY: 330,
    minX : 40,
    minY: 200,
    pause: false,
    init:function(){
     
        var stage = $('#cr-stage');
        var keyDown = false; //Player didnt pressed a key
        this.requires("2D,Canvas,"+this.ship+",Multiway,Keyboard,Collision,Flicker") /*Add needed Components*/
        .bind('Moved', function(from) { /*Bind a function which is triggered if player is moved*/
            /*Dont allow to move the player out of Screen*/
            if(this.x+this.w > Crafty.viewport.width ||
                this.x+this.w < this.w || 
                this.y+this.h-35 < this.h || 
                this.y+this.h+35 > Crafty.viewport.height || this.preparing){
                this.attr({
                    x:from.x, 
                    y:from.y
                });
            }
          
        })
        .bind("KeyDown", function(e) {
            if(!this.pause) {
                if(e.keyCode === Crafty.keys.SPACE){
                    keyDown = true;
                } 
                if (e.key == "ArrowLeft") {
                    if(this.x > this.minX) {
                         this.x = this.x-10;
                    }
          
                } else if (e.key == "ArrowRight") {
                    if(this.x < this.maxX) {
                                 this.x = this.x+10;
                    }
                  
                } else if (e.key == "ArrowUp") {
                    if(this.y > this.minY) {
                          this.y = this.y-10;
                    }
                 
                } else if (e.key == "ArrowDown") {
                     if(this.y < this.maxY) {
                         this.y = this.y+10;
                    }
                  
                }
            }
        })
        .bind("KeyUp", function(e) {
            if(!this.pause) {
                if(e.keyCode === Crafty.keys.SPACE){
                    keyDown = false;
                } 
            }
        })
        .bind("EnterFrame",function(frame){
            if(!this.pause) {
            if(frame.frame % this.weapon.firerate == 0){
               
                if(keyDown && !this.weapon.overheated){
                    this.shoot();
                }
            }
            if(this.preparing){
                this.preparing = false;
                    this.flicker=false;
            }
        }
            
        })
        .onHit("EnemyBullet",function(ent){
            var bullet = ent[0].obj;
            this.die();
            bullet.destroy();
        })
        .bind("PauseReset", function(){
            if(this.pause) {
               this.pause = false;
            }
            else {
                this.pause = true;
            }
        })
        .bind("botKilled",function(){
           this.destroy();
        
        })
        return this;
    },
    shoot:function(){ 
        if(this.preparing) return;
            var bullet = Crafty.e(this.weapon.name,"PlayerBullet");
            bullet.attr({
                playerID:this[0],
                x: this._x+50,
                y: (this._y-this._h/2) + 40,
                rotation: this._rotation,
                yspeed: 10 * Math.sin(this._rotation / (180 / Math.PI)),
                xspeed: 10 * Math.cos(this._rotation / (180 / Math.PI))
            }); 
           
    },
    die:function(){
        Crafty.e("RandomExplosion").attr({
            x:this.x,
            y:this.y
        });
        Crafty.trigger("ReduceScore", 10);
        Crafty.trigger("UpdateScore");
        this.destroy();
        Crafty.trigger("playerKilled");
        Crafty.trigger("enableStart");
    },
    destroyPlayer:function(){
        this.destroy();
    }
    
});
