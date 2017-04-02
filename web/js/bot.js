Crafty.c("Bot",{
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
    bars:{},
    infos:{},
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
        // .multiway(this.movementSpeed, { /*Enable Movement Control*/
        //     UP_ARROW: -90, 
        //     DOWN_ARROW: 90, 
        //     RIGHT_ARROW: 0, 
        //     LEFT_ARROW: 180
        // })
        // .bind('Moved', function(from) { /*Bind a function which is triggered if player is moved*/
        //     /*Dont allow to move the player out of Screen*/
        //     if(this.x+this.w > Crafty.viewport.width ||
        //         this.x+this.w < this.w || 
        //         this.y+this.h-35 < this.h || 
        //         this.y+this.h+35 > Crafty.viewport.height || this.preparing){
        //         this.attr({
        //             x:from.x, 
        //             y:from.y
        //         });
        //     }
          
        // })

    //     .bind("KeyDown", function(e) {
    //         console.log("Key called");
    //         if(e.keyCode === Crafty.keys.SPACE){
    //             keyDown = true;
    //         } 
    //        console.log(e.key);
    //        console.log(Crafty.keys.LEFT_ARROW);
    //         if (e.key == "ArrowLeft") {
    //   this.x = this.x-10;
    // } else if (e.key == "ArrowRight") {
    //   this.x = this.x+10;
    // } else if (e.key == "ArrowUp") {
    //   this.y = this.y-10;
    // } else if (e.key == "ArrowDown") {
    //   this.y = this.y+10;
    // }
    //     })
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
          
            
            // this.y += 1.5;
            if(this.preparing){
                this.preparing = false;
                this.flicker=false;
                // this.y--;
                // if(this.y < Crafty.viewport.height-this.h-Crafty.viewport.height/4){
                //     this.preparing = false;
                //     this.flicker=false;
                  
                // }
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
        .bind("Killed",function(points){
            this.score += points;
            // Crafty.trigger("UpdateStats");
        })
        .bind("Hurt",function(dmg){
            this.updateStats(this.hitScore);
            // Crafty.trigger("UpdateStats", 1);
            // Crafty.trigger("UpdateStats");
            // if(this.hp.current <= 0) this.die();
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
        // .bind("RestoreHP",function(val){
        //     if(this.hp.current < this.hp.max){
        //         this.hp.current += val;
        //         // Crafty.trigger("UpdateStats");
        //     }
        
        // })
        // .bind("RestoreShield",function(val){
        //     if(this.shield.current < this.shield.max){
        //         this.shield.current += val;
        //         // Crafty.trigger("UpdateStats");
        //     }  
        
        // })
        .reset() /*Set initial points*/;
        return this;
    },
    place: function(lives, hitScore,killScore,firerate){
        this.lives = lives;
        this.hitScore=hitScore;
        this.killScore=killScore;
        this.weapon.firerate = firerate;
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
        // Crafty.trigger("UpdateStats");
        //Init position
        this.x = Crafty.viewport.width/2-this.w/2;
        this.y = Crafty.viewport.height-this.h-36;
        
        this.flicker = true;
        this.preparing = true;
    },
    // shoot:function(){ 
    //     if(this.preparing) return;
        
    //         var bullet = Crafty.e(this.weapon.name,"BotBullet");
    //         bullet.attr({
    //             playerID:this[0],
                
    //             x: this._x+30,
    //             y: (this._y-this._h/2) + 90,
    //             rotation: this._rotation,
    //             yspeed: 10 * Math.sin(this._rotation / (180 / Math.PI)),
    //             xspeed: 10 * Math.cos(this._rotation / (180 / Math.PI))
    //         }); 
    //         console.log(bullet.x);
     
    //     if(this.heat.current < this.heat.max)
    //         this.heat.current ++;
         
    //     if(this.heat.current >= this.heat.max){
    //         Crafty.trigger("ShowText","Weapon Overheated!");
    //         this.weapon.overheated = true;
    //     }
           
    // },
    die:function(){
        Crafty.e("RandomExplosion").attr({
            x:this.x,
            y:this.y
        });
        Crafty.trigger("UpdateScore");
        Crafty.trigger("UpdateLevel");
       this.destroy();
        Crafty.trigger("botKilled");

        // Crafty.trigger("UpdateStats");
        // if(this.lives <= 0){
        //     this.destroy();
        //     Crafty.trigger("GameOver",this.score);
        // }else{
        //     this.reset();
        // }
        
        
    },
    updateStats:function(score){
      Crafty.trigger("UpdateStats", score);
    }
    
});
