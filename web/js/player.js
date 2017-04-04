Crafty.c("Player",{
    hp:{
        current:10,
        max:10,
        percent:100
    },
    shield:{
        current:10,
        max:10,
        percent:100
    },
    heat:{
        current:0,
        max:100,
        percent:0
    },
    movementSpeed:30,
    lives:3,
    score:0,
    weapon:{
        firerate:5,
        name:"Weapon1",
        overheated:false
    },
    powerups:{},
    ship:"ship1",
    bars:{},
    infos:{},
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
                }else{
                    if(this.heat.current > 0) //Cooldown the weapon
                        this.heat.current = ~~(this.heat.current*29/30); 
                }

                if(this.weapon.overheated && this.heat.percent < 85){
                    this.weapon.overheated = false;
                    Crafty.trigger("HideText");
                }
                    
            }
            if(this.preparing){
                this.preparing = false;
                    this.flicker=false;
            }
        }
       
         
            
        })
        .bind("Killed",function(points){
            this.score += points;
            // Crafty.trigger("UpdateStats");
        })
        .bind("Hurt",function(dmg){
           
            
        })
        .onHit("EnemyBullet",function(ent){
            var bullet = ent[0].obj;
            this.die();
            bullet.destroy();
        })
        .bind("PauseReset", function(){
            console.log("pause called");
            if(this.pause) {
               this.pause = false;
            }
            else {
                this.pause = true;
            }
        })
        .bind("RestoreHP",function(val){
            if(this.hp.current < this.hp.max){
                this.hp.current += val;
                // Crafty.trigger("UpdateStats");
            }
        
        })
        .bind("RestoreShield",function(val){
            if(this.shield.current < this.shield.max){
                this.shield.current += val;
                // Crafty.trigger("UpdateStats");
            }  
        
        })
        .bind("botKilled",function(){
           this.destroy();
        
        })
        .reset() /*Set initial points*/;
        return this;
    },
    reset:function(){
        this.hp = {
            current:10,
            max:10,
            percent:100
        };
        this.shield = {
            current:10,
            max:10,
            percent:100
        };
        this.heat = {
            current:0,
            max:100,
            percent:0
        }
        //Init position
        this.x = Crafty.viewport.width/2-this.w/2;
        this.y = Crafty.viewport.height-this.h-36;
        
        this.flicker = true;
        this.preparing = true;
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
     
        if(this.heat.current < this.heat.max)
            this.heat.current ++;
         
        if(this.heat.current >= this.heat.max){
            Crafty.trigger("ShowText","Weapon Overheated!");
            this.weapon.overheated = true;
        }
           
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
